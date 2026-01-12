import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/classname";

interface InputWithIconProps extends React.ComponentProps<typeof Input> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function InputWrapper({
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          {leftIcon}
        </span>
      )}

      <Input
        className={cn(leftIcon && "pl-10", rightIcon && "pr-10", className)}
        {...props}
      />

      {rightIcon && (
        <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          {rightIcon}
        </span>
      )}
    </div>
  );
}

export { InputWrapper };
