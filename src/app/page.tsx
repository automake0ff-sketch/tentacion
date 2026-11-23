'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Product } from '@/types';
import {
  Calendar,
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wine,
  Flame,
  Award,
  Camera,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const { config, products, promotions } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter 6 highlight specialties
  const specialtyNames = [
    'Patatas bravas',
    'Croquetas de chuletón',
    'Brioche de carrillada',
    'Taquitos de atún picante',
    'Arroz meloso de carrillada',
    'Torrija de pan brioche',
  ];

  const specialties = products.filter((p) => specialtyNames.includes(p.name));

  // Ambiance gallery photos
  const ambiancePhotos = [
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      title: 'Ambiente Acogedor & Moderno',
      tag: 'Interior',
    },
    {
      url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
      title: 'Terraza para Tardes Sevillanas',
      tag: 'Terraza',
    },
    {
      url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      title: 'Detalles & Iluminación Íntima',
      tag: 'Experiencia',
    },
    {
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      title: 'Cocina Vista & Creatividad',
      tag: 'Fusión',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1C1C1A]">
        {/* Background photo with fine overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt="Restaurante La Tentación Sevilla Este"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#FAF8F5] py-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs uppercase tracking-[0.25em] text-[#C08A3E]">
            <Sparkles className="w-3.5 h-3.5" />
            Gastrobar &bull; Sevilla Este
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-editorial tracking-tight leading-[1.1] font-light">
            {config.tagline || '«Una experiencia para dejarse llevar»'}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#D8D6CE] font-light leading-relaxed">
            Cocina mediterránea con personalidad, sabores que sorprenden y momentos que merecen repetirse.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/carta"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#1C1C1A] hover:bg-[#EFE9DE] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>DESCUBRIR LA CARTA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/reservas"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#384A31] hover:bg-[#263321] text-[#FAF8F5] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C08A3E]" />
              <span>RESERVAR MESA</span>
            </Link>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-white/15 max-w-3xl mx-auto text-left">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C08A3E] font-medium block">
                Ubicación
              </span>
              <span className="text-xs text-[#D8D6CE] mt-0.5 block">
                Calle Prof. Manuel Clavero Arévalo, 9
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C08A3E] font-medium block">
                Reservas Oficiales
              </span>
              <span className="text-xs text-[#D8D6CE] mt-0.5 block">
                CoverManager Garantizado
              </span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-xs uppercase tracking-wider text-[#C08A3E] font-medium block">
                Fusión Mediterránea
              </span>
              <span className="text-xs text-[#D8D6CE] mt-0.5 block">
                Tapas de autor y brasas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C08A3E] font-semibold">
            Nuestra Esencia
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial text-[#1C1C1A]">
            Especialidades de La Tentación
          </h2>
          <p className="text-sm text-[#62625C] leading-relaxed">
            Elaboraciones icónicas preparadas con mimo diario: bocados que combinan tradición andaluza, producto seleccionado y matices contemporáneos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specialties.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/carta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#384A31] text-[#384A31] hover:bg-[#384A31] hover:text-white transition-all text-xs uppercase tracking-widest font-semibold"
          >
            <span>Ver la carta completa y precios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. PROMOTIONS / EXPERIENCES SECTION */}
      {promotions.filter((p) => p.isActive).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#263321] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C08A3E] font-bold">
                Momentos Especiales
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-editorial">
                Experiencias y Sugerencias de Temporada
              </h3>
              <p className="text-sm text-[#D8D6CE] leading-relaxed">
                Descubre nuestros platos fuera de carta y arroces melosos de fin de semana en Sevilla Este.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/reservas"
                  className="px-6 py-3 rounded-full bg-[#FAF8F5] text-[#263321] text-xs uppercase tracking-wider font-bold hover:bg-[#EFE9DE] transition-colors"
                >
                  Reservar para este fin de semana
                </Link>
                <Link
                  href="/carta"
                  className="px-6 py-3 rounded-full border border-white/30 text-white text-xs uppercase tracking-wider font-semibold hover:bg-white/10 transition-colors"
                >
                  Consultar carta
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ABOUT US SECTION */}
      <section id="nosotros" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photos collage */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-[#EFE9DE]">
              <img
                src={config.aboutImage}
                alt="Ambiente en Restaurante La Tentación"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl shadow-xl border border-[#E8E4DA] max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#384A31] text-[#FAF8F5] flex items-center justify-center font-serif-editorial text-lg">
                  T
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#1C1C1A]">
                    Sevilla Este
                  </h4>
                  <p className="text-[11px] text-[#62625C]">Gastrobar mediterráneo contemporáneo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text story */}
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C08A3E] font-semibold">
              Sobre Nosotros
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-editorial text-[#1C1C1A] leading-tight">
              Cocina fusión mediterránea con raíces andaluzas y espíritu contemporáneo
            </h2>
            <div className="space-y-4 text-sm text-[#62625C] leading-relaxed">
              <p>
                En <strong>Restaurante La Tentación</strong> concebimos la gastronomía como un punto de encuentro: una experiencia informal y acogedora donde el comensal puede disfrutar desde una tapa rápida de autor en barra hasta una comida reposada con carnes a la brasa, arroces melosos y postres caseros.
              </p>
              <p>
                Nuestra propuesta apuesta por presentaciones cuidadas, sabores limpios y combinaciones atrevidas que sorprenden al paladar sin perder el respeto por la materia prima de primera calidad.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E4DA]">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#C08A3E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1A]">Elaboraciones Propias</h4>
                  <p className="text-[11px] text-[#93938B]">Guisos al punto y salsas artesanales</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wine className="w-5 h-5 text-[#384A31] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1A]">Atención Cercana</h4>
                  <p className="text-[11px] text-[#93938B]">Ambiente cálido, moderno y familiar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AMBIENCE GALLERY */}
      <section className="bg-[#EFE9DE]/50 py-16 border-y border-[#E8E4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C08A3E] font-semibold">
                Espacios
              </span>
              <h2 className="text-3xl font-serif-editorial text-[#1C1C1A] mt-1">
                El Ambiente de La Tentación
              </h2>
            </div>
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#384A31] font-semibold hover:underline"
            >
              <Camera className="w-4 h-4 text-[#C08A3E]" />
              Ver más momentos en Instagram
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ambiancePhotos.map((photo, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#D8D6CE] shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-[#C08A3E] font-bold">
                    {photo.tag}
                  </span>
                  <h4 className="text-sm font-medium">{photo.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RESERVATIONS CALLOUT SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E4DA] shadow-lg text-center space-y-6">
          <div className="w-14 h-14 bg-[#EEF4EB] text-[#384A31] rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-serif-editorial text-[#1C1C1A]">
              Asegura tu Mesa en La Tentación
            </h2>
            <p className="text-sm text-[#62625C] max-w-lg mx-auto">
              Gestiona tu reserva al instante a través de nuestro motor oficial garantizado o contáctanos directamente para consultas de grupo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={config.officialReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#384A31] hover:bg-[#263321] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Reservar en CoverManager (Oficial)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/reservas"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#E8E4DA] text-[#2C2C28] hover:bg-[#FAF8F5] text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Opciones y Consultas WhatsApp</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. LOCATION & MAP ACCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FAF8F5] rounded-3xl p-8 border border-[#E8E4DA]">
          <div className="space-y-2">
            <MapPin className="w-6 h-6 text-[#C08A3E]" />
            <h3 className="font-serif-editorial text-xl text-[#1C1C1A]">Ubicación</h3>
            <p className="text-xs text-[#62625C] leading-relaxed">
              {config.address}
              <br />
              {config.postalCode} {config.city}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${config.name} ${config.address} ${config.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#384A31] font-semibold hover:underline pt-2"
            >
              Ver ruta en Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2">
            <Clock className="w-6 h-6 text-[#384A31]" />
            <h3 className="font-serif-editorial text-xl text-[#1C1C1A]">Horarios de Cocina</h3>
            <div className="text-xs text-[#62625C] space-y-1">
              {config.schedule.map((s, idx) => (
                <div key={idx}>
                  <strong>{s.days}:</strong> {s.hours}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C08A3E]" />
            <h3 className="font-serif-editorial text-xl text-[#1C1C1A]">Contacto Directo</h3>
            <p className="text-xs text-[#62625C]">
              Teléfono: <a href={`tel:${config.phone}`} className="font-semibold text-[#1C1C1A]">{config.phone}</a>
            </p>
            <p className="text-xs text-[#62625C]">
              Email: <a href={`mailto:${config.email}`} className="text-[#384A31]">{config.email}</a>
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-[#93938B]">
                Acceso para clientes desde QR en mesa o reserva previa.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
