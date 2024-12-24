import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk"; // 根据实际需求调整导入
import { getToolsAddress, setVersion } from "../const/addresses";

type Version = "V1" | "V2";

type State = {
  version: Version;
  contract: SmartContract | null; // 明确类型
};

type Action =
  | { type: "SET_VERSION"; version: Version }
  | { type: "SET_CONTRACT"; contract: SmartContract };

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
    default: {
      const _: never = action; // 类型保护
      throw new Error(`Unhandled action type: ${action.type}`);
    }
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