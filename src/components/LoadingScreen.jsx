import React from 'react';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
         <div className="text-[#5fd4f6] flex items-center">
            <span className='text-xl tracking-wider'>Loading</span>
            <div className="lds-dots mt-2">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
  );
}

export default LoadingScreen;
