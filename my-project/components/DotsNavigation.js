// components/DotsNavigation.js
import React from 'react';

const DotsNavigation = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 mx-1 rounded-full ${index === currentStep ? 'bg-teal-600' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default DotsNavigation;
