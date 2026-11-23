'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OrderRecord } from '@/types';
import { X, Trash2, Plus, Minus, MessageSquare, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { config, cart, updateCartQuantity, updateCartNotes, removeFromCart, clearCart, getCartTotal, submitOrder } = useApp();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderMode, setOrderMode] = useState<'dineIn' | 'pickup' | 'delivery'>('dineIn');
  const [tableNumber, setTableNumber] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [orderSubmittedRecord, setOrderSubmittedRecord] = useState<any | null>(null);

  if (!isOpen) return null;

  const { subtotal, total, itemCount } = getCartTotal();

  const handleSendWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Por favor introduce tu nombre');
      return;
    }

    const orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'> = {
      customerName,
      customerPhone,
      orderMode: (config.whatsappOrdersEnabled ? orderMode : 'query_only') as OrderRecord['orderMode'],
      tableNumber: orderMode === 'dineIn' ? tableNumber : undefined,
      generalNotes,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        itemNotes: item.itemNotes,
      })),
      subtotal,
      total,
    };

    const savedRecord = submitOrder(orderData);
    setOrderSubmittedRecord(savedRecord);

    // Format WhatsApp Message
    const targetPhone = config.phone.replace(/[^0-9]/g, '');

    const modeLabels: Record<string, string> = {
      dineIn: `En mesa (${tableNumber ? `Mesa nº ${tableNumber}` : 'Mesa por asignar'})`,
      pickup: 'Para recoger en restaurante',
      delivery: 'A domicilio',
      query_only: 'Consulta sobre platos / disponibilidad',
    };

    let msg = `*NUEVO PEDIDO / CONSULTA — RESTAURANTE LA TENTACIÓN*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Cliente:* ${customerName}\n`;
    if (customerPhone) msg += `*Teléfono:* ${customerPhone}\n`;
    msg += `*Modalidad:* ${modeLabels[orderData.orderMode]}\n`;
    msg += `--------------------------------------\n`;
    msg += `*PRODUCTOS:*\n`;

    cart.forEach((item, idx) => {
      const priceText = item.product.price !== null ? `${(item.product.price * item.quantity).toFixed(2)} €` : '(Precio a consultar)';
      msg += `${idx + 1}. *${item.product.name}* x${item.quantity} — ${priceText}\n`;
      if (item.itemNotes) {
        msg += `   _Nota: ${item.itemNotes}_\n`;
      }
    });

    msg += `--------------------------------------\n`;
    if (subtotal > 0) {
      msg += `*Total estimado:* ${total.toFixed(2)} €\n`;
    } else {
      msg += `*Total:* Pendiente de confirmación según carta\n`;
    }

    if (generalNotes) {
      msg += `*Observaciones:* ${generalNotes}\n`;
    }

    msg += `\n_Aviso: Esta solicitud queda pendiente de confirmación por el personal del restaurante._`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

    // Clear cart upon preparing
    clearCart();

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#E8E4DA] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-serif-editorial font-medium text-[#1C1C1A]">
              Tu Selección gastronómica
            </h2>
            <p className="text-xs text-[#62625C]">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'} añadidos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#62625C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status explanation notice if orders are disabled */}
        {!config.whatsappOrdersEnabled && (
          <div className="bg-[#FBF4E8] border-b border-[#F5E6CD] p-3.5 px-6 text-xs text-[#8C6442] flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-[#C08A3E] mt-0.5" />
            <div>
              <p className="font-semibold text-[#6D4720]">Pedidos por WhatsApp en modo consulta</p>
              <p className="text-[11px] leading-tight text-[#8C6442] mt-0.5">
                El servicio directo de envío/recogida requiere activación por el restaurante. Tu mensaje se enviará para consultar disponibilidad con cocina.
              </p>
            </div>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {orderSubmittedRecord ? (
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA] text-center space-y-4 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-[#4D6444] mx-auto" />
              <h3 className="text-xl font-serif-editorial text-[#1C1C1A]">¡Mensaje preparado!</h3>
              <p className="text-sm text-[#62625C]">
                Hemos transferido tu pedido a WhatsApp para enviarlo al restaurante. Recuerda que la reserva o comanda queda <strong>pendiente de confirmación por el personal</strong> de La Tentación.
              </p>
              <div className="bg-[#FAF8F5] rounded-xl p-3 text-xs text-left text-[#42423D] space-y-1">
                <div><strong>Ref:</strong> {orderSubmittedRecord.id}</div>
                <div><strong>Cliente:</strong> {orderSubmittedRecord.customerName}</div>
                <div><strong>Estado:</strong> WhatsApp abierto (pendiente de validar)</div>
              </div>
              <button
                onClick={() => {
                  setOrderSubmittedRecord(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#384A31] text-[#FAF8F5] rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Entendido y Cerrar
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#EFE9DE] rounded-full flex items-center justify-center mx-auto text-[#62625C]">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-serif-editorial text-lg text-[#1C1C1A]">El carrito está vacío</h3>
              <p className="text-xs text-[#62625C] max-w-xs mx-auto">
                Explora nuestra carta digital y pulsa &laquo;Añadir&raquo; en tus platos favoritos para preparar tu pedido o consulta.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#384A31] text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-[#263321]"
              >
                Ir a la Carta
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl p-3.5 border border-[#E8E4DA] shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#1C1C1A]">{item.product.name}</h4>
                        <div className="text-xs text-[#65825A] font-medium mt-0.5">
                          {item.product.price !== null
                            ? `${item.product.price.toFixed(2)} €`
                            : item.product.priceDisplayNote || 'Consultar precio'}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#93938B] hover:text-[#A8583B] p-1"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity & Notes input */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F1EB]">
                      <div className="flex items-center space-x-2 bg-[#FAF8F5] rounded-lg p-1 border border-[#E8E4DA]">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#EFE9DE] rounded text-[#42423D]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-2 text-[#1C1C1A]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#EFE9DE] rounded text-[#42423D]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-[#2C2C28]">
                        {item.product.price !== null
                          ? `${(item.product.price * item.quantity).toFixed(2)} €`
                          : 'A consultar'}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Nota (ej: sin cebolla, salsa aparte...)"
                      value={item.itemNotes || ''}
                      onChange={(e) => updateCartNotes(item.product.id, e.target.value)}
                      className="text-xs bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4D6444] text-[#42423D]"
                    />
                  </div>
                ))}
              </div>

              {/* Order Form details */}
              <form id="cart-form" onSubmit={handleSendWhatsapp} className="space-y-4 pt-2">
                <div className="bg-white rounded-xl p-4 border border-[#E8E4DA] space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#62625C]">
                    Datos para el pedido / consulta
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#42423D] mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#4D6444]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#42423D] mb-1">
                      Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      placeholder="Número de teléfono móvil"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#4D6444]"
                    />
                  </div>

                  {config.whatsappOrdersEnabled && (
                    <div>
                      <label className="block text-xs font-medium text-[#42423D] mb-1">
                        Modalidad
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {config.orderModes.dineIn && (
                          <button
                            type="button"
                            onClick={() => setOrderMode('dineIn')}
                            className={`py-2 rounded-lg border text-center transition-all ${
                              orderMode === 'dineIn'
                                ? 'bg-[#384A31] text-white border-[#384A31] font-semibold'
                                : 'border-[#E8E4DA] text-[#62625C] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            En Mesa
                          </button>
                        )}
                        {config.orderModes.pickup && (
                          <button
                            type="button"
                            onClick={() => setOrderMode('pickup')}
                            className={`py-2 rounded-lg border text-center transition-all ${
                              orderMode === 'pickup'
                                ? 'bg-[#384A31] text-white border-[#384A31] font-semibold'
                                : 'border-[#E8E4DA] text-[#62625C] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            Recogida
                          </button>
                        )}
                        {config.orderModes.delivery && (
                          <button
                            type="button"
                            onClick={() => setOrderMode('delivery')}
                            className={`py-2 rounded-lg border text-center transition-all ${
                              orderMode === 'delivery'
                                ? 'bg-[#384A31] text-white border-[#384A31] font-semibold'
                                : 'border-[#E8E4DA] text-[#62625C] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            Domicilio
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {orderMode === 'dineIn' && (
                    <div>
                      <label className="block text-xs font-medium text-[#42423D] mb-1">
                        Número de mesa (si ya estás sentado)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Mesa 4"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#4D6444]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#42423D] mb-1">
                      Observaciones generales
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Alergias o comentarios adicionales..."
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#4D6444]"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && !orderSubmittedRecord && (
          <div className="p-4 sm:p-6 border-t border-[#E8E4DA] bg-white space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-[#1C1C1A]">
              <span>Subtotal estimado:</span>
              <span className="text-base text-[#384A31]">
                {subtotal > 0 ? `${total.toFixed(2)} €` : 'A consultar'}
              </span>
            </div>

            <p className="text-[11px] text-[#93938B] leading-tight">
              * El envío por WhatsApp no confirma el pedido hasta que el personal del restaurante responda y dé su conformidad.
            </p>

            <button
              type="submit"
              form="cart-form"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              Enviar pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
