import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-muted shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border  border-foreground bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-accent-foreground shadow-sm hover:bg-white",
        ghost: "hover:bg-accent hover:text-accent-foreground text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        tertiary:
          "bg-accent hover:bg-accent hover:shadow-md active:bg-accent/90 transition-all duration-200",
      },
      size: {
        default: "h-9  px-4 py-2",
        secondary: "h-10 w-32 px-1 py-2",

        sm: "h-8  px-3 text-xs",
        xs: "h-7  p-2 text-xs",
        lg: "h-10  px-8",
        icon: "h-9 w-9",
      },
      borderRadius: {
        default: "rounded-button",
        rounded: "rounded-full",
        medium: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        noBorder: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      borderRadius: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };