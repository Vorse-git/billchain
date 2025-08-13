// src/components/FormElements/CustomDatePickerSimple.jsx (Updated States, Calendar Restored)
import React from 'react';
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/20/solid';
import "react-day-picker/dist/style.css";

const CustomDatePickerSimple = ({
  label,
  value,
  onChange,
  id,
  className = '',
  readOnly = false,
  disabled = false,
  error = null,
  placeholder = "MM/DD/AAAA",
  dateFormat = "MM/dd/yyyy",
  ...props
}) => {

  // IDs for accessibility
  const datePickerId = id || `datepicker-${React.useId()}`;
  const errorId = error ? `${datePickerId}-error` : undefined;
  const isBlocked = readOnly || disabled;

  // --- Classes for the Trigger Div (Maintaining the state logic) ---
  const getTriggerDivClasses = () => {
    let classes = `
       relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
    `;

    if (isBlocked) {
      classes += ' bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500';
    } else {
      classes += ' bg-white cursor-pointer focus:outline-none';
      classes += ' hover:border-gray-400 hover:shadow-md';
      if (error) {
        classes += ' border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500';
      } else {
        // Use focus-within to simulate focus on the div when the inner button has focus
        classes += ' border-gray-200 focus-within:ring-1 focus-within:ring-purple-600 focus-within:border-purple-600';
      }
    }
    classes += ` ${className}`;
    return classes.replace(/\s+/g, ' ').trim();
  };

  // --- Classes for Value Text/Placeholder (Maintaining State Logic) ---
  const getValueTextClasses = () => {
    let classes = 'text-sm truncate';
    if (isBlocked) {
      classes += ' text-gray-500';
    } else if (value) {
      classes += ' text-gray-900';
    } else {
      classes += ' text-gray-400';
    }
    return classes;
  };

   // --- Classes for Icons (Maintaining state logic) ---
   const getIconClasses = (isErrorIcon = false) => {
      let classes = 'h-5 w-5';
      if (isErrorIcon) {
          classes += ' text-red-500';
      } else if (isBlocked) {
          classes += ' text-gray-400';
      } else {
          classes += ' text-gray-500';
      }
      return classes;
   }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={datePickerId} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Popover placement="bottom" disabled={isBlocked}>
        <PopoverHandler>
          {/* Use a normal 'div' as a trigger if 'button' was giving problems,
             but add tabIndex for focus and onKeyDown for accessibility */}
          <div
            id={datePickerId}
            tabIndex={isBlocked ? -1 : 0}
            className={getTriggerDivClasses()}
            aria-haspopup="dialog"
            aria-invalid={!!error}
            aria-describedby={errorId}
             onKeyDown={(e) => {
                if (!isBlocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                        // We need a way to open the popover programmatically
                        // or simulate a click here if MT allows it.
                        // For now, this just prevents the default action.
                        // Mouse clicks do work.
                }
            }}
            {...props}
          >
            {/*Internal content of the trigger */}
            <div className="flex items-center gap-2 overflow-hidden pointer-events-none"> {/* pointer-events-none para que el click pase al div padre */}
              <CalendarIcon className={getIconClasses()} aria-hidden="true"/>
              <span className={getValueTextClasses()}>
                {value ? format(value, dateFormat) : placeholder}
              </span>
            </div>
             {/* Error icon (if applicable) */}
             {error && !isBlocked && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ExclamationCircleIcon className={getIconClasses(true)} aria-hidden="true" />
                </div>
             )}
          </div>
        </PopoverHandler>
        {/* --- POPOVER AND DAYPICKER CONTENT RESTORED --- */}
        <PopoverContent className="z-[9999] p-4 bg-white shadow-lg rounded-2xl overflow-visible w-auto">
          <DayPicker
            mode="single"
            selected={value}
              // Make sure onChange is only called if it is not blocked
            onSelect={(selectedDate) => !isBlocked && onChange(selectedDate)}
            showOutsideDays
            className="w-full custom-calendar" // We keep the class for the JSX styles
              // Icon components restored to original version
            components={{
              IconLeft: (props) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: (props) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
        {/* ------------------------------------------------- */}
      </Popover>
      {/* Error Message (displayed if error exists and not blocked) */}
      {error && !isBlocked && (
        <p className="text-red-600 text-xs mt-1" id={errorId}>
            {error}
        </p>
      )}

      {/* --- JSX STYLES RESTORED --- */}
      <style jsx>{`
        .custom-calendar .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_outside) { /* Avoid hovering on non-interactive days */
          background-color: #f3e8ff; /* A lighter purple for hover */
          border-radius: 8px;
        }
        .custom-calendar .rdp-day_selected {
          background-color: #4416A8 !important; /* Your main violet */
          color: white !important;
          border-radius: 8px; /* Make it consistent */
        }
         /* Optional: Improve visibility of the current day */
        .custom-calendar .rdp-day_today {
             font-weight: bold;
             color: #4416A8;
        }
        /* Adjust size/padding if necessary */
        .custom-calendar .rdp-caption_label {
             font-size: 0.875rem; /* text-sm */
             font-weight: 500; /* medium */
        }
        .custom-calendar .rdp-head_cell {
             font-size: 0.75rem; /* text-xs */
             color: #6b7280; /* gray-500 */
        }
      `}</style>
      {/* ---------------------------- */}
    </div>
  );
};

export default CustomDatePickerSimple;