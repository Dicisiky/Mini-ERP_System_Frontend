import { ReactNode } from "react";

const PageSection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <section className={`p-4 w-full ${className}`}>{children}</section>;
};

export default PageSection;
