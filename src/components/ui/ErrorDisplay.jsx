import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * A reusable component to display an error message consistently.
 * @param {object} props
 * @param {string} props.message - The error message to display.
 * @param {string} [props.title='An error occurred'] - An optional title for the error box.
 */
const ErrorDisplay = ({ message, title = 'An error occurred' }) => {
    return (
        <div className="flex justify-center items-center h-full w-full p-4">
            <div className="w-full max-w-md bg-red-50 border-l-4 border-red-400 p-6 rounded-md shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-800">{title}</h3>
                        <p className="mt-2 text-sm text-red-700">
                            {/* Displays a default message if one is not provided */}
                            {message || 'Something went wrong. Please try again later.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;