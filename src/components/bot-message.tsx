import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

export function BotMessage({
    content,
    className
  }: {
    content: string
    className?: string
  }) {
    const text = content
  
    return (
      <div className={cn('group relative flex items-start md:-ml-12', className)}>
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
          <Bot />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 text-gray-400">
            {text}
        </div>
      </div>
    )
  }