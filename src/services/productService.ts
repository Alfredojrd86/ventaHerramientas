import { supabase, DatabaseProduct } from '../config/supabase';
import { Tool } from '../types';

export interface CreateProductData {
  tenantId: string;
  code: string;
  name: string;
  condition: string;
  originalPrice?: number;
  price: number;
  description: string;
  features: string[];
  urgency?: string;
  ctaText?: string;
  discount?: string;
  imageUrl: string;
  stock: number;
  category?: string;
  brand?: string;
}

export class ProductService {
  // Obtener todos los productos de un tenant
  static async getTenantProducts(tenantId: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data.map(this.transformDatabaseToTool);
  }

  // Obtener un producto por ID
  static async getProductById(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No encontrado
      }
      console.error('Error fetching product:', error);
      throw error;
    }

    return this.transformDatabaseToTool(data);
  }

  // Crear un nuevo producto
  static async createProduct(productData: CreateProductData): Promise<Tool> {
    const dbProduct = this.transformCreateDataToDatabase(productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return this.transformDatabaseToTool(data);
  }

  // Actualizar un producto
  static async updateProduct(id: string, updates: Partial<CreateProductData>): Promise<Tool> {
    const dbUpdates = this.transformCreateDataToDatabase(updates);
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return this.transformDatabaseToTool(data);
  }

  // Eliminar un producto (soft delete)
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Buscar productos por texto
  static async searchProducts(tenantId: string, query: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    return data.map(this.transformDatabaseToTool);
  }

  // Obtener productos por categoría
  static async getProductsByCategory(tenantId: string, category: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return data.map(this.transformDatabaseToTool);
  }

  // Actualizar stock de un producto
  static async updateStock(id: string, newStock: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Transformar de base de datos a Tool
  private static transformDatabaseToTool(dbProduct: DatabaseProduct): Tool {
    return {
      id: dbProduct.id, // Mantener UUID como string
      code: dbProduct.code,
      name: dbProduct.name,
      condition: dbProduct.condition,
      originalPrice: dbProduct.original_price || dbProduct.price,
      price: dbProduct.price,
      description: dbProduct.description,
      features: dbProduct.features,
      urgency: dbProduct.urgency || '',
      ctaText: dbProduct.cta_text || 'Comprar Ahora',
      discount: dbProduct.discount || '',
      image: dbProduct.image_url,
      stock: dbProduct.stock,
    };
  }

  // Transformar de CreateProductData a formato de base de datos
  private static transformCreateDataToDatabase(productData: Partial<CreateProductData>): Partial<DatabaseProduct> {
    const dbProduct: Partial<DatabaseProduct> = {};
    
    if (productData.tenantId) dbProduct.tenant_id = productData.tenantId;
    if (productData.code) dbProduct.code = productData.code;
    if (productData.name) dbProduct.name = productData.name;
    if (productData.condition) dbProduct.condition = productData.condition;
    if (productData.originalPrice) dbProduct.original_price = productData.originalPrice;
    if (productData.price) dbProduct.price = productData.price;
    if (productData.description) dbProduct.description = productData.description;
    if (productData.features) dbProduct.features = productData.features;
    if (productData.urgency) dbProduct.urgency = productData.urgency;
    if (productData.ctaText) dbProduct.cta_text = productData.ctaText;
    if (productData.discount) dbProduct.discount = productData.discount;
    if (productData.imageUrl) dbProduct.image_url = productData.imageUrl;
    if (productData.stock !== undefined) dbProduct.stock = productData.stock;
    if (productData.category) dbProduct.category = productData.category;
    if (productData.brand) dbProduct.brand = productData.brand;

    return dbProduct;
  }
}
