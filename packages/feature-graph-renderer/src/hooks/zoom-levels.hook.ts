import { useReactFlow, useViewport } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nodeSize } from "../utils/positioning.utils";

export interface Viewport {
  x: number;
  y: number;
  zoomLevel: number;
}

const baseZoomLevel = 50 / nodeSize;

const zoomValues = [
  baseZoomLevel,
  baseZoomLevel * 4,
  baseZoomLevel * 16,
  baseZoomLevel * 64,
  baseZoomLevel * 256,
  baseZoomLevel * 1024,
];

export const useZoomLevels = () => {
  const isZooming = useRef<boolean>(false);

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoomLevel: 0,
  });

  const { setCenter } = useReactFlow();

  const { zoom } = useViewport();

  const targetZoom = useMemo(
    () => zoomValues[viewport.zoomLevel],
    [viewport.zoomLevel]
  );

  const zoomToPosition = useCallback(() => {
    setCenter(viewport.x, viewport.y, {
      duration: 600,
      zoom: targetZoom,
    });
  }, [viewport.x, viewport.y, targetZoom]);

  useEffect(() => {
    zoomToPosition();
  }, [viewport.x, viewport.y, targetZoom]);

  return {
    zoom,
    targetZoom,
    zoomValues,
    isZooming,
    viewport,
    zoomLevel: viewport.zoomLevel,
    zoomToPosition,
    setViewport,
  };
};
