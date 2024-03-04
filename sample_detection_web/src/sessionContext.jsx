import { createContext, useState } from "react";

export const SessionContext = createContext({
  user: undefined,
  room: undefined,
  results: [],
  // eslint-disable-next-line no-unused-vars
  setSession: (_user, _room) => void 0,
  // eslint-disable-next-line no-unused-vars
  setResults: (_results) => void 0,
});

export function SessionProvider({ children }) {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [results, setResults] = useState([]);

  return (
    <SessionContext.Provider
      value={{
        user,
        room,
        results,
        setSession: (user, room) => {
          setUser(user);
          setRoom(room);
        },
        setResults,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
