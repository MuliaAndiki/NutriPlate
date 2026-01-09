import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/utils/classname";

interface ButtonWithIconProps extends ButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function ButtonWrapper({
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonWithIconProps) {
  return (
    <Button
      className={cn(leftIcon && "pl-3", rightIcon && "pr-3", className)}
      {...props}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </Button>
  );
}

export { ButtonWrapper };
