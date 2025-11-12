import React from 'react';

interface HomeProps {
  onGetStarted: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="flex items-center mb-4">
      <div className="bg-teal-500/20 text-teal-300 p-3 rounded-full mr-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-teal-300">{title}</h3>
    </div>
    <p className="text-gray-400">{children}</p>
  </div>
);

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500">
          AI Image Analyzer
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Unlock powerful insights from your images. Upload, analyze, and compare with cutting-edge AI technology.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-110 duration-300 shadow-lg"
        >
          Get Started
        </button>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <InfoCard title="About Us" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
          We leverage the power of generative AI to provide detailed analysis of images. Our platform is designed for hobbyists, researchers, and professionals who need to understand image characteristics with precision.
        </InfoCard>
        <InfoCard title="Our Mission" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
          Our mission is to democratize image analysis, making sophisticated AI tools accessible and easy to use for everyone. We aim to provide fast, reliable, and insightful data to help you make better decisions.
        </InfoCard>
        <InfoCard title="Our Vision" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
          We envision a future where AI-powered analysis is an integral part of various industries, from agriculture to creative arts, driving innovation and efficiency through data-driven visual understanding.
        </InfoCard>
      </div>
    </div>
  );
};

export default Home;
