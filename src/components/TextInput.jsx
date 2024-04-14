import React from 'react';

function TextInput({ value, label }) {
    return (
    <div className="flex flex-col">
      <label htmlFor="input" className="text-sm font-medium text-gray-700">{label}</label>
      <input
        id="input"
        type="text"
        value={value}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter text..."
      />
    </div>
  );
}

export default TextInput;
