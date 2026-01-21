import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.ComponentProps<"select"> & {
  onValueChange?: (value: string) => void;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onChange, onValueChange, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "border-input bg-background text-foreground h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      }}
      {...props}
    />
  ),
);
Select.displayName = "Select";

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.ComponentPropsWithoutRef<"option">
>(({ className, ...props }, ref) => (
  <option ref={ref} className={cn(className)} {...props} />
));
SelectItem.displayName = "SelectItem";

export { Select, SelectItem };
