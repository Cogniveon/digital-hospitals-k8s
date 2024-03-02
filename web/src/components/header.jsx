import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./dropdown";
import { useContext } from "react";
import { SessionContext } from "../sessionContext";

/**
 *
 * @param {import("react").PropsWithChildren<{logout: () => void, user: string, setUser: (user: string) => void, room: string, setRoom: (room: string) => void}>} props
 * @returns {import("react").JSX.Element}
 */
export default function Header() {
  const navigate = useNavigate();
  const { user, room, setSession } = useContext(SessionContext);
  const isLoggedIn = typeof user !== "undefined" && typeof room !== "undefined";

  return (
    <header
      className={`flex ${isLoggedIn ? "" : "flex-col"} lg:flex-row justify-between items-center w-full p-4 max-w-4xl h-24 mx-auto gap-4`}
    >
      <Link
        to={`/`}
        title="Home"
        className="flex items-center justify-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <span className="md:inline hidden">Home</span>
      </Link>
      {isLoggedIn ? (
        <button
          onClick={() => {
            setSession(undefined, undefined);
            navigate("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      ) : (
        <div className="flex items-center justify-center space-x-3">
          <Dropdown
            label={"Select a user"}
            items={["rohit", "anand"]}
            onSelect={(user) => {
              setSession(user, room);
            }}
            show={typeof user === "undefined"}
          />
          <Dropdown
            label={"Select a room"}
            items={["hist1", "hist2", "hist3"]}
            onSelect={(room) => {
              setSession(user, room);
            }}
            show={typeof room === "undefined"}
          />
          {/* <button
            className="space-x-1 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white px-6 py-2 rounded-lg w-full flex items-center justify-center sm:w-auto"
            onClick={() => login(user, room)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <span>Login</span>
          </button> */}
        </div>
      )}
    </header>
  );
}
