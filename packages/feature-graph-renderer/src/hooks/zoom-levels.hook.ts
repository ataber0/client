import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
const zoomValues = [0.2, 1, 5];

export const useZoomLevels = () => {
  const [isZooming, setIsZooming] = useState(false);

  const { zoomTo } = useReactFlow();

  const [zoomLevel, setZoomLevel] = useState(0);

  const zoom = useMemo(() => {
    return zoomValues[zoomLevel];
  }, [zoomLevel]);

  useEffect(() => {
    zoomTo(zoom, {
      duration: 600,
    });

    setTimeout(() => {
      setIsZooming(false);
    }, 800);
  }, [zoom]);

  const zoomIn = useCallback(() => {
    if (isZooming || zoomLevel === zoomValues.length - 1) return;
    setIsZooming(true);
    setZoomLevel(zoomLevel + 1);
  }, [zoomLevel, isZooming]);

  const zoomOut = useCallback(() => {
    if (isZooming || zoomLevel === 0) return;
    setIsZooming(true);
    setZoomLevel(zoomLevel - 1);
  }, [zoomLevel, isZooming]);

  return {
    zoom,
    zoomValues,
    zoomLevel,
    isZooming,
    zoomIn,
    zoomOut,
  };
};
