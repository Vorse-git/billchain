import { useState } from "react";

const Navbar = () => {
  const [search, setSearch] = useState("");

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#FBFCFF] border-b border-gray-00">
      {/* Search engine with icon */}
      <div className="relative" style={{ width: "400px", height: "40px" }}>
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full px-4 pl-8 border rounded-full focus:outline-none focus:ring-1 focus:ring-[#4416A8] hover:shadow-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute inset-y-0 left-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Usuario"
          className="w-10 h-10 rounded-full border"
        />
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">Nicolás Vargas</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
