import mc1269Image from '../assets/images/1269-MC1.webp';

import bo5030Image from '../assets/images/BO5030-M1.png';
import discoImage from '../assets/images/DS165-M1.webp';
import fbr12Image from '../assets/images/FBR12-M1.webp';
import fc14Image from '../assets/images/FC14-M1.webp';
import fc63Image from '../assets/images/FC63-M1.avif';
import fm45Image from '../assets/images/FM45-M1.webp';
import ftpImage from '../assets/images/FTP-M1.avif';
import gcm10xImage from '../assets/images/GCM10X-B1.webp';
import gst75eImage from '../assets/images/GST75E-B1.webp';
import gts10jImage from '../assets/images/GTS10J-B1.webp';
import k5Image from '../assets/images/K5-K1.jpg';
import pf36Image from '../assets/images/PF36-I1.webp';
import pst34Image from '../assets/images/PST34-I1.webp';
import r3Image from '../assets/images/R3-K1.webp';
import rp1801Image from '../assets/images/RP1801-M1.png';
import sl300Image from '../assets/images/SL300-I1.webp';
import sp6000Image from '../assets/images/SP6000-M1.webp';
import { Tool } from '../types';


export const tools: Tool[] = [
  {
    id: 1,
    code: 'SP6000-M1',
    name: 'Makita SP6000 Sierra de Inmersión Profesional',
    condition: 'Usado - Excelente Estado',
    originalPrice: 549891,
    price: 412418,
    description: '✨ Sierra de inmersión profesional para cortes de alta precisión. Estado impecable.',
    features: [
      'Potencia 1300W para máximo rendimiento',
      'Sistema de inmersión preciso',
      'Compatible con sistema de rieles',
      'Mantenimiento al día'
    ],
    urgency: '🔥 Precio especial por tiempo limitado',
    ctaText: '¡RESERVAR AHORA! →',
    discount: '-25%',
    image: sp6000Image
  },
  {
    id: 2,
    code: 'GTS10J-B1',
    name: 'SIERRA DE BANCO BOSCH GTS-10J',
    condition: 'Usado - Excelente Estado',
    originalPrice: 843990,
    price: 632992,
    description: '💪 Sierra de banco profesional de 1800W. Mínimas horas de uso.',
    features: [
      'Motor potente de 1800W',
      'Mesa de precisión en aluminio',
      'Sistema de seguridad completo',
      'Incluye extensiones laterales'
    ],
    urgency: '⚡ Precio especial para profesionales',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-25%',
    image: gts10jImage
  },
  {
    id: 4,
    code: 'GCM10X-B1',
    name: 'Sierra Ingleteadora Bosch GCM 10 X',
    condition: 'Usado - Excelente Estado',
    originalPrice: 502210,
    price: 376657,
    description: '📐 Ingleteadora profesional de 1700W. Precisión mantenida.',
    features: [
      'Potencia 1700W',
      'Sistema láser calibrado',
      'Mesa giratoria sin juego',
      'Incluye disco en buen estado'
    ],
    urgency: '💫 Última unidad disponible',
    ctaText: '¡RESERVAR YA! →',
    discount: '-25%',
    image: gcm10xImage
  },
  {
    id: 5,
    code: 'RP1801-M1',
    name: 'FRESADORA MAKITA RP1801',
    condition: 'Usado - Excelente Estado',
    originalPrice: 408891,
    price: 306668,
    description: '🎯 Fresadora profesional 1650W. Mantenida con cuidado profesional.',
    features: [
      'Potencia 1650W intacta',
      'Velocidad 22000RPM estable',
      'Base en perfecto estado',
      'Control electrónico preciso'
    ],
    urgency: '🕒 Precio válido esta semana',
    ctaText: '¡APROVECHAR OFERTA! →',
    discount: '-25%',
    image: rp1801Image
  },
  {
    id: 10,
    code: 'DS165-M1',
    name: 'Disco Sierra 6-1/2″ 56T Efficut Makita',
    condition: 'Nuevo',
    originalPrice: 55890,
    price: 52000,
    description: '⚡ Disco profesional 56 dientes. Afilado y en excelente estado.',
    features: [
      'Dientes de carburo intactos',
      'Compatible con SP6000',
      'Corte preciso mantenido',
      'Sin desgaste visible'
    ],
    urgency: '🎯 ¡Stock limitado!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-7%',
    image: discoImage
  },

  {
    id: 11,
    code: 'BO5030-M1',
    name: 'Lijadora Excéntrica BO5030',
    condition: 'Usado - Excelente Estado',
    originalPrice: 135990,
    price: 95193,
    description: '🔄 Lijadora orbital 300W. Perfecto funcionamiento y mantenimiento al día.',
    features: [
      'Potencia 300W intacta',
      'Órbita de 123mm precisa',
      'Sistema de aspiración limpio',
      'Control de velocidad funcional'
    ],
    urgency: '⭐ ¡Precio especial!',
    ctaText: '¡COMPRAR YA! →',
    discount: '-30%',
    image: bo5030Image
  },
  {
    id: 12,
    code: 'GST75E-B1',
    name: 'Sierra Caladora Bosch GST 75 E',
    condition: 'Usado - Excelente Estado',
    originalPrice: 128350,
    price: 89845,
    description: '⚡ Caladora profesional 710W. Mantenida por experto.',
    features: [
      'Motor 710W en excelente estado',
      'Control de velocidad preciso',
      'Sistema pendular ajustado',
      'Cambio de hoja sin desgaste'
    ],
    urgency: '🎯 ¡Últimas unidades!',
    ctaText: '¡RESERVAR AHORA! →',
    discount: '-30%',
    image: gst75eImage
  },
  {
    id: 13,
    code: 'SL300-I1',
    name: 'Set Prensas Rápidas Irwin SL300',
    condition: 'Usado - Excelente Estado',
    originalPrice: 56760,
    price: 39732,
    description: '🔧 Set de 4 prensas rápidas de 24". Mecanismos perfectos.',
    features: [
      'Set completo de 4 unidades',
      'Mecanismo de apriete suave',
      'Sin óxido ni deformaciones',
      'Mangos en buen estado'
    ],
    urgency: '💪 ¡Set completo!',
    ctaText: '¡COMPRAR SET! →',
    discount: '-30%',
    image: sl300Image
  },
  {
    id: 14,
    code: 'PF36-I1',
    name: 'Set Prensas Irwin Tipo F 36"',
    condition: 'Usado - Excelente Estado',
    originalPrice: 34380,
    price: 24066,
    description: '🔨 Set de 2 prensas tipo F de 91cm. Funcionamiento impecable.',
    features: [
      'Par de prensas de 36"',
      'Mecanismo fluido',
      'Barras rectas sin daños',
      'Mordazas en buen estado'
    ],
    urgency: '🎯 ¡Oferta especial!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-30%',
    image: pf36Image
  },
  {
    id: 15,
    code: 'R3-K1',
    name: 'Guía de perforación Kreg R3',
    condition: 'Usado - Excelente Estado',
    originalPrice: 43120,
    price: 30184,
    description: '🎯 Sistema de uniones Kreg R3. Precisión mantenida.',
    features: [
      'Guías sin desgaste',
      'Calibración precisa',
      'Accesorios completos',
      'Topes ajustables perfectos'
    ],
    urgency: '⚡ ¡Stock limitado!',
    ctaText: '¡RESERVAR YA! →',
    discount: '-30%',
    image: r3Image
  },
  {
    id: 16,
    code: 'K5-K1',
    name: 'Plantilla Kreg Jig K5',
    condition: 'Usado - Excelente Estado',
    originalPrice: 100000,
    price: 70000,
    description: '🛠️ Sistema profesional Kreg K5. Calibrado y ajustado.',
    features: [
      'Sistema de sujeción firme',
      'Guías en buen estado',
      'Ajustes precisos',
      'Incluye accesorios originales'
    ],
    urgency: '✨ ¡Oportunidad única!',
    ctaText: '¡APROVECHAR AHORA! →',
    discount: '-30%',
    image: k5Image
  },
  {
    id: 17,
    code: '1269-MC1',
    name: 'Kit de guía circular Milescraft 1269',
    condition: 'Usado - Excelente Estado',
    originalPrice: 65890,
    price: 46123,
    description: '📏 Kit completo para cortes circulares. Como nuevo.',
    features: [
      'Sistema de pivote suave',
      'Escalas legibles',
      'Componentes completos',
      'Ajustes precisos mantenidos'
    ],
    urgency: '🎯 ¡Precio especial!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-30%',
    image: mc1269Image
  },

  {
    id: 18,
    code: 'FBR12-M1',
    name: 'Fresa Borde Redondo 1/2',
    condition: 'Usado - Excelente Estado',
    originalPrice: 33990,
    price: 25000,
    description: '🔄 Fresa profesional para borde redondo. Excelente estado.',
    features: [
      'Toma de 1/2 pulgada',
      'Filo de carburo premium',
      'Alta precisión de corte',
      'Para trabajos profesionales'
    ],
    urgency: '✨ ¡Excelente estado!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-26%',
    image: fbr12Image
  },
  {
    id: 19,
    code: 'FTP-M1',
    name: 'Set Fresas Tipo T Para Pernos',
    condition: 'Usado - Excelente Estado',
    originalPrice: 11000,
    price: 8000,
    description: '🔨 Set de 3 fresas tipo T para anclajes. Excelente estado.',
    features: [
      'Set de 3 medidas diferentes',
      'Toma de 1/2 pulgada',
      'Ideal para anclajes',
      'Filos de carburo en buen estado'
    ],
    urgency: '🎯 ¡Set completo!',
    ctaText: '¡RESERVAR SET! →',
    discount: '-27%',
    image: ftpImage
  },
  {
    id: 20,
    code: 'FM45-M1',
    name: 'Fresa Madera 45° Chanfle',
    condition: 'Usado - Excelente Estado',
    originalPrice: 9800,
    price: 7000,
    description: '📐 Fresa para chanfles a 45 grados. Excelente estado.',
    features: [
      'Ángulo preciso de 45°',
      'Toma de 1/2 pulgada',
      'Carburo de alta calidad',
      'Corte limpio garantizado'
    ],
    urgency: '⚡ ¡Excelente estado!',
    ctaText: '¡COMPRAR YA! →',
    discount: '-29%',
    image: fm45Image
  },
  {
    id: 21,
    code: 'FC63-M1',
    name: 'Fresa Copiadora 63mm',
    condition: 'Usado - Excelente Estado',
    originalPrice: 13100,
    price: 10000,
    description: '🔄 Fresa copiadora con doble rodamiento. Excelente estado.',
    features: [
      'Diámetro de corte 63mm',
      'Doble rodamiento sellado',
      'Toma de 1/2 pulgada',
      'Máxima precisión'
    ],
    urgency: '✨ Excelente estado',
    ctaText: '¡AGREGAR AL CARRO! →',
    discount: '-24%',
    image: fc63Image
  },
  {
    id: 22,
    code: 'FC14-M1',
    name: 'Fresa Copiadora 1/4',
    condition: 'Usado - Excelente Estado',
    originalPrice: 11000,
    price: 8500,
    description: '🛠️ Fresa copiadora profesional. Excelente estado.',
    features: [
      'Vástago de 1/4 pulgada',
      'Rodamiento de precisión',
      'Carburo de primera calidad',
      'Ideal trabajos finos'
    ],
    urgency: '💫 ¡Excelente estado!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-23%',
    image: fc14Image
  },

  {
    id: 23,
    code: 'PST34-I1',
    name: 'Set Prensas Sargento Tubo 3/4',
    condition: 'Usado - Excelente Estado',
    originalPrice: 28000,
    price: 22000,
    description: '🔨 Set de 4 prensas sargento profesionales. Excelente estado.',
    features: [
      'Set de 4 prensas completas',
      'Tubo de 3/4 pulgada',
      'Sistema de ajuste rápido',
      'Acabado anticorrosivo'
    ],
    urgency: '⭐ ¡Set completo!',
    ctaText: '¡COMPRAR SET! →',
    discount: '-21%',
    image: pst34Image
  }
];

// Reemplaza la exportación en tu archivo original
// export { tools };
