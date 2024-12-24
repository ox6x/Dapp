 declare module "../contexts/ContractContext" {
  import { ReactNode } from "react";
  export const ContractProvider: ({ children }: { children: ReactNode }) => JSX.Element;
  export const useContractState: () => {
    state: { version: "V1" | "V2"; contract: any };
    dispatch: React.Dispatch<any>;
  };
}