import {Check} from 'lucide-react';
import {Tool} from '../types';

export default function ToolCard({tool}: {tool: Tool}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const condition = tool.condition.includes('Estado Profesional')
    ? 'Usado - Excelente Estado'
    : tool.condition;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa la herramienta:\n` +
        `Código: ${tool.code}\n` +
        `${tool.name}\n` +
        `Precio: ${formatPrice(tool.price)}`
    );
    window.open(`https://wa.me/+56935397603?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 h-full grid grid-rows-[350px_minmax(0,1fr)_auto]">
      <div className="relative bg-white p-4 flex items-center justify-center">
        <img
          src={tool.image}
          alt={tool.name}
          className="max-w-full max-h-full w-auto h-auto transition-transform duration-300 hover:scale-105 cursor-pointer object-fill"
          loading="lazy"
        />
        {tool.discount && (
          <div className="absolute top-4 right-[-35px] bg-red-600 text-white py-1 px-10 transform rotate-45 font-bold shadow-lg">
            {tool.discount}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full whitespace-nowrap">
            {condition}
          </span>
          <div className="flex flex-col items-end">
            {tool.originalPrice > tool.price && (
              <div className="text-gray-500 line-through text-sm">
                {formatPrice(tool.originalPrice)}
              </div>
            )}
            <div className="text-xl sm:text-2xl font-bold text-blue-900">
              {formatPrice(tool.price)}
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {tool.name}
        </h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {tool.description}
        </p>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">
            Características:
          </h3>
          <ul className="grid gap-2">
            {tool.features.map((feature, index) => (
              <li
                key={index}
                className="grid grid-cols-[auto_1fr] gap-2 text-sm sm:text-base"
              >
                <Check className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-red-600 font-bold mb-3 text-sm sm:text-base">
          {tool.urgency}
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <button
          onClick={handleWhatsAppClick}
          style={{backgroundColor: '#25D366'}}
          className="w-full text-white text-center py-3 px-6 rounded-lg font-bold 
                     transition-all duration-300 hover:shadow-lg active:scale-95 border border-[#128C7E]
                     flex items-center justify-center gap-3"
        >
          <span style={{color: 'white'}}>Consultar por WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
