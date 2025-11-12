import React, { useState, useCallback } from 'react';
import { Category, ImageFile, AnalysisResult } from '../types';
import { getTrialsRemaining, useTrial } from '../services/trialService';
import { analyzeImage } from '../services/geminiService';
import { REQUIRED_IMAGE_COUNT, MAX_IMAGE_COUNT } from '../constants';
import AnalysisChart from './AnalysisChart';
import ResultDisplay from './ResultDisplay';
import Loader from './Loader';
import Payment from './Payment';

interface ImageAnalyzerProps {
  category: Category;
  onBack: () => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ category, onBack }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const addImageFile = (file: File) => {
    if (images.length < MAX_IMAGE_COUNT) {
      const newImage: ImageFile = {
        id: `${file.name}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      };
      setImages(prev => [...prev, newImage]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addImageFile(file);
    }
    event.target.value = ''; // Reset input to allow same file upload again
  };
  
  const handleUrlUpload = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter a valid image URL.");
      return;
    }
    setIsUrlLoading(true);
    setError(null);
    try {
      // Note: This fetch can be blocked by CORS policy of the image host.
      // A backend proxy would be needed for a robust production solution.
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error("The URL does not point to a valid image file.");
      }
      const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || `online-image.${blob.type.split('/')[1]}`;
      const file = new File([blob], fileName, { type: blob.type });
      addImageFile(file);
      setImageUrl('');
    } catch (err: any) {
      setError(err.message || "Could not load image from URL. Check the link and CORS policy.");
      console.error(err);
    } finally {
      setIsUrlLoading(false);
    }
  };

  const handleAnalyze = useCallback(async () => {
    setError(null);
    setIsAnalyzing(true);
    
    const analysisPromises = images.map(async (image) => {
      try {
        const result = await analyzeImage(image.file, category);
        return { ...image, analysis: result };
      } catch (err) {
        console.error(`Failed to analyze ${image.file.name}`, err);
        return { ...image, analysis: { sharpness: 0, size: 0 } }; // Mark as failed
      }
    });

    const updatedImages = await Promise.all(analysisPromises);
    setImages(updatedImages);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  }, [images, category]);

  const handleShowResults = () => {
    if (getTrialsRemaining() > 0) {
      useTrial();
      handleAnalyze();
    } else {
      setShowPaywall(true);
    }
  };
  
  const trialsLeft = getTrialsRemaining();

  if (showPaywall) {
    return <Payment onBack={onBack} />;
  }

  if (analysisComplete) {
    return (
      <div>
        <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-center mb-2 text-teal-300">Analysis Results for {category}</h2>
        <p className="text-center text-gray-400 mb-8">Here is a comparison of the sharpness and size for your uploaded images.</p>
        <div className="bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl">
          <AnalysisChart data={images.map(img => ({ name: img.file.name.substring(0,10)+'...', ...img.analysis! }))} category={category} />
          <ResultDisplay images={images} category={category} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            &larr; Back
          </button>
          <div className="text-right">
              <h2 className="text-3xl font-bold text-teal-300">Analyze {category}</h2>
              <p className="text-gray-400">Upload between {REQUIRED_IMAGE_COUNT} and {MAX_IMAGE_COUNT} images to analyze.</p>
          </div>
      </div>
      
      {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-md text-center mb-4">{error}</p>}
      
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload from Device</label>
                <div className="relative flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-600 rounded-lg">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isAnalyzing || images.length >= MAX_IMAGE_COUNT}
                    />
                    <span className="text-gray-400">Click to select a file</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Or Upload from URL</label>
                <div className="flex">
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="flex-grow px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        disabled={isAnalyzing || images.length >= MAX_IMAGE_COUNT || isUrlLoading}
                    />
                    <button onClick={handleUrlUpload} disabled={isAnalyzing || images.length >= MAX_IMAGE_COUNT || isUrlLoading} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md disabled:bg-gray-600 hover:bg-blue-700">
                        {isUrlLoading ? '...' : 'Load'}
                    </button>
                </div>
            </div>
        </div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {images.map(image => (
          <div key={image.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
            <img src={image.previewUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        ))}
        {images.length < MAX_IMAGE_COUNT && (
          <div className="relative aspect-square flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
            <div className="text-center text-gray-500">
              <p>Slot {images.length + 1}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="text-lg font-semibold">{images.length} / {MAX_IMAGE_COUNT} images uploaded</p>
            <p className="text-sm text-gray-400">Minimum {REQUIRED_IMAGE_COUNT} required. You have {trialsLeft} free trial{trialsLeft !== 1 ? 's' : ''} remaining.</p>
          </div>
          <button
            onClick={handleShowResults}
            disabled={images.length < REQUIRED_IMAGE_COUNT || isAnalyzing}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed enabled:hover:bg-teal-700 enabled:hover:scale-105"
          >
            {isAnalyzing ? <Loader/> : `Analyze Images`}
          </button>
      </div>
    </div>
  );
};

export default ImageAnalyzer;