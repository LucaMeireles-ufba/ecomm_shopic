"use client"
import React, { useState } from 'react';
import Slider from 'react-slider';

const DoubleRangeSlider = () => {
  const [values, setValues] = useState([20, 80]);

  const handleChange = (newValues) => {
    setValues(newValues);
  };

  return (
    <div className="w-3/4 mx-auto mt-8">
      <div className="mb-8">
        <Slider
          min={0}
          max={100}
          step={1}
          value={values}
          onChange={handleChange}
          renderTrack={(props, state) => (
            <div
              {...props}
              className="h-4 bg-black rounded-full"
            />
          )}
          renderThumb={(props, state) => (
            <div
              {...props}
              className="w-6 h-6 bg-black border-2 border-white rounded-full -mt-1"
            >
              <div className="text-white text-center mt-2">
                {values[state.index]}
              </div>
            </div>
          )}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-black">Min: {values[0]}</span>
        <span className="text-black">Max: {values[1]}</span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
