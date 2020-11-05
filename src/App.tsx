import React from "react";
import Dashboard from "./Components/Dashboard";
import DataContextProvider from "./contexts/dataContext";

const App = () => {
  return (
    <DataContextProvider>
      <Dashboard />;
    </DataContextProvider>
  );
};

export default App;
