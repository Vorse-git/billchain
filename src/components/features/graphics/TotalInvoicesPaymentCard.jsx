import React, { useState, useEffect } from "react";

const TotalInvoicesPaymentCard = ({ number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = Math.max(Math.floor(duration / number), 20);

    const timer = setInterval(() => {
      start += Math.ceil(number / (duration / stepTime));
      if (start >= number) {
        start = number;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex-1 flex flex-col items-start gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8 text-[#4416A8]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <h2 className="text-lg font-semibold text-gray-700">Total Invoices Payment</h2>
      <p className="text-3xl font-bold text-[#4416A8]">{count}</p>
    </div>
  );
};

export default TotalInvoicesPaymentCard;