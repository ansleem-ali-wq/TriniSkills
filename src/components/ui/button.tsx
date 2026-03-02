import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow": variant === "default",
            "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:shadow": variant === "secondary",
            "border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 shadow-sm": variant === "outline",
            "hover:bg-zinc-100 hover:text-zinc-900": variant === "ghost",
            "text-indigo-600 underline-offset-4 hover:underline": variant === "link",
            "h-11 px-5 py-2": size === "default",
            "h-9 rounded-lg px-4": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
