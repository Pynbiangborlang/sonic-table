import React, { createContext, useContext, useState } from "react";

const SonicTableCtx = createContext();

export const useSonicTable = () => useContext(SonicTableCtx);

const SonicTableProvider = ({ children }) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowIndex, selectRow] = React.useState(-1);
  const [expanded, setExpanded] = useState({});

  return (
    <SonicTableCtx.Provider
      value={{
        rowIndex,
        rowSelection,
        selectRow,
        setRowSelection,
        expanded,
        setExpanded,
      }}
    >
      {children}
    </SonicTableCtx.Provider>
  );
};

export default SonicTableProvider;
