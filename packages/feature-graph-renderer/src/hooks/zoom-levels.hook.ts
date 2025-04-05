import { useReactFlow, useViewport } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { nodeSize } from "../utils/positioning.utils";

export interface Viewport {
  x: number;
  y: number;
  zoomLevel: number;
}

const baseZoomLevel = nodeSize / 150000000;

const zoomValues = [
  baseZoomLevel,
  baseZoomLevel * 5,
  baseZoomLevel * 25,
  baseZoomLevel * 125,
  baseZoomLevel * 625,
  baseZoomLevel * 3125,
];

export const useZoomLevels = () => {
  const [isZooming, setIsZooming] = useState(false);

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoomLevel: 0,
  });

  const { setCenter, screenToFlowPosition } = useReactFlow();

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

  const handleMouseWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (isZooming) return;

    if (Math.abs(e.deltaY) < 10) return;

    const mousePosition = {
      x: e.clientX,
      y: e.clientY,
    };

    const zoomLevel =
      e.deltaY < 0
        ? Math.min(viewport.zoomLevel + 1, zoomValues.length - 1)
        : Math.max(viewport.zoomLevel - 1, 0);

    setIsZooming(true);
    setViewport({ ...screenToFlowPosition(mousePosition), zoomLevel });
    setTimeout(() => {
      setIsZooming(false);
    }, 800);
  };

  return {
    zoom,
    targetZoom,
    zoomValues,
    isZooming,
    zoomLevel: viewport.zoomLevel,
    handleMouseWheel,
    zoomToPosition,
    setViewport,
  };
};
