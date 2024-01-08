import { useState, createContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [authStatus, setAuthStatus] = useState([]);

  const data = { userData, setUserData, authStatus, setAuthStatus };
  //console.log("CONTEXT ", data);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
