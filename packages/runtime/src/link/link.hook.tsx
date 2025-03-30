import { createContext, ElementType, ReactNode, useContext } from "react";

export const LinkContext = createContext<ElementType | undefined>(undefined);

export interface LinkProviderProps {
  linkComponent: ElementType;
  children: ReactNode;
}

export const LinkProvider = ({
  linkComponent: LinkComponent,
  children,
}: LinkProviderProps) => {
  return (
    <LinkContext.Provider value={LinkComponent}>
      {children}
    </LinkContext.Provider>
  );
};

export const useLink = () => {
  const context = useContext(LinkContext);

  if (!context) {
    throw Error("useLink must be used within the LinkProvider");
  }

  return context;
};
