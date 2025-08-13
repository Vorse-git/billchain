// src/components/FormElements/CustomSelectSimple.jsx (Corrected)
import React, { useState, useRef, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CustomSelectSimple = ({
  label,
  options = [],
  onChange,
  value,
  id,
  className = '',
  readOnly = false,
  disabled = false,
  error = null,
  placeholder = "Select",
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // IDs
  const selectId = id || `select-${React.useId()}`;
  const errorId = error ? `${selectId}-error` : undefined;

  // Click Outside Handler (simplified useEffect)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref exists and the click was OUTSIDE the ref element, close the dropdown
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    // Add the listener when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);
    // Clean the listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // <- Empty dependency, the listener lives as long as the component exists


  // --- Clases para el Div Principal ---
  const getDivClasses = () => {
    let classes = `
      relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
    `;

    if (disabled || readOnly) {
      classes += ' bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500';
    } else {
      classes += ' bg-white cursor-pointer hover:border-gray-400 hover:shadow-md';
      if (error) {
        classes += ' border-red-500';
      } else if (open) {
        classes += ' ring-1 ring-purple-600 border-purple-600'; // "focus" style if open
      } else {
        classes += ' border-gray-200';
      }
    }
    classes += ` ${className}`;
    return classes.replace(/\s+/g, ' ').trim();
  };


  // --- Classes for the Text of Value ---
  const getValueTextClasses = () => {
    let classes = 'text-sm truncate pr-2';
    if (readOnly || disabled) {
      classes += ' text-gray-500';
    } else if (value) {
      classes += ' text-gray-900';
    } else {
      classes += ' text-gray-400';
    }
     if (error) {
         // You might want a different color if there is an error, although the border already indicates it.
         // classes += ' text-red-900'; // Optional
     }
    return classes;
  };

  // --- Classes for Icons ---
   const getIconClasses = () => {
      let classes = 'h-5 w-5';
      if (readOnly || disabled) {
          classes += ' text-gray-400';
      } else {
          classes += ' text-gray-500';
      }
      return classes;
   }


  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        id={selectId}
        onClick={() => {
           // Only allows opening/closing if NOT readOnly or disabled
           if (!readOnly && !disabled) {
               setOpen(!open);
           }
        }}
        className={getDivClasses()} //Call the function to get classes
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={!!error}
        aria-describedby={errorId}
        tabIndex={disabled ? -1 : 0} // Focus only if not disabled
         onKeyDown={(e) => { // Open/Close with keyboard
            if (!readOnly && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setOpen(!open);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        }}
        {...props}
      >
        {/* Value or Placeholder */}
        <span className={getValueTextClasses()}>
          {value ? options.find((option) => option.value === value)?.label : placeholder}
        </span>

        {/* Icons on the right */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"> {/* pointer-events-none here so that the click passes to the div */}
           {error && (
             <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" aria-hidden="true" />
           )}
           <ChevronDownIcon
             className={`${getIconClasses()} transform transition-transform ${open ? 'rotate-180' : ''}`}
             aria-hidden="true"
           />
        </div>
      </div>

      {/*List of Options (Dropdown) */}
      {/* The condition is simpler: it only depends on 'open' (the click is already blocked if it is readOnly/disabled) */}
      {open && (
        <ul
          className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto w-full"
          role="listbox"
          aria-labelledby={selectId}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                // Redundant but secure verification: only switches if not blocked
                if (!readOnly && !disabled) {
                    onChange(option.value);
                    setOpen(false);
                }
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

       {/* Error message */}
       {error && (
        <p className="mt-1 text-xs text-red-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelectSimple;