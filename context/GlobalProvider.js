import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserVerified, setIsUserVerified ] = useState(false)

 const [ city, setCity ] = useState("city")
 const [ country, setCountry ] = useState("country")

  const [ globalCurrency, setCurrency] = useState({
    name: 'currency',
    symbol: '',
    currency: 'GHS'
  });

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        city,
        setCity,
        country,
        setCountry,
        globalCurrency,
        setCurrency,
        isUserVerified,
        setIsUserVerified,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
