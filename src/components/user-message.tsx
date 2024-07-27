import { User } from "lucide-react";

export function UserMessage({ children }: { children: React.ReactNode }) {
    return (
      <div className="group relative flex items-start md:-ml-12">
        <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
          <User />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-gray-400">
          {children}
        </div>
      </div>
    )
  }