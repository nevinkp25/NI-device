
"use client";

import * as React from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup.Root
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-1 rounded-lg bg-muted p-1",
        className
      )}
      {...props}
    />
  );
});
SegmentedControl.displayName = "SegmentedControl";

const SegmentedControlItem = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </RadixRadioGroup.Item>
  );
});
SegmentedControlItem.displayName = "SegmentedControlItem";

export { SegmentedControl, SegmentedControlItem };
