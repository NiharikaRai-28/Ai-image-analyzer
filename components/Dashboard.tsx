
import React from 'react';
import { Category } from '../types';

interface DashboardProps {
  onSelectCategory: (category: Category) => void;
}

const CategoryCard: React.FC<{ category: Category; imageUrl: string; onClick: () => void }> = ({ category, imageUrl, onClick }) => (
  <div
    onClick={onClick}
    className="relative group bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
  >
    <img src={imageUrl} alt={category} className="w-full h-80 object-cover group-hover:opacity-50 transition-opacity duration-300" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <h3 className="text-4xl font-extrabold text-white tracking-wider">
        {category}
      </h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onSelectCategory }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4 text-teal-300">Choose a Category</h2>
      <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">Select a category below to begin uploading images for AI analysis. You'll need to upload 10 images to see the comparison graph.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CategoryCard
          category={Category.Pencils}
          imageUrl="https://picsum.photos/800/600?random=1"
          onClick={() => onSelectCategory(Category.Pencils)}
        />
        <CategoryCard
          category={Category.Trees}
          imageUrl="https://picsum.photos/800/600?random=2"
          onClick={() => onSelectCategory(Category.Trees)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
