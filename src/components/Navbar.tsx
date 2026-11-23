'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Utensils, Calendar, ShoppingBag, Menu as MenuIcon, X, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const pathname = usePathname();
  const { config, getCartTotal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = getCartTotal();

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Carta', href: '/carta' },
    { label: 'Reservas', href: '/reservas' },
    { label: 'Nosotros', href: '/#nosotros' },
    { label: 'Contacto', href: '/#contacto' },
  ];

  const isCartActive = config.whatsappOrdersEnabled || itemCount > 0;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E4DA] transition-all">
        {/* Top announcement bar */}
        <div className="bg-[#263321] text-[#FAF8F5] text-xs py-1.5 px-4 text-center tracking-wider font-light flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C08A3E]" />
            Sevilla Este &bull; Calle Prof. Manuel Clavero Arévalo, 9
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <a href={`tel:${config.phone}`} className="hidden md:flex items-center gap-1.5 hover:text-[#C08A3E] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#C08A3E]" />
            {config.phone}
          </a>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex flex-col group">
            <span className="text-xl sm:text-2xl font-serif-editorial tracking-tight text-[#1C1C1A] group-hover:text-[#4D6444] transition-colors font-medium">
              LA TENTACIÓN
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#62625C] uppercase -mt-0.5 font-light">
              Gastrobar Sevilla Este
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium transition-colors hover:text-[#384A31] relative py-1 ${
                    isActive ? 'text-[#384A31]' : 'text-[#62625C]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4D6444] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full hover:bg-[#EFE9DE] transition-colors text-[#2C2C28] flex items-center justify-center"
                title="Ver carrito de pedido"
                aria-label="Abrir carrito de pedido"
              >
                <ShoppingBag className="w-5 h-5 text-[#2C2C28]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#4D6444] text-[#FAF8F5] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Reserve CTA */}
            <Link
              href="/reservas"
              className="px-5 py-2.5 rounded-full bg-[#384A31] hover:bg-[#263321] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Reservar Mesa
            </Link>

            {/* Link to Admin */}
            <Link
              href="/admin"
              className="p-2 text-[#93938B] hover:text-[#2C2C28] transition-colors"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full hover:bg-[#EFE9DE] text-[#2C2C28]"
                aria-label="Ver carrito"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#4D6444] text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#2C2C28] hover:bg-[#EFE9DE] focus:outline-none"
              aria-label="Alternar menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E4DA] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-[#EFE9DE] text-[#263321] font-semibold'
                      : 'text-[#42423D] hover:bg-[#F5F1EB]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E4DA] flex flex-col gap-2">
              <Link
                href="/reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#384A31] text-[#FAF8F5] rounded-xl font-medium tracking-wide text-sm"
              >
                Reservar Mesa
              </Link>

              <div className="flex justify-between items-center px-2 pt-2">
                <a
                  href={`tel:${config.phone}`}
                  className="text-xs text-[#62625C] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C08A3E]" />
                  {config.phone}
                </a>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#93938B] hover:text-[#2C2C28] flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Acceso Dueño
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile QR Customers */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-[#E8E4DA] md:hidden px-6 py-2.5 flex items-center justify-around shadow-lg">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname === '/' ? 'text-[#384A31] font-bold' : 'text-[#62625C]'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span>Inicio</span>
        </Link>

        <Link
          href="/carta"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname === '/carta' ? 'text-[#384A31] font-bold' : 'text-[#62625C]'
          }`}
        >
          <MenuIcon className="w-5 h-5" />
          <span>Carta</span>
        </Link>

        {onOpenCart && (
          <button
            onClick={onOpenCart}
            className="relative flex flex-col items-center gap-1 text-[11px] font-medium text-[#62625C]"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#4D6444] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span>Pedido</span>
          </button>
        )}

        <Link
          href="/reservas"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname === '/reservas' ? 'text-[#384A31] font-bold' : 'text-[#62625C]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Reservas</span>
        </Link>
      </div>
    </>
  );
};
