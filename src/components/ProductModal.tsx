'use client';

import React from 'react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Plus, AlertCircle, ShieldAlert } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState('');

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E4DA] animate-scaleUp">
        {/* Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#EFE9DE]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-[#1C1C1A] hover:bg-white shadow"
          >
            <X className="w-5 h-5" />
          </button>
          {product.badge && (
            <span className="absolute bottom-4 left-4 bg-[#384A31] text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1C1A]">{product.name}</h3>
              <p className="text-sm text-[#4D6444] font-semibold mt-1">
                {product.price !== null
                  ? `${product.price.toFixed(2)} €`
                  : product.priceDisplayNote || 'Consultar precio'}
              </p>
            </div>
            {!product.isAvailable && (
              <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                Agotado por hoy
              </span>
            )}
          </div>

          <p className="text-sm text-[#42423D] leading-relaxed">{product.description}</p>

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold text-[#93938B] tracking-wider">
                Alérgenos comunicados:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.allergens.map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-white text-[#42423D] px-2.5 py-1 rounded-md border border-[#E8E4DA]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification disclaimer if pending */}
          {product.verification_status !== 'verified' && (
            <div className="bg-[#FBF4E8] p-3 rounded-xl border border-[#F5E6CD] flex items-start gap-2 text-xs text-[#8C6442]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C08A3E]" />
              <div>
                <span className="font-semibold">Información orientativa:</span>
                <p className="text-[11px] mt-0.5">{product.notes}</p>
              </div>
            </div>
          )}

          {/* Quantity and Notes */}
          <div className="space-y-2 pt-2 border-t border-[#E8E4DA]">
            <input
              type="text"
              placeholder="Notas para cocina (ej: punto de la carne, sin sal...)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
            />
          </div>

          {/* Button */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-[#E8E4DA] rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1 text-sm font-bold text-[#42423D]"
              >
                -
              </button>
              <span className="px-3 text-sm font-semibold text-[#1C1C1A]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1 text-sm font-bold text-[#42423D]"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                !product.isAvailable
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#384A31] text-white hover:bg-[#263321]'
              }`}
            >
              Añadir al pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
