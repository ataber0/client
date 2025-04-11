import { useCallback, useMemo } from "react";
import { useMediaQuery as useReactResponsiveMediaQuery } from "react-responsive";

const mediaQueryMap = {
  mobile: {
    index: 0,
    query: "(max-width: 768px)",
  },
  tablet: {
    index: 1,
    query: "(min-width: 768px) and (max-width: 1024px)",
  },
  desktop: {
    index: 2,
    query: "(min-width: 1024px)",
  },
} as const;

export type MediaQueryScreen = keyof typeof mediaQueryMap;

export interface MediaQueryProps {
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

export const useMediaQuery = () => {
  const isMobile = useReactResponsiveMediaQuery({
    query: mediaQueryMap.mobile.query,
  });
  const isTablet = useReactResponsiveMediaQuery({
    query: mediaQueryMap.tablet.query,
  });
  const isDesktop = useReactResponsiveMediaQuery({
    query: mediaQueryMap.desktop.query,
  });

  const currentScreen = useMemo<MediaQueryScreen>(() => {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  }, [isMobile, isTablet, isDesktop]);

  const getScreenIndex = useCallback((screen: MediaQueryScreen) => {
    return mediaQueryMap[screen].index;
  }, []);

  const currentScreenIndex = getScreenIndex(currentScreen);

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentScreen,
    currentScreenIndex,
    getScreenIndex,
  };
};

export const MediaQuery = (content: MediaQueryProps) => {
  const { currentScreenIndex } = useMediaQuery();

  const currentContent = useMemo(() => {
    for (const [key, mediaQuery] of Object.entries(mediaQueryMap).reverse()) {
      const currentContent = content[key as MediaQueryScreen];

      if (
        mediaQuery.index <= currentScreenIndex &&
        currentContent !== undefined
      ) {
        return currentContent;
      }
    }
  }, [content, currentScreenIndex]);

  return currentContent;
};
