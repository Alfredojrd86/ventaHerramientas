import React, { useState } from 'react';
import { ProductImage } from '../../types/product';

interface ImageGalleryProps {
  images: ProductImage[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedIndex,
  onImageSelect,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeModal();
  };

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="aspect-w-1 aspect-h-1 w-full mb-4">
        <button
          onClick={() => openModal(selectedIndex)}
          className="group relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Zoom Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20">
            <div className="bg-white rounded-full p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </button>

        {/* Image Caption */}
        {currentImage.caption && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            {currentImage.caption}
          </p>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onImageSelect(index)}
              className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                index === selectedIndex
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : ''
              }`}
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.alt}
                className="w-full h-full object-center object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Modal Image */}
            <img
              src={images[modalImageIndex].url}
              alt={images[modalImageIndex].alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Modal Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                <p className="text-sm">
                  {images[modalImageIndex].alt}
                </p>
                {images.length > 1 && (
                  <p className="text-xs opacity-75 mt-1">
                    {modalImageIndex + 1} de {images.length}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2 bg-black bg-opacity-50 p-2 rounded">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageIndex(index);
                      }}
                      className={`w-12 h-12 rounded overflow-hidden hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-white ${
                        index === modalImageIndex
                          ? 'ring-2 ring-white'
                          : 'opacity-60'
                      }`}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
