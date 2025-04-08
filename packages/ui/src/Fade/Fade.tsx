import { HTMLAttributes, useEffect } from "react";
import { useTransitionState } from "react-transition-state";
import { cn } from "../utils/cn";

interface FadeProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  in?: boolean;
  timeout?: number;
}

export const Fade = ({
  children,
  in: inProp = true,
  timeout = 5000,
  style,
  className,
  ...props
}: FadeProps) => {
  const [state, toggle] = useTransitionState({
    enter: true,
    timeout,
  });

  useEffect(() => {
    toggle();
  }, []);

  return (
    <div
      className={cn(
        `transition-opacity duration-[${timeout}ms] ease-in-out`,
        state.isEnter ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ transitionDuration: `${timeout}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
