import { useState } from "react";

interface ViewportState {
  offset: { x: number; y: number };
  scale: number;
}

interface Point {
  x: number;
  y: number;
}

export const useViewportControls = () => {
  const [viewport, setViewport] = useState<ViewportState>({
    offset: { x: 0, y: 0 },
    scale: 1,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point>({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState<
    number | null
  >(null);

  const handleStartPan = (point: Point) => {
    setIsPanning(true);
    setLastPanPoint(point);
  };

  const handlePan = (point: Point) => {
    if (!isPanning) return;

    const dx = point.x - lastPanPoint.x;
    const dy = point.y - lastPanPoint.y;

    setViewport((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + dx,
        y: prev.offset.y + dy,
      },
    }));

    setLastPanPoint(point);
  };

  const handleEndPan = () => {
    setIsPanning(false);
  };

  const getPinchDistance = (touch1: Point, touch2: Point) => {
    return Math.hypot(touch2.x - touch1.x, touch2.y - touch1.y);
  };

  const getPinchMidpoint = (touch1: Point, touch2: Point): Point => {
    return {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
    };
  };

  const handleStartPinch = (touch1: Point, touch2: Point) => {
    const distance = getPinchDistance(touch1, touch2);
    const midpoint = getPinchMidpoint(touch1, touch2);
    setInitialPinchDistance(distance);
    setLastPanPoint(midpoint);
  };

  const handlePinch = (touch1: Point, touch2: Point) => {
    if (initialPinchDistance === null) return;

    const currentDistance = getPinchDistance(touch1, touch2);
    const currentMidpoint = getPinchMidpoint(touch1, touch2);
    const scaleFactor = currentDistance / initialPinchDistance;
    const newScale = Math.max(0.1, Math.min(5, viewport.scale * scaleFactor));

    // Calculate the movement of the pinch center
    const dx = currentMidpoint.x - lastPanPoint.x;
    const dy = currentMidpoint.y - lastPanPoint.y;

    // Calculate how the pinch point would move due to the scale change
    const scaleDiff = newScale - viewport.scale;
    const pinchX = currentMidpoint.x - viewport.offset.x;
    const pinchY = currentMidpoint.y - viewport.offset.y;
    const scaleOffsetX = pinchX * (scaleDiff / viewport.scale);
    const scaleOffsetY = pinchY * (scaleDiff / viewport.scale);

    setViewport((prev) => ({
      scale: newScale,
      offset: {
        x: prev.offset.x + dx - scaleOffsetX,
        y: prev.offset.y + dy - scaleOffsetY,
      },
    }));

    setInitialPinchDistance(currentDistance);
    setLastPanPoint(currentMidpoint);
  };

  const handleEndPinch = () => {
    setInitialPinchDistance(null);
  };

  return {
    viewport,
    setViewport,
    handleStartPan,
    handlePan,
    handleEndPan,
    handleStartPinch,
    handlePinch,
    handleEndPinch,
  };
};
