export interface Tool {
  id: number;
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
}