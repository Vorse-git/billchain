// src/components/FormElements/CustomInput.jsx
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

const CustomInputSimple = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  className = '',          // For external classes
  readOnly = false,
  disabled = false,
  error = null,            // <-- New prop (error message or null)
  placeholder = "Insert", // <-- Use prop for placeholder
  ...props                      // <-- Rest of props for the input
}) => {

  // IDs for accessibility
  const inputId = id || `input-${React.useId()}`;
  const errorId = error ? `${inputId}-error` : undefined;

  // --- Dynamically building classes with Tailwind ---

  // Base classes (always applied)
  const baseClasses = `
     relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
  `;

  // State classes (applied conditionally)
  const stateClasses = `
    ${error
      ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' // Estado de error
      : 'border-gray-200 focus:ring-purple-600 focus:border-purple-600' // Estado normal y focus
    }
    ${readOnly || disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300 focus:ring-gray-300 focus:border-gray-300' // ReadOnly o Disabled (override focus)
      : 'hover:border-gray-400 hover:shadow-md focus:outline-none' // Hover y focus outline (solo si no es readOnly/disabled)
    }
    ${disabled ? 'opacity-70' : ''} // Opacidad extra si está disabled
  `;

  // Combine classes
  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.replace(/\s+/g, ' ').trim();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md"> {/* Container for icon */}
        <input
          type={type}
          id={inputId}
          value={value}
          onChange={(e) => !readOnly && !disabled && onChange(e.target.value)} // Evita cambio si está bloqueado
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className={combinedClasses} // Apply combined classes
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props} // Pass other props (inputMode, step, etc.)
        />
        {/* Error Icon (displayed if there is an error) */}
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {/* Error Icon (displayed if there is an error) */}
      {error && (
        <p className="mt-1 text-xs text-red-600" id={errorId}>
          {error} {/* Displays error message */}
        </p>
      )}
    </div>
  );
};

export default CustomInputSimple;