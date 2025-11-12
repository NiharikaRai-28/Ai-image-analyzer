import React from 'react';

interface PaymentProps {
    onBack: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onBack }) => {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg shadow-2xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Free Trials Exhausted</h2>
        <p className="text-xl text-center text-gray-300 mb-6">To continue analyzing images, please make a payment by scanning the QR code below with your payment app.</p>
        
        <div className="bg-white p-4 rounded-lg shadow-inner mb-6">
            <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExamplePayment" 
                alt="Payment QR Code"
                className="w-48 h-48 md:w-56 md:h-56"
            />
        </div>

        <p className="text-gray-400 mb-8">After payment, your account will be upgraded automatically.</p>

        <button 
            onClick={onBack} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  };
  
  export default Payment;
  