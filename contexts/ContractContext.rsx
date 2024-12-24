import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { useContract } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS, setVersion } from "../const/addresses";

type State = {
  version: "V1" | "V2";
  contract: any;
};

type Action = { type: "SET_VERSION"; version: "V1" | "V2" } | { type: "SET_CONTRACT"; contract: any };

const ContractContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const contractReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_VERSION":
      setVersion(action.version);
      return { ...state, version: action.version };
    case "SET_CONTRACT":
      return { ...state, contract: action.contract };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { contract } = useContract(TOOLS_ADDRESS);
  const [state, dispatch] = useReducer(contractReducer, { version: "V1", contract });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("ADDRESS_VERSION") as "V1" | "V2";
      if (savedVersion) {
        dispatch({ type: "SET_VERSION", version: savedVersion });
      }
    }
  }, [dispatch]);

  return <ContractContext.Provider value={{ state, dispatch }}>{children}</ContractContext.Provider>;
};

export const useContractState = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContractState must be used within a ContractProvider");
  }
  return context;
};
