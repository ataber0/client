import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
const zoomValues = [0.2, 1, 5];

export const useZoomLevels = () => {
  const [isZooming, setIsZooming] = useState(false);

  const lastMousePos = useRef({ x: 0, y: 0 });

  const { getViewport, setViewport, zoomTo } = useReactFlow();

  const [zoomLevel, setZoomLevel] = useState(0);

  const zoom = useMemo(() => {
    return zoomValues[zoomLevel];
  }, [zoomLevel]);

  const zoomToMousePosition = useCallback(() => {
    const { x: currentX, y: currentY, zoom: currentZoom } = getViewport();

    // zooming out doesn't need to center on the mouse position
    if (zoom < currentZoom) {
      zoomTo(zoom, { duration: 600 });
      return;
    }

    const flowX = (lastMousePos.current.x - currentX) / currentZoom;
    const flowY = (lastMousePos.current.y - currentY) / currentZoom;

    const newX = lastMousePos.current.x - flowX * zoom;
    const newY = lastMousePos.current.y - flowY * zoom;

    setViewport({ x: newX, y: newY, zoom }, { duration: 600 });
  }, [zoom]);

  useEffect(() => {
    zoomToMousePosition();

    setTimeout(() => {
      setIsZooming(false);
    }, 800);
  }, [zoom]);

  const handleMouseWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    if (isZooming) return;

    lastMousePos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (Math.abs(e.deltaY) < 10) return;

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

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
    handleMouseWheel,
  };
};
