import React, { useState, useRef } from "react";
import { motion } from "framer-motion"; 

export default function StatusUpdateModaal({ isOpen, onClose, onConfirm }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    processFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selected = e.dataTransfer.files[0];
    processFile(selected);
  };

  const processFile = (file) => {
    if (file && file.type.match('image.*')) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert('Please select an image file (JPEG, PNG, etc.)');
    }
  };

  const handleConfirm = () => {
    if (!file) {
      alert("Please upload an image as proof");
      return;
    }
    onConfirm(file);
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upload Proof</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-orange-500 bg-blue-50' 
                : preview 
                  ? 'border-gray-200' 
                  : 'border-gray-300 hover:border-orange-400 bg-gray-50'
            }`}
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={fileInputRef}
              className="hidden"
            />
            
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-60 object-contain rounded-md"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!file}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
                file 
                  ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Confirm & Update Status
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}