import { createContext, useContext } from "react";
import { useZoomLevels } from "./zoom-levels.hook";

const GraphRendererContext = createContext<
  ReturnType<typeof useZoomLevels> | undefined
>(undefined);

export const useGraphRenderer = () => {
  const context = useContext(GraphRendererContext);

  if (!context) {
    throw new Error(
      "useGraphRenderer must be used within a GraphRendererProvider"
    );
  }

  return context;
};

export const GraphRendererProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const zoomLevels = useZoomLevels();

  return (
    <GraphRendererContext.Provider value={{ ...zoomLevels }}>
      {children}
    </GraphRendererContext.Provider>
  );
};
