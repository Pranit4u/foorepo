import { ChatArea } from "@/components/chat-area"
import { Sidebar } from "@/components/sidebar"
import { Separator } from "@/components/ui/separator"

export default function AssistantPage() {

  return (
    <div className="h-full">
      <div className="flex border h-full w-full">
        <Sidebar />
        <Separator orientation="vertical" />
        <ChatArea />
      </div>
    </div>
  )
}