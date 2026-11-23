'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, Category, Promotion } from '@/types';
import {
  ShieldCheck,
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  ShoppingBag,
  CalendarCheck,
  Settings,
  Sparkles,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Save,
  Eye,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const {
    config,
    categories,
    products,
    promotions,
    orders,
    reservations,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateOrderStatus,
    updateReservationStatus,
    resetToDefaults,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'reservations' | 'promotions' | 'settings'
  >('dashboard');

  // Auth form
  const [passphraseInput, setPassphraseInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Editing Product Modal / Form
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Editing Category
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Editing Promotion
  const [editingPromotion, setEditingPromotion] = useState<Partial<Promotion> | null>(null);
  const [isNewPromotion, setIsNewPromotion] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(config);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passphraseInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPassphraseInput('');
    }
  };

  // Login Screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E4DA] shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-[#EEF4EB] text-[#384A31] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-serif-editorial text-[#1C1C1A]">
              Panel de Gestión Privado
            </h2>
            <p className="text-xs text-[#62625C]">
              Restaurante La Tentación &bull; Sevilla Este
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DA] text-xs text-[#62625C] text-left">
            <p>
              Introduce la clave maestra de acceso seguro autorizada para el administrador y propietarios.
            </p>
            <div className="mt-2 text-[11px] text-[#93938B]">
              Clave de demostración: <code className="bg-[#EFE9DE] px-1.5 py-0.5 rounded text-[#1C1C1A]">tentacion2026</code>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Clave de acceso"
              value={passphraseInput}
              onChange={(e) => {
                setPassphraseInput(e.target.value);
                setAuthError(false);
              }}
              className="w-full text-center tracking-widest text-base p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl focus:outline-none focus:border-[#4D6444]"
            />

            {authError && (
              <p className="text-xs text-red-600 font-medium">
                Clave incorrecta. Por favor verifica tus credenciales.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#384A31] hover:bg-[#263321] text-white rounded-xl text-xs uppercase font-bold tracking-wider transition-all"
            >
              Acceder al Panel
            </button>
          </form>

          <div className="pt-2">
            <Link href="/" className="text-xs text-[#93938B] hover:text-[#1C1C1A]">
              &larr; Volver a la web pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isAvailable).length;
  const outOfStockProducts = totalProducts - activeProducts;
  const pendingVerificationProducts = products.filter(
    (p) => p.verification_status !== 'verified'
  ).length;
  const activePromos = promotions.filter((p) => p.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Top Admin Header */}
      <div className="bg-[#1C1C1A] text-[#FAF8F5] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#C08A3E] font-semibold">
              Panel Administrativo Oficial
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-editorial">
            Restaurante La Tentación
          </h1>
          <p className="text-xs text-[#93938B]">
            Gestión completa de carta, precios, disponibilidad, pedidos y configuración del negocio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/carta"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Carta Pública</span>
            <ExternalLink className="w-3 h-3 text-white/50" />
          </Link>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[#E8E4DA]">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: `Carta (${totalProducts})`, icon: UtensilsCrossed },
          { id: 'categories', label: `Categorías (${categories.length})`, icon: FolderTree },
          { id: 'orders', label: `Pedidos WhatsApp (${orders.length})`, icon: ShoppingBag },
          { id: 'reservations', label: `Solicitudes Reservas (${reservations.length})`, icon: CalendarCheck },
          { id: 'promotions', label: `Promociones (${promotions.length})`, icon: Sparkles },
          { id: 'settings', label: 'Datos del Negocio', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#384A31] text-white shadow-sm'
                  : 'bg-white text-[#62625C] hover:bg-[#EFE9DE] border border-[#E8E4DA]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-1">
              <span className="text-xs uppercase text-[#93938B] font-semibold">Platos Activos</span>
              <div className="text-3xl font-serif-editorial text-[#1C1C1A]">{activeProducts}</div>
              <div className="text-[11px] text-[#65825A]">Disponibles para comanda</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-1">
              <span className="text-xs uppercase text-[#93938B] font-semibold">Agotados</span>
              <div className="text-3xl font-serif-editorial text-[#A8583B]">{outOfStockProducts}</div>
              <div className="text-[11px] text-[#A8583B]">Marcados como sin stock</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-1">
              <span className="text-xs uppercase text-[#93938B] font-semibold">Pendientes Verif.</span>
              <div className="text-3xl font-serif-editorial text-[#C08A3E]">{pendingVerificationProducts}</div>
              <div className="text-[11px] text-[#C08A3E]">Precios/formatos a ratificar</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-1">
              <span className="text-xs uppercase text-[#93938B] font-semibold">Pedidos Registrados</span>
              <div className="text-3xl font-serif-editorial text-[#384A31]">{orders.length}</div>
              <div className="text-[11px] text-[#62625C]">Sesiones WhatsApp abiertas</div>
            </div>
          </div>

          {/* Quick Actions and Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verification Alert Box */}
            <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E4DA] space-y-3">
              <div className="flex items-center gap-2 text-[#C08A3E]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif-editorial text-lg text-[#1C1C1A]">
                  Auditoría de Carta para el Propietario
                </h3>
              </div>
              <p className="text-xs text-[#62625C] leading-relaxed">
                Hay {pendingVerificationProducts} productos cuyos precios se marcaron inicialmente como orientativos conforme al reportaje gastronómico de febrero de 2026. Puedes revisarlos y pulsar &laquo;Verificado&raquo; en la pestaña <strong>Carta</strong>.
              </p>
              <button
                onClick={() => setActiveTab('products')}
                className="px-4 py-2 bg-[#384A31] text-white rounded-xl text-xs font-semibold hover:bg-[#263321] transition-colors"
              >
                Revisar productos pendientes
              </button>
            </div>

            {/* Quick Order Mode Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DA] space-y-3 shadow-sm">
              <h3 className="font-serif-editorial text-lg text-[#1C1C1A]">
                Estado de Pedidos por WhatsApp
              </h3>
              <p className="text-xs text-[#62625C]">
                Actualmente el servicio directo de pedidos está:{' '}
                <strong className={config.whatsappOrdersEnabled ? 'text-green-700' : 'text-amber-700'}>
                  {config.whatsappOrdersEnabled ? 'Habilitado (Comanda Activa)' : 'Modo Consulta (Recomendado sin cocina delivery)'}
                </strong>
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateConfig({ whatsappOrdersEnabled: !config.whatsappOrdersEnabled })}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    config.whatsappOrdersEnabled
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-green-100 text-green-900 hover:bg-green-200'
                  }`}
                >
                  {config.whatsappOrdersEnabled ? 'Desactivar Pedidos Directos' : 'Activar Pedidos Directos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">
                Gestión de Platos y Precios
              </h2>
              <p className="text-xs text-[#62625C]">
                Modifica precios, añade fotos reales de tus elaboraciones, activa/desactiva disponibilidad y gestiona alérgenos.
              </p>
            </div>

            <button
              onClick={() => {
                setIsNewProduct(true);
                setEditingProduct({
                  name: '',
                  category: categories[0]?.slug || 'entrantes-tapas',
                  description: '',
                  price: 0,
                  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                  isSpecialty: false,
                  isFeatured: false,
                  isAvailable: true,
                  badge: null,
                  allergens: [],
                  sortOrder: products.length + 1,
                  verification_status: 'verified',
                  source: 'Añadido por el propietario',
                  last_verified_at: new Date().toISOString().split('T')[0],
                  notes: 'Verificado por el administrador',
                });
              }}
              className="px-4 py-2.5 bg-[#384A31] hover:bg-[#263321] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Plato</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-[#E8E4DA] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#42423D] border-b border-[#E8E4DA] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Plato</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Estado Verif.</th>
                    <th className="py-3 px-4 text-center">Disponible</th>
                    <th className="py-3 px-4 text-center">Especialidad</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F1EB]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-[#1C1C1A] text-sm">{p.name}</div>
                            {p.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E4DA] text-[#62625C]">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#62625C]">
                        {categories.find((c) => c.slug === p.category)?.name || p.category}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#1C1C1A]">
                        {p.price !== null ? (
                          `${p.price.toFixed(2)} €`
                        ) : (
                          <span className="text-amber-800 text-[11px] font-normal">
                            {p.priceDisplayNote || 'Consultar'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {p.verification_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            p.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.isAvailable ? 'Activo' : 'Agotado'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.isSpecialty}
                          onChange={(e) => updateProduct(p.id, { isSpecialty: e.target.checked })}
                          className="accent-[#384A31] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setIsNewProduct(false);
                            setEditingProduct(p);
                          }}
                          className="p-1.5 text-[#384A31] hover:bg-[#EEF4EB] rounded-lg transition-colors"
                          title="Editar plato"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar definitivamente "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar plato"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E4DA] shadow-2xl my-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#E8E4DA] pb-4">
              <h3 className="font-serif-editorial text-2xl text-[#1C1C1A]">
                {isNewProduct ? 'Añadir Nuevo Plato' : `Editar: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">Nombre del plato *</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#42423D] mb-1">Categoría</label>
                <select
                  value={editingProduct.category || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#42423D] mb-1">
                  Precio exacto (€) o dejar vacío si no está confirmado
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={editingProduct.price !== null && editingProduct.price !== undefined ? editingProduct.price : ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  placeholder="Ej: 8.50"
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">
                  Nota de precio (cuando no hay un precio fijo, ej: &quot;Consultar precio&quot; o &quot;7 € / 100g&quot;)
                </label>
                <input
                  type="text"
                  value={editingProduct.priceDisplayNote || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, priceDisplayNote: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">URL de la Fotografía</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">Descripción de la elaboración</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#42423D] mb-1">Etiqueta destacada</label>
                <select
                  value={editingProduct.badge || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      badge: (e.target.value as any) || null,
                    })
                  }
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                >
                  <option value="">(Sin etiqueta)</option>
                  <option value="ESPECIALIDAD">ESPECIALIDAD</option>
                  <option value="RECOMENDADO">RECOMENDADO</option>
                  <option value="NUEVO">NUEVO</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#42423D] mb-1">Estado de verificación</label>
                <select
                  value={editingProduct.verification_status || 'verified'}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      verification_status: e.target.value as any,
                      last_verified_at: new Date().toISOString().split('T')[0],
                    })
                  }
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                >
                  <option value="verified">Verificado por el dueño</option>
                  <option value="pending_verification">Pendiente de verificación</option>
                  <option value="unconfirmed_format">Formato sin confirmar (tapa vs ración)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">
                  Alérgenos (separados por comas, ej: Gluten, Lácteos, Huevos)
                </label>
                <input
                  type="text"
                  value={(editingProduct.allergens || []).join(', ')}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      allergens: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#42423D] mb-1">Notas internas de auditoría</label>
                <input
                  type="text"
                  value={editingProduct.notes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E4DA]">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!editingProduct.name) {
                    alert('El nombre es obligatorio');
                    return;
                  }
                  if (isNewProduct) {
                    addProduct(editingProduct as any);
                  } else if (editingProduct.id) {
                    updateProduct(editingProduct.id, editingProduct);
                  }
                  setEditingProduct(null);
                }}
                className="px-6 py-2.5 bg-[#384A31] hover:bg-[#263321] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Plato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES CRUD */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">Categorías de la Carta</h2>
              <p className="text-xs text-[#62625C]">Organiza y titula las secciones del menú digital.</p>
            </div>

            <button
              onClick={() => {
                const name = prompt('Nombre de la nueva categoría:');
                if (name) {
                  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  addCategory({
                    name,
                    slug,
                    description: '',
                    sortOrder: categories.length + 1,
                  });
                }
              }}
              className="px-4 py-2 bg-[#384A31] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nueva Categoría
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif-editorial font-semibold text-[#1C1C1A]">{cat.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const newName = prompt('Nuevo nombre:', cat.name);
                        if (newName) updateCategory(cat.id, { name: newName });
                      }}
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar categoría "${cat.name}"?`)) deleteCategory(cat.id);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#62625C]">{cat.description || '(Sin descripción)'}</p>
                <div className="text-[11px] text-[#93938B]">Slug: {cat.slug}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS REGISTER */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">Registro de Pedidos y Consultas</h2>
            <p className="text-xs text-[#62625C]">
              Sesiones generadas desde el carrito para WhatsApp. El estado permite llevar el control interno de comandas en sala.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-[#62625C] border border-[#E8E4DA] text-xs">
              No hay pedidos registrados en esta sesión.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#F5F1EB] pb-3">
                    <div>
                      <span className="font-bold text-sm text-[#1C1C1A]">{ord.customerName}</span>
                      <span className="text-xs text-[#62625C] ml-2">({ord.customerPhone || 'Sin teléfono'})</span>
                      <div className="text-[11px] text-[#93938B]">
                        Modalidad: {ord.orderMode} {ord.tableNumber && `— Mesa: ${ord.tableNumber}`} &bull; {new Date(ord.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg border border-[#E8E4DA] bg-[#FAF8F5] font-semibold"
                      >
                        <option value="ready_to_send">Preparado para enviar</option>
                        <option value="whatsapp_opened">WhatsApp abierto</option>
                        <option value="confirmed_by_restaurant">Confirmado por restaurante</option>
                      </select>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="text-xs space-y-1">
                    {ord.items.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>
                          {it.productName} x{it.quantity} {it.itemNotes && `(${it.itemNotes})`}
                        </span>
                        <span className="font-medium">
                          {it.price !== null ? `${(it.price * it.quantity).toFixed(2)} €` : 'A consultar'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#F5F1EB] text-xs font-bold text-[#1C1C1A]">
                    <span>Total estimado:</span>
                    <span>{ord.total.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESERVATIONS REQUESTS */}
      {activeTab === 'reservations' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">Solicitudes de Reserva Alternativas</h2>
            <p className="text-xs text-[#62625C]">
              Peticiones recibidas por el canal WhatsApp alternativo pendientes de confirmación por el restaurante.
            </p>
          </div>

          {reservations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-[#62625C] border border-[#E8E4DA] text-xs">
              No hay solicitudes de reserva registradas por este canal.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-[#1C1C1A]">{res.customerName}</h4>
                      <p className="text-xs text-[#62625C]">{res.customerPhone}</p>
                    </div>
                    <select
                      value={res.status}
                      onChange={(e) => updateReservationStatus(res.id, e.target.value as any)}
                      className="text-xs p-1 rounded-lg border border-[#E8E4DA] bg-[#FAF8F5]"
                    >
                      <option value="pending_confirmation">Pendiente</option>
                      <option value="contacted">Confirmada / Contactada</option>
                    </select>
                  </div>

                  <div className="text-xs text-[#42423D] space-y-1 pt-1">
                    <div><strong>Fecha:</strong> {res.date} &bull; <strong>Hora:</strong> {res.time}</div>
                    <div><strong>Comensales:</strong> {res.guests} &bull; <strong>Zona:</strong> {res.seatingPreference}</div>
                    {res.notes && <div><strong>Notas:</strong> {res.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PROMOTIONS */}
      {activeTab === 'promotions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">Promociones y Eventos</h2>
              <p className="text-xs text-[#62625C]">
                Crea avisos, eventos especiales o sugerencias gastronómicas temporales.
              </p>
            </div>

            <button
              onClick={() => {
                const title = prompt('Título de la promoción:');
                if (title) {
                  addPromotion({
                    title,
                    subtitle: 'Experiencia especial',
                    description: '',
                    badgeText: 'SUGERENCIA',
                    isActive: true,
                    sortOrder: promotions.length + 1,
                  });
                }
              }}
              className="px-4 py-2 bg-[#384A31] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nueva Promoción
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promotions.map((pr) => (
              <div key={pr.id} className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C08A3E]">
                    {pr.badgeText}
                  </span>
                  <button
                    onClick={() => updatePromotion(pr.id, { isActive: !pr.isActive })}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      pr.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pr.isActive ? 'Publicada' : 'Pausada'}
                  </button>
                </div>

                <h3 className="font-serif-editorial font-semibold text-lg text-[#1C1C1A]">{pr.title}</h3>
                <p className="text-xs text-[#62625C]">{pr.description}</p>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F5F1EB]">
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar promoción "${pr.title}"?`)) deletePromotion(pr.id);
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: BUSINESS SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-[#E8E4DA] pb-4">
            <h2 className="text-xl font-serif-editorial text-[#1C1C1A]">
              Configuración y Datos Reales del Negocio
            </h2>
            <p className="text-xs text-[#62625C]">
              Cualquier cambio se reflejará al instante en la microapp, enlaces y mensajes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-[#42423D] mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#42423D] mb-1">Titular / Eslogan</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#42423D] mb-1">Dirección Completa</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#42423D] mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#42423D] mb-1">Email Oficial</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#42423D] mb-1">Enlace a Instagram</label>
              <input
                type="text"
                value={settingsForm.instagramUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#42423D] mb-1">
                Motor de Reservas Activo
              </label>
              <select
                value={settingsForm.activeReservationProvider}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    activeReservationProvider: e.target.value as any,
                  })
                }
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              >
                <option value="official">CoverManager Oficial</option>
                <option value="alternative">Last.app Alternativo</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#42423D] mb-1">
                URL CoverManager Oficial
              </label>
              <input
                type="text"
                value={settingsForm.officialReservationUrl}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, officialReservationUrl: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#42423D] mb-1">
                URL Last.app Alternativo
              </label>
              <input
                type="text"
                value={settingsForm.alternativeReservationUrl}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, alternativeReservationUrl: e.target.value })
                }
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#42423D] mb-1">
                Foto Principal del Hero (URL)
              </label>
              <input
                type="text"
                value={settingsForm.heroImage}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroImage: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#E8E4DA]">
            <button
              onClick={() => {
                if (confirm('¿Restablecer todos los datos a la configuración inicial por defecto?')) {
                  resetToDefaults();
                }
              }}
              className="text-xs text-red-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer datos por defecto
            </button>

            <button
              onClick={() => {
                updateConfig(settingsForm);
                alert('¡Configuración guardada correctamente!');
              }}
              className="px-6 py-3 bg-[#384A31] hover:bg-[#263321] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
