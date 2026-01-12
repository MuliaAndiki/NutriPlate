import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/classname";

interface ButtonWithIconProps extends ButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

function ButtonWrapper({
  leftIcon,
  rightIcon,
  startIcon,
  children,
  className,
  ...props
}: ButtonWithIconProps) {
  const useNewLayout = Boolean(startIcon);

  return (
    <Button
      className={cn(
        useNewLayout
          ? "flex items-center gap-2"
          : cn(leftIcon && "pl-3", rightIcon && "pr-3"),
        className
      )}
      {...props}
    >
      {startIcon && (
        <span className="inline-flex items-center">{startIcon}</span>
      )}

      {!startIcon && leftIcon && (
        <span className="inline-flex">{leftIcon}</span>
      )}

      <span className="inline-flex items-center">{children}</span>

      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </Button>
  );
}

export { ButtonWrapper };
