import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl bg-white p-6 shadow-card ring-1 ring-primary/10", className)}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };

