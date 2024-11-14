import React from 'react';
import {Phone, Mail, MapPin, Package, Shield, Wrench} from 'lucide-react';

export default function Contact() {
  return (
    <div
      id="contacto"
      className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mt-8 shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        ¿Interesado en alguna herramienta?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Contacto Directo</h3>
          <p className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            WhatsApp: +52 1234567890
          </p>
          <p className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            Email: ventas@herramientas-pro.mx
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            CDMX - Envíos a todo México
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Beneficios</h3>
          <p className="flex items-center gap-3">
            <Package className="w-5 h-5" />
            Envío asegurado a todo el país
          </p>
          <p className="flex items-center gap-3">
            <Shield className="w-5 h-5" />
            Garantía por escrito en cada herramienta
          </p>
          <p className="flex items-center gap-3">
            <Wrench className="w-5 h-5" />
            Asesoría técnica personalizada
          </p>
        </div>
      </div>

      <div className="text-center mt-6 p-4 bg-white/10 rounded-lg">
        <p className="font-bold text-lg">
          💡 Precios especiales en compras múltiples
        </p>
        <p className="mt-2">Contáctanos para armar tu paquete personalizado</p>
      </div>
    </div>
  );
}
