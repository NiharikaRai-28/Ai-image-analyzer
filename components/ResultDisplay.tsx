
import React, { useMemo } from 'react';
import { ImageFile, Category } from '../types';

interface ResultDisplayProps {
  images: ImageFile[];
  category: Category;
}

const ResultCard: React.FC<{ title: string; image: ImageFile | undefined; sharpness?: number; size?: number; fruitBearing?: number; greenLeafs?: number; sizeLabel: string; }> = ({ title, image, sharpness, size, fruitBearing, greenLeafs, sizeLabel }) => {
    if (!image) return null;

    return (
        <div className="bg-gray-700 rounded-lg p-4 text-center shadow-lg">
            <h4 className="text-xl font-bold mb-3 text-teal-300">{title}</h4>
            <img src={image.previewUrl} alt={title} className="w-full h-48 object-contain rounded-md mb-3" />
            <p className="text-sm text-gray-300 truncate" title={image.file.name}>{image.file.name}</p>
            <div className="mt-2 text-left text-sm space-y-1">
                {sharpness !== undefined && <p><span className="font-semibold text-gray-400">Sharpness:</span> {sharpness}/10</p>}
                {size !== undefined && <p><span className="font-semibold text-gray-400">{sizeLabel}:</span> {size}/10</p>}
                {fruitBearing !== undefined && <p><span className="font-semibold text-gray-400">Fruit Bearing:</span> {fruitBearing}/10</p>}
                {greenLeafs !== undefined && <p><span className="font-semibold text-gray-400">Green Leafs:</span> {greenLeafs}/10</p>}
            </div>
        </div>
    );
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, category }) => {
    const results = useMemo(() => {
        const analyzedImages = images.filter(img => img.analysis);
        if (analyzedImages.length === 0) return {};

        if (category === Category.Pencils) {
            let sharpest = analyzedImages[0];
            let smallest = analyzedImages[0];
            let longest = analyzedImages[0];

            for (const image of analyzedImages) {
                if (image.analysis!.sharpness! > sharpest.analysis!.sharpness!) {
                    sharpest = image;
                }
                if (image.analysis!.size < smallest.analysis!.size) {
                    smallest = image;
                }
                if (image.analysis!.size > longest.analysis!.size) {
                    longest = image;
                }
            }
            return { sharpestImage: sharpest, smallestImage: smallest, longestImage: longest };
        } else { // Trees
            let tallest = analyzedImages[0];
            let mostFruitful = analyzedImages[0];
            let greenest = analyzedImages[0];

            for (const image of analyzedImages) {
                if (image.analysis!.size > tallest.analysis!.size) {
                    tallest = image;
                }
                if (image.analysis!.fruitBearing! > mostFruitful.analysis!.fruitBearing!) {
                    mostFruitful = image;
                }
                 if (image.analysis!.greenLeafs! > greenest.analysis!.greenLeafs!) {
                    greenest = image;
                }
            }
            return { tallestTree: tallest, mostFruitfulTree: mostFruitful, greenestTree: greenest };
        }
    }, [images, category]);

    const sizeLabel = category === Category.Pencils ? 'Length' : 'Height';

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-6">Summary</h3>
            {category === Category.Pencils ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <ResultCard 
                        title="Highest Sharpness" 
                        image={results.sharpestImage} 
                        sharpness={results.sharpestImage?.analysis?.sharpness}
                        size={results.sharpestImage?.analysis?.size}
                        sizeLabel={sizeLabel}
                    />
                    <ResultCard 
                        title="Longest Pencil"
                        image={results.longestImage} 
                        sharpness={results.longestImage?.analysis?.sharpness}
                        size={results.longestImage?.analysis?.size}
                        sizeLabel={sizeLabel}
                    />
                    <ResultCard 
                        title="Shortest Pencil"
                        image={results.smallestImage} 
                        sharpness={results.smallestImage?.analysis?.sharpness}
                        size={results.smallestImage?.analysis?.size}
                        sizeLabel={sizeLabel}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <ResultCard 
                        title="Tallest Tree" 
                        image={results.tallestTree} 
                        {...results.tallestTree?.analysis}
                        sizeLabel={sizeLabel}
                    />
                    <ResultCard 
                        title="Most Fruit Bearing"
                        image={results.mostFruitfulTree} 
                        {...results.mostFruitfulTree?.analysis}
                        sizeLabel={sizeLabel}
                    />
                     <ResultCard 
                        title="Most Green Leafs"
                        image={results.greenestTree} 
                        {...results.greenestTree?.analysis}
                        sizeLabel={sizeLabel}
                    />
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;
