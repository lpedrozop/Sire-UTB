import React, { createContext, useContext, useState } from "react";
import "../styles/landing/loader.css";

const LoaderContext = createContext();

const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading(true);
  };
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader debe usarse dentro de un LoaderProvider");
  }
  return context;
};

export { LoaderProvider, useLoader };
