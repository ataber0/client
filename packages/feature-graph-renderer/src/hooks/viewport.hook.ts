import {
  useReactFlow,
  useViewport as useReactFlowViewport,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nodeSize } from "../utils/positioning.utils";
import { getBaseScale } from "../utils/scale.utils";

export interface Viewport {
  x: number;
  y: number;
  zoomLevel: number;
}

const baseZoomLevel = 70 / nodeSize;

export const useViewport = () => {
  const isZooming = useRef<boolean>(false);

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoomLevel: 0,
  });

  const { setCenter } = useReactFlow();

  const { zoom } = useReactFlowViewport();

  const targetZoom = useMemo(
    () => baseZoomLevel * getBaseScale(viewport.zoomLevel),
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
    isZooming,
    viewport,
    baseZoomLevel,
    zoomLevel: viewport.zoomLevel,
    zoomToPosition,
    setViewport,
  };
};
