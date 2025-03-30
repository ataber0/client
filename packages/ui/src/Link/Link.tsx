import { useLink } from "@campus/runtime/link";
import { ReactNode } from "react";

export interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const Link = ({ href, children, className }: LinkProps) => {
  const Link = useLink();

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
