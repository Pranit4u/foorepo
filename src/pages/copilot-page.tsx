import { TooltipProvider } from "@/components/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FileTree } from "@/components/file-tree"
import { IdeWithAutocomplete } from "@/components/code-editor"
import Terminal from "@/components/docker"

export function CopilotPage() {
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={15}>
          <FileTree />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <IdeWithAutocomplete />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <Terminal />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}