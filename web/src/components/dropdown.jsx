import { useState } from "react";

/**
 *
 * @param {import("react").PropsWithChildren<{label: string, items: string[], onSelect: (string) => void, show: boolean}>} props
 * @returns {import("react").JSX.Element}
 */
export default function Dropdown({ label, items, onSelect, show }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className={`justify-center items-center w-full text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500 ${show ? "inline-flex" : "hidden"}`}
      >
        <span className="px-4 py-2">{label}</span>
        <svg
          className="h-5 w-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        className={`transition-opacity duration-150 origin-top-left absolute left-0 mt-2 max-w-56 flex-col rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2 ${open ? "opacity-100" : "opacity-0"} ${show ? "flex" : "hidden"}`}
      >
        {/* eslint-disable-next-line react/prop-types */}
        {items.map((user) => (
          <button
            key={user}
            onClick={() => onSelect(user)}
            className="block px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}
