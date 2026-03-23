import * as React from "react"
import { cn } from "../../utils/cn"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500 dark:text-slate-400 uppercase tracking-wide",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
