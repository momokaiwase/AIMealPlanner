import React from 'react';
import loading from './loading.svg';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white bg-opacity-80">
      <div className="text-2xl text-gray-800 mb-4">Generating...</div>
      <img src={loading} alt="Loading" />
    </div>
  );
}

export default Loading;
