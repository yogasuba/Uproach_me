'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DotsNavigation from '../../components/DotsNavigation'; // Adjust path if necessary

const SetAvailability = () => {
  const router = useRouter();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = { isAvailable: true, timeSlots: [['09:00', '17:00']] }; // Initial time slot
      return acc;
    }, {})
  );

  const handleToggle = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], isAvailable: !prev[day].isAvailable },
    }));
  };

  const handleAddTimeSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, ['', '']],
      },
    }));
  };

  const handleRemoveTimeSlot = (day, index) => {
    setAvailability((prev) => {
      const updatedSlots = prev[day].timeSlots.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: updatedSlots,
        },
      };
    });
  };

  const handleCopyTimeSlot = (fromDay, toDay) => {
    setAvailability((prev) => ({
      ...prev,
      [toDay]: {
        ...prev[toDay],
        timeSlots: prev[fromDay].timeSlots,
      },
    }));
  };

  const handleChangeTimeSlot = (day, index, type, value) => {
    setAvailability((prev) => {
      const updatedSlots = [...prev[day].timeSlots];
      updatedSlots[index] = [
        type === 'start' ? value : updatedSlots[index][0],
        type === 'end' ? value : updatedSlots[index][1],
      ];
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: updatedSlots,
        },
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-0 bg-gray-100">
      <header className="mt-4 sm:mt-6 mb-4 text-center">
        <h1 className="text-xl sm:text-xl font-bold text-gray-800">
          Set your availability
        </h1>
        <p className="mt-1 text-sm sm:text-xs text-gray-600 font-semibold">
          Seamlessly sync your calendar for effortless scheduling
        </p>
      </header>
      <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md ">
        <ul className="space-y-4 ">
          {days.map((day) => (
            <li key={day} className="flex items-center bg-gray-100 rounded-lg">
              <div className="relative inline-block w-10 mr-4 mf-10 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name={`toggle${day}`}
                  id={`toggle${day}`}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={availability[day].isAvailable}
                  onChange={() => handleToggle(day)}
                />
                <label
                  htmlFor={`toggle${day}`}
                  className={`toggle-label block overflow-hidden h-4 rounded-full ${
                    availability[day].isAvailable ? 'bg-teal-600' : 'bg-gray-300'
                  } cursor-pointer`}
                ></label>
              </div>
              <span className="text-gray-700 font-semibold text-xs sm:text-xs w-24 flex-shrink-0">{day}</span>
              {availability[day].isAvailable && (
                <div className="flex flex-wrap gap-2 ml-2 flex-grow items-center">
                  {availability[day].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg">
                      <input
                        type="time"
                        value={slot[0]}
                        onChange={(e) => handleChangeTimeSlot(day, index, 'start', e.target.value)}
                        className="form-input w-20 text-sm border rounded-lg"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={slot[1]}
                        onChange={(e) => handleChangeTimeSlot(day, index, 'end', e.target.value)}
                        className="form-input w-20 text-sm border rounded-lg"
                      />
                      {index > 0 && (
                        <button
                          className="text-gray-400 hover:text-teal-600"
                          onClick={() => handleRemoveTimeSlot(day, index)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="text-gray-400 hover:text-teal-600"
                    onClick={() => handleAddTimeSlot(day)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-gray-400 hover:text-teal-600"
                    onClick={() =>
                      handleCopyTimeSlot(day, days[(days.indexOf(day) + 1) % days.length])
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 8h7m0 0h7m0 0v7m0-7H4v7h7M13 13h7v7h-7z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() => router.push('/setavailability/page2')}
          className="w-full py-2 mt-3 text-white bg-teal-600 rounded-lg text-sm"
        >
          Next Step <span className="ml-2 text-lg">→</span>
        </button>
        <div className="mt-4">
          <DotsNavigation currentStep={3} totalSteps={5} />
        </div>
      </div>
    </div>
  );
};

export default SetAvailability;
