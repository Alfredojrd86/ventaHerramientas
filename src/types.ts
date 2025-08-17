export interface Tool {
  id: string; // Cambiar de number a string para soportar UUIDs
  code: string;
  name: string;
  condition: string;
  originalPrice: number;
  price: number;
  description: string;
  features: string[];
  urgency: string;
  ctaText: string;
  discount: string;
  image: string;
  stock: number;
}