import React, { useEffect, useState } from 'react';

const MainLoader = ({ onLoaded }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
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
    <div className="fixed inset-0 bg-gradient-to-br from-black via-yellow-900 to-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 relative w-full h-full">
        {/* Logo sits in the center */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-52 h-52 rounded-full shadow-lg border-4 border-yellow-400" />
          {/* Loading dots below logo */}
          <div className="flex justify-center mt-8">
            <span className="loader-dot bg-yellow-400"></span>
            <span className="loader-dot bg-yellow-400"></span>
            <span className="loader-dot bg-yellow-400"></span>
          </div>
        </div>
      </div>
      {/* Modal for no internet connection */}
      {!isOnline && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-black border border-yellow-400 rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">No Internet Connection</h2>
            <p className="text-yellow-200 mb-4">
              Please connect to the internet to continue using CirclePay.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded hover:from-yellow-500 hover:to-yellow-700 font-semibold border border-yellow-400"
                onClick={() => window.location.reload()}
              >
                OK
              </button>
              <button
                className="bg-yellow-900 text-yellow-400 px-4 py-2 rounded hover:bg-yellow-800 font-semibold border border-yellow-400"
                onClick={() => null}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .loader-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          margin: 0 6px;
          animation: loader-bounce 1.2s infinite;
        }
        .loader-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loader-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes loader-bounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.7; }
          40% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MainLoader;