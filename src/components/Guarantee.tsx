import React from 'react';
import { Shield, Wrench, Clock } from 'lucide-react';

export default function Guarantee() {
  return (
    <div className="bg-white border-2 border-blue-500 p-6 rounded-lg my-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center">
          <Shield className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-bold mb-1">Garantía de Calidad</h3>
          <p className="text-sm text-gray-600">Todas las herramientas verificadas y probadas</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Wrench className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-bold mb-1">Asesoría Técnica</h3>
          <p className="text-sm text-gray-600">Soporte profesional incluido</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Clock className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-bold mb-1">7 Días de Prueba</h3>
          <p className="text-sm text-gray-600">Satisfacción garantizada</p>
        </div>
      </div>
    </div>
  );
}