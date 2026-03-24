import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "#/lib/utils";

type Option = { value: string; label: string } | string;

function normalizeOption(opt: Option): { value: string; label: string } {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

function SimpleSelect({
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Root> & { children: ReactNode }) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

function SimpleSelectTrigger({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger className={className} {...props} />;
}

const SimpleSelectValue = SelectPrimitive.Value;
const SimpleSelectIcon = SelectPrimitive.Icon;

function SimpleSelectContent({
  options,
  className,
  align,
  ...props
}: Omit<ComponentProps<typeof SelectPrimitive.Content>, "children"> & {
  options: readonly Option[];
  align?: "start" | "center" | "end";
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        align={align}
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>
          {options.map((opt) => {
            const { value, label } = normalizeOption(opt);
            return (
              <SelectPrimitive.Item
                key={value}
                value={value}
                className="relative flex cursor-default items-center rounded-sm px-4 py-1.5 text-xs font-medium text-foreground outline-none select-none data-highlighted:bg-muted/50"
              >
                <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            );
          })}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export {
  SimpleSelect,
  SimpleSelectTrigger,
  SimpleSelectValue,
  SimpleSelectIcon,
  SimpleSelectContent,
};
