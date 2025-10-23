import React, { useEffect, useState } from 'react';

const MainLoader = ({ onLoaded }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 relative w-full h-full">
        {/* Logo sits in the center, no bounce */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-28 h-28 rounded-full shadow-lg" />
        </div>
      </div>
      {/* Modal for no internet connection */}
      {!isOnline && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">No Internet Connection</h2>
            <p className="text-gray-700 mb-4">
              Please connect to the internet to continue using CirclePay.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
                onClick={() => window.location.reload()}
              >
                OK
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                onClick={() => null}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLoader;