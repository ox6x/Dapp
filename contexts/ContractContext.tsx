 import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useContract } from "@thirdweb-dev/react";
import { getToolsAddress, setVersion } from "../const/addresses";

type Version = "V1" | "V2";

type State = {
  version: Version;
  contract: any; // 可根据具体的合约类型替换 `any`，例如 SmartContract<BaseContract>
};

type Action =
  | { type: "SET_VERSION"; version: Version }
  | { type: "SET_CONTRACT"; contract: any };

const ContractContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

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
  const { contract } = useContract(getToolsAddress());
  const [state, dispatch] = useReducer(contractReducer, {
    version: "V1",
    contract: null,
  });

  // 从 localStorage 初始化版本
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("ADDRESS_VERSION") as Version;
      if (savedVersion === "V1" || savedVersion === "V2") {
        dispatch({ type: "SET_VERSION", version: savedVersion });
      }
    }
  }, []);

  // 更新 contract 对象
  useEffect(() => {
    if (contract) {
      dispatch({ type: "SET_CONTRACT", contract });
    }
  }, [contract]);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractState = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error(
      "useContractState must be used within a ContractProvider"
    );
  }
  return context;
};