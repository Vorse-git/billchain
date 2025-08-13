import { useState } from "react";
import logo from "../../../img/logo-billchain.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const Sidebar = () => {
  // 2.Get the 'logout' function from our context
  const { logout } = useAuth();

  // 3. Create a handler for the click event
  const handleLogout = async () => {
    try {
      await logout();
      // We don't need to navigate. The system will react on its own..
      console.log("Logout solicitado desde el Sidebar.");
    } catch (error) {
      console.error("Error al hacer logout desde el Sidebar:", error);
    }
  };
  return (
<div className="flex min-h-screen w-[250px] flex-col border-r bg-[#FBFCFF]">
    <div className="px-4 py-6">
        {/* logo at the top with 200px width and aligned to the left */}
        <div className="mb-8 flex justify-start">
          <img src={logo} alt="Logo" className="w-32" /> {/* 200px de ancho (w-48) */}
        </div>

        {/* Main menu */}
        <ul className="space-y-1">
          {/* Home */}
          <li>
            <a
              href="#"
              className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]"
            >
              {/* House icon with size 20px x 20px, text color and spacing 18px */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </a>
          </li>

          {/* Settings */}
          <li>
            <a
              href="#"
              className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]"
            >
              {/* Settings icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </a>
          </li>

          {/* Support */}
          <li>
            <a
              href="#"
              className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]"
            >
              {/* Support icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <span className="text-sm font-medium">Support</span>
            </a>
          </li>

          {/* Divider */}
          <hr className="my-2 border-gray-200" />

          {/* Invoices Dropdown */}
          <li>
  <details className="group [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex cursor-pointer items-center justify-between px-4 py-3 gap-2 border-s-[3px] border-transparent text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]">
      <span className="flex items-center gap-2 text-sm font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203c-.536.072-.974.478-1.021 1.017a4.559 4.559 0 0 0-.018.402c0 .464.336.844.775.994l2.95 1.012c.44.15.775.53.775.994 0 .136-.006.27-.018.402-.047.539-.485.945-1.021 1.017a9.077 9.077 0 0 1-3.461-.203M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
        Invoices
      </span>
      <span className="shrink-0 transition duration-300 group-open:-rotate-180">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </summary>
    <ul className="mt-2 space-y-1 px-4">
      <li>
       <Link
          to="/createinvoice"
          className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-800"
        >
          Create Invoice
        </Link>
      </li>
      <li>
        <Link
          to="/myinvoices"
          className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-800"
        >
          My Invoices
        </Link>
      </li>
    </ul>
  </details>
</li>


          {/* Reports Dropdown */}
          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 gap-2 border-s-[3px] border-transparent text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  Reports
                </span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]"
                  >
                    <span className="text-sm font-medium">Create Report</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-[#4416A8] hover:bg-[#F9F6FF] hover:text-[#4416A8]"
                  >
                    <span className="text-sm font-medium">My Reports</span>
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      {/* Footer del sidebar */}
      <div className="sticky inset-x-0 bottom-0 items-center justify-center py-5 border-t px-10 border-gray-100">
          <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-sm px-8 py-3 text-sm font-medium text-gray-400 transition hover:text-[#4416A8] focus:outline-none focus:ring-0 bg-transparent border-none"

          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
          <span>Logout</span>
        </button>
       </div>

    </div>
  );
};

export default Sidebar;