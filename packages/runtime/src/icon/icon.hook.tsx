import { createContext, ElementType, ReactNode, useContext } from "react";

export const IconContext = createContext<ElementType | undefined>(undefined);

export interface IconProviderProps {
  iconComponent: ElementType;
  children: ReactNode;
}

export const IconProvider = ({
  iconComponent: IconComponent,
  children,
}: IconProviderProps) => {
  return (
    <IconContext.Provider value={IconComponent}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcon = () => {
  const context = useContext(IconContext);

  if (!context) {
    throw Error("useIcon must be used within the IconProvider");
  }

  return context;
};
