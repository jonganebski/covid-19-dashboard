import React from "react";
import Dashboard from "./Components/Dashboard";
import DataContextProvider from "./contexts/dataContext";
import SelectContextProvider from "./contexts/selectContext";

const App = () => {
  return (
    <DataContextProvider>
      <SelectContextProvider>
        <Dashboard />
      </SelectContextProvider>
    </DataContextProvider>
  );
};

export default App;
