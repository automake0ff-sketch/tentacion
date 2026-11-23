'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { Plus, Check, AlertCircle, Sparkles, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, config } = useApp();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const badgeStyles: Record<string, string> = {
    ESPECIALIDAD: 'bg-[#C08A3E] text-white font-semibold',
    RECOMENDADO: 'bg-[#384A31] text-white font-medium',
    NUEVO: 'bg-[#A8583B] text-white font-medium',
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className={`group bg-white rounded-2xl border border-[#E8E4DA] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        !product.isAvailable ? 'opacity-65 grayscale-[30%]' : ''
      }`}
    >
      <div>
        {/* Image wrapper */}
        <div className="relative w-full h-48 sm:h-52 bg-[#EFE9DE] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.badge && (
              <span
                className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
                  badgeStyles[product.badge] || 'bg-[#2C2C28] text-white'
                }`}
              >
                {product.badge}
              </span>
            )}
            {!product.isAvailable && (
              <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#1C1C1A]/90 text-white font-semibold">
                Agotado hoy
              </span>
            )}
          </div>

          {/* Price Tag Pill */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md text-xs font-bold text-[#1C1C1A]">
            {product.price !== null ? (
              `${product.price.toFixed(2)} €`
            ) : (
              <span className="text-[11px] font-medium text-[#62625C]">
                {product.priceDisplayNote || 'Consultar precio'}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif-editorial text-lg text-[#1C1C1A] group-hover:text-[#384A31] transition-colors leading-snug">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-[#62625C] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="text-[10px] bg-[#FAF8F5] text-[#93938B] px-2 py-0.5 rounded border border-[#E8E4DA]"
                >
                  {allergen}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-[#F5F1EB] mt-3">
        <div className="text-[11px] text-[#93938B]">
          {product.verification_status === 'pending_verification' && (
            <span className="inline-flex items-center gap-1 text-[#C08A3E]" title="Precio orientativo pendiente de verificación">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E]"></span>
              Verificación pendiente
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.isAvailable}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
            !product.isAvailable
              ? 'bg-[#EFE9DE] text-[#93938B] cursor-not-allowed'
              : addedAnimation
              ? 'bg-[#4D6444] text-white'
              : 'bg-[#EFE9DE] text-[#263321] hover:bg-[#384A31] hover:text-white'
          }`}
          aria-label={`Añadir ${product.name} al pedido`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Añadido</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
