import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-manrope rounded-xl transition-all " +
    "disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-[#D4755B]/40 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[#D4755B] hover:bg-[#C05621] text-white font-bold shadow-lg hover:shadow-xl",
        secondary:
          "bg-white border border-[#E6E0DA] hover:border-[#D4755B] text-[#64748B] hover:text-[#D4755B] font-semibold",
        ghost:
          "text-[#D4755B] hover:text-[#C05621] hover:underline font-semibold",
      },
      size: {
        sm: "text-sm py-2.5 px-4",
        md: "text-base py-3.5 px-6",
        lg: "text-lg py-4 px-8",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

const ButtonSpinner: React.FC = () => (
  <span
    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    aria-hidden="true"
  />
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading && <ButtonSpinner />}
          {children}
        </>
      )}
    </Comp>
  );
}

export default Button;
