'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Phone,
} from 'lucide-react';

export default function ReservasPage() {
  const { config, submitReservation } = useApp();

  // Alternative Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<'interior' | 'terraza' | 'indiferente'>('interior');
  const [notes, setNotes] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  const activeProviderUrl =
    config.activeReservationProvider === 'official'
      ? config.officialReservationUrl
      : config.alternativeReservationUrl;

  const handleAlternativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !date) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    const reqData = {
      customerName,
      customerPhone,
      date,
      time,
      guests,
      seatingPreference,
      notes,
    };

    const record = submitReservation(reqData);
    setSubmittedRequest(record);

    // Prepare structured WhatsApp text
    const targetPhone = config.phone.replace(/[^0-9]/g, '');

    let msg = `*SOLICITUD DE RESERVA — RESTAURANTE LA TENTACIÓN*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Cliente:* ${customerName}\n`;
    msg += `*Teléfono:* ${customerPhone}\n`;
    msg += `*Fecha deseada:* ${date}\n`;
    msg += `*Hora:* ${time}\n`;
    msg += `*Personas:* ${guests}\n`;
    msg += `*Preferencia:* ${
      seatingPreference === 'interior' ? 'Sala interior' : seatingPreference === 'terraza' ? 'Terraza exterior' : 'Indiferente'
    }\n`;
    if (notes) {
      msg += `*Observaciones:* ${notes}\n`;
    }
    msg += `--------------------------------------\n`;
    msg += `_Importante: Entiendo que esta solicitud NO constituye una reserva confirmada y queda sujeta a la disponibilidad y confirmación del restaurante._`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${targetPhone}?text=${encoded}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-28">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C08A3E] font-semibold">
          Reserva de Mesa
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-editorial text-[#1C1C1A]">
          Vive La Tentación
        </h1>
        <p className="text-sm text-[#62625C] leading-relaxed">
          Para garantizar la mejor atención gastronómica y tiempos de servicio, te recomendamos reservar tu mesa con antelación en Sevilla Este.
        </p>
      </div>

      {/* Main Reservation Card: Official Engine Priority */}
      <div className="bg-[#263321] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5]/10 border border-white/20 text-xs uppercase tracking-wider text-[#C08A3E] font-semibold">
            Motor Recomendado
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-editorial text-[#FAF8F5]">
            Reserva Inmediata con Confirmación en Tiempo Real
          </h2>

          <p className="text-sm text-[#D8D6CE] leading-relaxed">
            Utiliza la plataforma oficial de reservas online del restaurante para seleccionar fecha, turno y comensales con disponibilidad asegurada.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href={activeProviderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#FAF8F5] text-[#263321] hover:bg-[#EFE9DE] rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Abrir Motor Oficial CoverManager</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {config.alternativeReservationUrl && (
              <a
                href={config.alternativeReservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 border border-white/30 text-white hover:bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Motor Alternativo (Last.app)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Calendar className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Alternative Form: WhatsApp Request */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E4DA] shadow-sm space-y-8">
        <div className="space-y-2 border-b border-[#E8E4DA] pb-6">
          <div className="flex items-center gap-2 text-[#384A31]">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-xl font-serif-editorial text-[#1C1C1A]">
              Canal Alternativo: Solicitud por WhatsApp
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#62625C]">
            ¿Tienes alguna petición especial, consulta para grupos numerosos o prefieres contactar con sala por WhatsApp? Rellena este formulario y generaremos el mensaje listo para enviar.
          </p>

          {/* CRITICAL DISCLAIMER */}
          <div className="bg-[#FAF8F5] border border-[#E8E4DA] p-3.5 rounded-xl flex items-start gap-3 text-xs text-[#8C6442] mt-3">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#C08A3E] mt-0.5" />
            <p>
              <strong>Aviso importante:</strong> El envío de este formulario abre WhatsApp pero <strong>NO equivale a una reserva confirmada</strong>. Tu mesa quedará reservada únicamente tras recibir la confirmación expresa por parte del equipo de Restaurante La Tentación.
            </p>
          </div>
        </div>

        {submittedRequest ? (
          <div className="bg-[#EEF4EB] p-6 rounded-2xl border border-[#D5E3CF] text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#4D6444] mx-auto" />
            <h4 className="font-serif-editorial text-lg text-[#263321]">
              ¡Solicitud generada con éxito!
            </h4>
            <p className="text-xs text-[#42423D] max-w-md mx-auto">
              Se ha abierto WhatsApp en tu dispositivo. Por favor dale a <strong>Enviar</strong> en WhatsApp para que nuestro equipo reciba tu petición.
            </p>
            <div className="text-[11px] text-[#65825A]">
              Código de solicitud interna: {submittedRequest.id}
            </div>
            <button
              onClick={() => setSubmittedRequest(null)}
              className="mt-3 px-4 py-2 bg-[#384A31] text-white rounded-xl text-xs font-medium"
            >
              Hacer otra consulta
            </button>
          </div>
        ) : (
          <form onSubmit={handleAlternativeSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Gómez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Teléfono móvil *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 641 00 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Fecha de la reserva *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Hora deseada *
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
                >
                  <optgroup label="Almuerzo">
                    <option value="13:30">13:30</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                    <option value="15:30">15:30</option>
                  </optgroup>
                  <optgroup label="Cena">
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                    <option value="22:00">22:00</option>
                    <option value="22:30">22:30</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Número de comensales
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuests(n)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        guests === n
                          ? 'bg-[#384A31] text-white border-[#384A31]'
                          : 'bg-[#FAF8F5] text-[#42423D] border-[#E8E4DA] hover:bg-[#EFE9DE]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                  Preferencia de ubicación
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['interior', 'terraza', 'indiferente'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setSeatingPreference(pref)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                        seatingPreference === pref
                          ? 'bg-[#384A31] text-white border-[#384A31]'
                          : 'bg-[#FAF8F5] text-[#42423D] border-[#E8E4DA] hover:bg-[#EFE9DE]'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#42423D] mb-1.5">
                Observaciones o peticiones (alergias, carritos, celebración...)
              </label>
              <textarea
                rows={3}
                placeholder="Indica aquí cualquier detalle para que el equipo lo prepare..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar Disponibilidad por WhatsApp
            </button>
          </form>
        )}
      </div>

      {/* Info on Groups & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E4DA]">
        <div className="space-y-2">
          <h4 className="font-serif-editorial text-lg text-[#1C1C1A]">
            Atención Telefónica Directa
          </h4>
          <p className="text-xs text-[#62625C] leading-relaxed">
            Para reservas en el mismo día o modificaciones urgentes, te sugerimos llamar al restaurante durante los horarios de servicio.
          </p>
          <a
            href={`tel:${config.phone}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#384A31] hover:underline pt-2"
          >
            <Phone className="w-4 h-4 text-[#C08A3E]" />
            {config.phone}
          </a>
        </div>

        <div className="space-y-2">
          <h4 className="font-serif-editorial text-lg text-[#1C1C1A]">
            Política de Puntualidad
          </h4>
          <p className="text-xs text-[#62625C] leading-relaxed">
            Mantenemos las reservas durante un margen de cortesía de 15 minutos respecto a la hora solicitada para optimizar los turnos de comensales.
          </p>
        </div>
      </div>
    </div>
  );
}
