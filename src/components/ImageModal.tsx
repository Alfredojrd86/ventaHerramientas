import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt="Full view"
          className="max-w-full max-h-screen object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
