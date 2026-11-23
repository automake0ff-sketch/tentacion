'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MapPin, Phone, Mail, Clock, ExternalLink, Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config } = useApp();

  return (
    <footer id="contacto" className="bg-[#1C1C1A] text-[#FAF8F5] pt-16 pb-24 md:pb-12 border-t border-[#2C2C28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-2xl font-serif-editorial tracking-tight text-[#FAF8F5]">
              LA TENTACIÓN
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C08A3E]">
              Gastrobar &bull; Sevilla Este
            </p>
            <p className="text-sm text-[#93938B] leading-relaxed">
              Cocina mediterránea de autor y fusión. Tradición reinventada con tapas creativas, carnes, pescados, arroces melosos y postres caseros.
            </p>
            <div className="pt-2">
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#D8D6CE] hover:text-[#C08A3E] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#C08A3E]" />
                @latentacionseveste
                <ExternalLink className="w-3 h-3 text-[#93938B]" />
              </a>
            </div>
          </div>

          {/* Col 2: Horarios */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#D8D6CE] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C08A3E]" />
              Horarios
            </h4>
            <div className="space-y-2 text-sm text-[#93938B]">
              {config.schedule.map((slot, index) => (
                <div key={index} className="border-b border-[#2C2C28] pb-1.5 last:border-0">
                  <div className="font-medium text-[#ECEAE4]">{slot.days}</div>
                  <div className="text-xs text-[#93938B]">{slot.hours}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Ubicación y Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#D8D6CE] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C08A3E]" />
              Encuéntranos
            </h4>
            <div className="space-y-2.5 text-sm text-[#93938B]">
              <p className="text-[#ECEAE4]">
                {config.address}
                <br />
                {config.postalCode} {config.city}
              </p>
              <p>
                <a
                  href={`tel:${config.phone}`}
                  className="hover:text-[#C08A3E] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C08A3E]" />
                  {config.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${config.email}`}
                  className="hover:text-[#C08A3E] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C08A3E]" />
                  {config.email}
                </a>
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${config.name} ${config.address} ${config.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C08A3E] hover:underline pt-1"
              >
                Abrir en Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 4: Enlaces rápidos y Reservas */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#D8D6CE]">
              Reservas & Acceso
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-[#93938B]">
              <Link href="/carta" className="hover:text-[#FAF8F5] transition-colors">
                Descubrir la Carta
              </Link>
              <Link href="/reservas" className="hover:text-[#FAF8F5] transition-colors">
                Reserva de Mesa Oficial
              </Link>
              <a
                href={config.officialReservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C08A3E] hover:underline flex items-center gap-1"
              >
                CoverManager Oficial
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link href="/admin" className="text-xs text-[#62625C] hover:text-[#93938B] pt-4">
                Panel de Gestión Privado
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="border-t border-[#2C2C28] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#62625C] gap-4">
          <p>&copy; 2026 {config.name}. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <span>Sevilla Este &bull; Gastronomía con personalidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
