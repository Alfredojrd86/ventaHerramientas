import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EnhancedTool } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { tools } from '../../data/tools';
import ImageGallery from './ImageGallery';
import SpecificationTabs from './SpecificationTabs';
import RelatedProducts from './RelatedProducts';
import TrustSignals from './TrustSignals';
import UrgencyIndicators from '../conversion/UrgencyIndicators';
import SocialProof from '../conversion/SocialProof';

interface ProductDetailPageProps {
  productCode?: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productCode: propProductCode }) => {
  const { productCode: paramProductCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  
  const productCode = propProductCode || paramProductCode;
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Find the product (in a real app, this would be an API call)
  const product = tools.find(tool => tool.code === productCode);

  useEffect(() => {
    if (!product) {
      navigate('/404');
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-8">El producto que buscas no existe o ha sido removido.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Enhanced product data (in a real app, this would come from API)
  const enhancedProduct: EnhancedTool = {
    ...product,
    specifications: [
      {
        category: 'Especificaciones Técnicas',
        items: [
          { label: 'Potencia', value: '1300', unit: 'W', important: true },
          { label: 'Velocidad', value: '22000', unit: 'RPM', important: true },
          { label: 'Peso', value: '3.2', unit: 'kg' },
          { label: 'Dimensiones', value: '35 x 25 x 15', unit: 'cm' },
        ]
      },
      {
        category: 'Incluye',
        items: [
          { label: 'Herramienta principal', value: '1 unidad' },
          { label: 'Maletín de transporte', value: 'Incluido' },
          { label: 'Manual de usuario', value: 'Incluido' },
          { label: 'Garantía', value: '2 años' },
        ]
      }
    ],
    gallery: [
      { id: '1', url: product.image, alt: product.name, isPrimary: true, order: 1 },
      { id: '2', url: product.image, alt: `${product.name} - Vista lateral`, order: 2 },
      { id: '3', url: product.image, alt: `${product.name} - Accesorios`, order: 3 },
    ],
    stock: Math.floor(Math.random() * 10) + 1,
    lowStockThreshold: 3,
    warranty: {
      duration: 24,
      unit: 'months',
      type: 'manufacturer',
      description: 'Garantía oficial del fabricante',
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const success = addToCart(product);
      if (success) {
        // Show success message or redirect to cart
        console.log('Added to cart successfully');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.code)) {
      removeFromWishlist(product.code);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inCart = isInCart(product.code);
  const inWishlist = isInWishlist(product.code);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
              Inicio
            </button>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            <ImageGallery
              images={enhancedProduct.gallery || []}
              selectedIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="space-y-6">
              {/* Urgency Indicators */}
              <UrgencyIndicators 
                stock={enhancedProduct.stock}
                lowStockThreshold={enhancedProduct.lowStockThreshold}
                urgencyText={product.urgency}
              />

              {/* Product Title and Condition */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product.condition}
                  </span>
                  <span className="text-sm text-gray-500">
                    SKU: {product.code}
                  </span>
                </div>
              </div>

              {/* Social Proof */}
              <SocialProof productCode={product.code} />

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString('es-CL')}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Precio incluye IVA
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Signals */}
              <TrustSignals warranty={enhancedProduct.warranty} />

              {/* Add to Cart Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Cantidad:
                  </label>
                  <select
                    id="quantity"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={inCart || isAddingToCart}
                    className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {inCart ? 'En Carrito' : 'Agregar al Carrito'}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className="bg-white border border-gray-300 rounded-md py-3 px-3 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={inWishlist ? 'Remover de favoritos' : 'Agregar a favoritos'}
                  >
                    <svg className={`h-6 w-6 ${inWishlist ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications and Related Products */}
        <div className="mt-16 space-y-16">
          <SpecificationTabs 
            specifications={enhancedProduct.specifications || []}
            reviews={enhancedProduct.reviews || []}
          />
          
          <RelatedProducts 
            currentProductCode={product.code}
            relatedCodes={enhancedProduct.relatedProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
