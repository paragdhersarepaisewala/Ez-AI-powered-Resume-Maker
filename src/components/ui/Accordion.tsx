import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/cn"

export const Accordion = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("space-y-3", className)}>{children}</div>
}

export const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle,
  defaultOpen = false,
  className,
  headerAction
}: {
  title: React.ReactNode
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  defaultOpen?: boolean
  className?: string
  headerAction?: React.ReactNode
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  
  const isExpanded = isOpen !== undefined ? isOpen : internalOpen
  
  const handleToggle = () => {
    if (onToggle) onToggle()
    else setInternalOpen(!internalOpen)
  }

  return (
    <motion.div 
      initial={false}
      animate={{ 
        backgroundColor: isExpanded ? "var(--color-card)" : "var(--color-background)",
        borderColor: isExpanded ? "var(--color-border)" : "transparent"
      }}
      className={cn(
        "rounded-2xl border border-transparent overflow-hidden transition-colors shadow-sm",
        className
      )}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer select-none group"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0 font-bold text-foreground truncate mr-4">
          {title}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerAction && (
            <div onClick={e => e.stopPropagation()}>{headerAction}</div>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="p-4 pt-0 border-t border-border/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
