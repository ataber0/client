import React, { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../utils/cn";
import { View } from "../View/View";

type PolymorphicProps<Element extends ElementType, Props> = Props &
  Omit<ComponentPropsWithoutRef<Element>, "renderAs"> & {
    renderAs?: Element;
  };

export type CardProps<Element extends ElementType> = PolymorphicProps<
  Element,
  {
    children: ReactNode;
    url?: string;
    className?: string;
  }
>;

const defaultElement = View;

export const Card = <Element extends ElementType = typeof defaultElement>({
  renderAs,
  className,
  children,
  ...rest
}: CardProps<Element>) => {
  const RenderAs = renderAs ?? defaultElement;

  return (
    <RenderAs
      className={cn(
        "bg-surface rounded-xl shadow-gray-200 shadow-md border-2 border-gray-200",
        rest.href &&
          "shadow-lg hover:shadow-xl shadow-gray-300 transition-shadow duration-500",
        className,
      )}
      {...rest}
    >
      {children}
    </RenderAs>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const Body = ({ className, children }: CardBodyProps) => {
  return <View className={cn("p-6", className)}>{children}</View>;
};

Card.Body = Body;
