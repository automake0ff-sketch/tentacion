'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Product } from '@/types';
import { Search, Filter, Sparkles, AlertCircle, Info, ChevronRight, Check } from 'lucide-react';

export default function CartaPage() {
  const { categories, products, config } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySpecialties, setOnlySpecialties] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Specialties filter
      if (onlySpecialties && !p.isSpecialty && p.badge !== 'ESPECIALIDAD') {
        return false;
      }
      // Availability filter
      if (onlyAvailable && !p.isAvailable) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesAllergens = p.allergens.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesAllergens) return false;
      }
      return true;
    });
  }, [products, selectedCategory, onlySpecialties, onlyAvailable, searchQuery]);

  // Group by category if 'all' is selected
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-28">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C08A3E] font-semibold">
          Propuesta Culinaria
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-editorial text-[#1C1C1A]">
          La Carta Digital
        </h1>
        <p className="text-sm text-[#62625C] leading-relaxed">
          Tapas creativas, brioches artesanos, arroces con fondo casero, carnes seleccionadas y bocados contemporáneos. Puedes añadir tus platos al carrito para preparar tu consulta o pedido por WhatsApp.
        </p>
      </div>

      {/* Notice on Verified vs Indicative Prices */}
      <div className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#62625C] shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C08A3E] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1C1C1A]">Transparencia de Carta:</span>
            <p className="text-[#62625C] mt-0.5">
              Los precios recopilados proceden de fuentes y reportajes gastronómicos de febrero de 2026. Los platos señalados con &laquo;Consultar precio&raquo; se encuentran pendientes de ratificación por el propietario y pueden actualizarse en el restaurante.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8E4DA] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#93938B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por plato, ingrediente o alérgeno (ej: carrillada, atún, trufa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] rounded-xl text-xs sm:text-sm border border-[#E8E4DA] focus:outline-none focus:border-[#4D6444] text-[#1C1C1A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#93938B] hover:text-[#1C1C1A]"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick toggle pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setOnlySpecialties(!onlySpecialties)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                onlySpecialties
                  ? 'bg-[#C08A3E] text-white border-[#C08A3E]'
                  : 'bg-[#FAF8F5] text-[#42423D] border-[#E8E4DA] hover:bg-[#EFE9DE]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Solo Especialidades
            </button>

            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                onlyAvailable
                  ? 'bg-[#384A31] text-white border-[#384A31]'
                  : 'bg-[#FAF8F5] text-[#42423D] border-[#E8E4DA] hover:bg-[#EFE9DE]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Solo Disponibles
            </button>
          </div>
        </div>

        {/* Horizontal Category Nav Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#F5F1EB]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#263321] text-white shadow-sm'
                : 'bg-[#FAF8F5] text-[#62625C] hover:bg-[#EFE9DE]'
            }`}
          >
            Todas ({products.length})
          </button>

          {sortedCategories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#263321] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#62625C] hover:bg-[#EFE9DE]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Display */}
      {selectedCategory === 'all' && !searchQuery && !onlySpecialties ? (
        // Render category by category
        <div className="space-y-16">
          {sortedCategories.map((cat) => {
            const categoryProducts = filteredProducts.filter((p) => p.category === cat.slug);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={cat.id} className="space-y-6">
                <div className="border-b border-[#E8E4DA] pb-3 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-2xl font-serif-editorial text-[#1C1C1A]">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-[#62625C] mt-0.5">{cat.description}</p>
                  </div>
                  <span className="text-xs text-[#93938B]">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'elaboración' : 'elaboraciones'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Flat filtered grid
        <div>
          <div className="mb-6 flex justify-between items-center text-xs text-[#62625C]">
            <span>
              Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'plato' : 'platos'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E4DA] space-y-3">
              <Search className="w-10 h-10 text-[#93938B] mx-auto" />
              <h3 className="font-serif-editorial text-lg text-[#1C1C1A]">
                No encontramos platos con estos filtros
              </h3>
              <p className="text-xs text-[#62625C]">
                Prueba a restablecer la búsqueda o seleccionar otra categoría.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlySpecialties(false);
                  setOnlyAvailable(false);
                }}
                className="px-4 py-2 bg-[#384A31] text-white rounded-full text-xs font-medium"
              >
                Ver todos los platos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Detail */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
