import { Tool } from '../types';
import sp6000Image from '../assets/images/SP6000-M1.webp';
import nb2012Image from '../assets/images/2012NB-M1.webp';
import gts10jImage from '../assets/images/GTS10J-B1.webp';
import gcm10xImage from '../assets/images/GCM10X-B1.webp';
import rp1801Image from '../assets/images/RP1801-M1.png';
import prensaFImage from '../assets/images/PREF-M1.webp';
import riel19mImage from '../assets/images/GR19M-M1.webp';
import riel10mImage from '../assets/images/GR19M-M2.webp';
import adaptadorImage from '../assets/images/ADJC-M1.webp';
import discoImage from '../assets/images/DS165-M1.webp';
import m3700Image from '../assets/images/M3700-M1.avif';
import bo5030Image from '../assets/images/BO5030-M1.png';
import gst75eImage from '../assets/images/GST75E-B1.webp';
import recolectorImage from '../assets/images/RDP2012-M1.jpeg';
import sl300Image from '../assets/images/SL300-I1.webp';
import pf36Image from '../assets/images/PF36-I1.webp';
import r3Image from '../assets/images/R3-K1.webp';
import k5Image from '../assets/images/K5-K1.jpg';
import mc1269Image from '../assets/images/1269-MC1.webp';
import admImage from '../assets/images/ADM-MC1.webp';
import fbr12Image from '../assets/images/FBR12-M1.webp';
import fm45Image from '../assets/images/FM45-M1.webp';
import fc63Image from '../assets/images/FC63-M1.avif';
import fc14Image from '../assets/images/FC14-M1.webp';
import mrfImage from '../assets/images/MRF-M1.webp';
import pst34Image from '../assets/images/PST34-I1.webp';
import ftpImage from '../assets/images/FTP-M1.avif';


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
    id: 3,
    code: '2012NB-M1',
    name: 'Cepillo de Banco Makita 2012NB',
    condition: 'Usado - Como Nuevo',
    originalPrice: 599990,
    price: 449992,
    description: '🔧 Cepillo industrial de 305mm. Perfecto estado de funcionamiento.',
    features: [
      'Ancho de cepillado 305mm',
      'Motor 1650W en excelente estado',
      'Sistema anti-rebote intacto',
      'Base de hierro fundido'
    ],
    urgency: '🎯 Oferta especial contratistas',
    ctaText: '¡CONTACTAR AHORA! →',
    discount: '-25%',
    image: nb2012Image
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
    id: 6,
    code: 'PREF-M1',
    name: 'SET PRENSA "F" PARA GUIA RIEL (2PZ)',
    condition: 'Usado - Buen Estado',
    originalPrice: 42863,
    price: 30004,
    description: '🔨 Set de prensas profesionales. Funcionamiento perfecto.',
    features: [
      'Set de 2 prensas tipo F',
      'Mecanismo de ajuste suave',
      'Sin deformaciones',
      'Agarre firme'
    ],
    urgency: '✨ Complemento esencial',
    ctaText: '¡AGREGAR AL SET! →',
    discount: '-30%',
    image: prensaFImage
  },
  {
    id: 7,
    code: 'GR19M-M1',
    name: 'GUIA RIEL 1.9M MAKITA',
    condition: 'Usado - Excelente Estado',
    originalPrice: 62900,
    price: 44030,
    description: '📏 Guía riel profesional. Sin golpes ni deformaciones.',
    features: [
      'Longitud total 1.9m',
      'Perfil recto y sin daños',
      'Base antideslizante intacta',
      'Conectores en buen estado'
    ],
    urgency: '🎯 Stock limitado',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '-30%',
    image: riel19mImage
  },
  {
    id: 8,
    code: 'GR10M-M1',
    name: 'GUIA RIEL 1M MAKITA',
    condition: 'Usado - Buen Estado',
    originalPrice: 29990,
    price: 20993,
    description: '📏 Guía riel compacta. Perfecta para espacios reducidos.',
    features: [
      'Longitud 1m exacto',
      'Sin deformaciones',
      'Compatible con SP6000',
      'Base antideslizante funcional'
    ],
    urgency: '💫 Complemento perfecto',
    ctaText: '¡AGREGAR AL CARRITO! →',
    discount: '-30%',
    image: riel10mImage
  },
  {
    id: 9,
    code: 'ADJC-M1',
    name: 'ADAPTADOR DE JUNTAS PARA GUIA CARRIL',
    condition: 'Usado - Buen Estado',
    originalPrice: 24923,
    price: 17446,
    description: '🔧 Adaptador para guías. Conexiones precisas.',
    features: [
      'Ajuste preciso mantenido',
      'Sin desgaste visible',
      'Material en buen estado',
      'Compatible con guías Makita'
    ],
    urgency: '⚡ ¡Último disponible!',
    ctaText: '¡RESERVAR YA! →',
    discount: '-30%',
    image: adaptadorImage
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
    discount: '-30%',
    image: discoImage
  },
  {
    id: 11,
    code: 'M3700-M1',
    name: 'RECORTADORA MAKITA M3700',
    condition: 'Usado - Excelente Estado',
    originalPrice: 60000,
    price: 42000,
    description: '✨ Recortadora compacta 530W. Ideal para trabajos de precisión. Poco uso.',
    features: [
      'Potencia 530W funcionando perfectamente',
      '35000 RPM estables',
      'Base de aluminio sin desgaste',
      'Motor en óptimas condiciones'
    ],
    urgency: '🔥 ¡Oferta especial!',
    ctaText: '¡APROVECHAR AHORA! →',
    discount: '-30%',
    image: m3700Image
  },
  {
    id: 12,
    code: 'BO5030-M1',
    name: 'Lijadora Excéntrica BO5030',
    condition: 'Usado - Buen Estado',
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
    id: 13,
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
    id: 14,
    code: 'RDP2012-M1',
    name: 'Recolector De Polvo Para Cepillo 2012NB',
    condition: 'Usado - Buen Estado',
    originalPrice: 34990,
    price: 24493,
    description: '🌪️ Recolector específico para cepillo 2012NB. Funcionamiento óptimo.',
    features: [
      'Ajuste perfecto con 2012NB',
      'Sistema de succión eficiente',
      'Conexiones en buen estado',
      'Limpio y mantenido'
    ],
    urgency: '✨ ¡Complemento esencial!',
    ctaText: '¡AGREGAR AL CARRITO! →',
    discount: '-30%',
    image: recolectorImage
  },
  {
    id: 15,
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
    id: 16,
    code: 'PF36-I1',
    name: 'Set Prensas Irwin Tipo F 36"',
    condition: 'Usado - Buen Estado',
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
    id: 17,
    code: 'R3-K1',
    name: 'Guía de perforación Kreg R3',
    condition: 'Usado - Como Nuevo',
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
    id: 18,
    code: 'K5-K1',
    name: 'Plantilla Kreg Jig K5',
    condition: 'Usado - Buen Estado',
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
    id: 19,
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
    id: 20,
    code: 'ADM-MC1',
    name: 'Soporte de taladro AccuDrillMate',
    condition: 'Usado - Buen Estado',
    originalPrice: 32990,
    price: 23093,
    description: '🔨 Soporte de precisión para taladro. Estabilidad perfecta.',
    features: [
      'Base estable sin daños',
      'Sistema de ajuste preciso',
      'Columna recta y firme',
      'Mecanismo suave'
    ],
    urgency: '⚡ ¡Última unidad!',
    ctaText: '¡RESERVAR YA! →',
    discount: '-30%',
    image: admImage
  },
  {
    id: 21,
    code: 'FBR12-M1',
    name: 'Fresa Borde Redondo 1/2',
    condition: 'Nuevo',
    originalPrice: 33990,
    price: 33990,
    description: '🔄 Fresa profesional para borde redondo. Nueva sin uso.',
    features: [
      'Toma de 1/2 pulgada',
      'Filo de carburo premium',
      'Alta precisión de corte',
      'Para trabajos profesionales'
    ],
    urgency: '✨ ¡Nueva en caja!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '0%',
    image: fbr12Image
  },
  {
    id: 22,
    code: 'FTP-M1',
    name: 'Set Fresas Tipo T Para Pernos',
    condition: 'Nuevo',
    originalPrice: 11000,
    price: 11000,
    description: '🔨 Set de 3 fresas tipo T para anclajes. Nuevas.',
    features: [
      'Set de 3 medidas diferentes',
      'Toma de 1/2 pulgada',
      'Ideal para anclajes',
      'Filos de carburo nuevos'
    ],
    urgency: '🎯 ¡Set completo nuevo!',
    ctaText: '¡RESERVAR SET! →',
    discount: '0%',
    image: ftpImage
  },
  {
    id: 23,
    code: 'FM45-M1',
    name: 'Fresa Madera 45° Chanfle',
    condition: 'Nuevo',
    originalPrice: 9800,
    price: 9800,
    description: '📐 Fresa para chanfles a 45 grados. Nueva en empaque.',
    features: [
      'Ángulo preciso de 45°',
      'Toma de 1/2 pulgada',
      'Carburo de alta calidad',
      'Corte limpio garantizado'
    ],
    urgency: '⚡ ¡Nueva disponible!',
    ctaText: '¡COMPRAR YA! →',
    discount: '0%',
    image: fm45Image
  },
  {
    id: 24,
    code: 'FC63-M1',
    name: 'Fresa Copiadora 63mm',
    condition: 'Usado - Buen Estado',
    originalPrice: 13100,
    price: 13100,
    description: '🔄 Fresa copiadora con doble rodamiento. Nueva.',
    features: [
      'Diámetro de corte 63mm',
      'Doble rodamiento sellado',
      'Toma de 1/2 pulgada',
      'Máxima precisión'
    ],
    urgency: '✨ Usado pero en excelente estado',
    ctaText: '¡AGREGAR AL CARRO! →',
    discount: '0%',
    image: fc63Image
  },
  {
    id: 25,
    code: 'FC14-M1',
    name: 'Fresa Copiadora 1/4',
    condition: 'Usado - Buen Estado',
    originalPrice: 11000,
    price: 11000,
    description: '🛠️ Fresa copiadora profesional. Nueva en caja.',
    features: [
      'Vástago de 1/4 pulgada',
      'Rodamiento de precisión',
      'Carburo de primera calidad',
      'Ideal trabajos finos'
    ],
    urgency: '💫 ¡Stock disponible!',
    ctaText: '¡COMPRAR AHORA! →',
    discount: '0%',
    image: fc14Image
  },
  {
    id: 26,
    code: 'MRF-M1',
    name: 'Mesa Router Fresadora',
    condition: 'Usado - Buen Estado',
    originalPrice: 10400,
    price: 10400,
    description: '🔧 Mesa multifuncional para router. Nueva en caja.',
    features: [
      'Placa de montaje universal',
      'Guías ajustables',
      'Sistema de fijación seguro',
      'Ideal para trabajos precisos'
    ],
    urgency: '🎯 Usado pero en excelente estado',
    ctaText: '¡RESERVAR AHORA! →',
    discount: '0%',
    image: mrfImage
  },
  {
    id: 27,
    code: 'PST34-I1',
    name: 'Set Prensas Sargento Tubo 3/4',
    condition: 'Usado - Buen Estado',
    originalPrice: 28000,
    price: 28000,
    description: '🔨 Set de 4 prensas sargento profesionales. Nuevas.',
    features: [
      'Set de 4 prensas completas',
      'Tubo de 3/4 pulgada',
      'Sistema de ajuste rápido',
      'Acabado anticorrosivo'
    ],
    urgency: '⭐ ¡Set usado',
    ctaText: '¡COMPRAR SET! →',
    discount: '0%',
    image: pst34Image
  }
];