import {
  Copy,
} from "lucide-react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Editor from 'react-simple-code-editor';
import { useQuery } from "react-query"
import { fetchSuggestion, getRefactoredText } from "@/lib/actions"
import { IconSpinner } from "@/components/icons"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { toast } from "@/components/ui/use-toast"

export function Sage() {
	const { data: suggestion, isError: suggestionError, refetch: refetchSuggestion } = useQuery('chats', () => fetchSuggestion(userTypedText, brief), {
    enabled: false
  });

  const [userTypedText, setUserTypedText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [brief, setBrief] = useState("");
  const [instruction, setInstruction] = useState('');
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);

  const { isCopied, copyToClipboard } = useCopyToClipboard({});

  useEffect(() => {
    if (suggestion) {
      setSuggestedText(suggestion);
    }
  }, [suggestion]);


  useEffect(() => {
    if (isCopied) {
      toast({
        title: "Copied!",
        duration: 500,
      })
    }
  }, [isCopied]);

  const handleEditorText = () => {
    return (
      <>
        <span>{userTypedText}</span>
        <span className="text-gray-300">{suggestedText}</span>
      </>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === '.' && userTypedText.length > 0 && brief.length > 0 && !isSuggestionLoading) {
      event.preventDefault();
      setSuggestionLoading(true);
      refetchSuggestion().then(() => setSuggestionLoading(false));
      return;
    }
    
    if (event.key !== 'Tab' || suggestedText.length === 0) return;
    event.preventDefault();
    setUserTypedText((prevUserTypedText) => prevUserTypedText + suggestedText);
    setSuggestedText("");
  }

  const handleRefactor = async () => {
    if (userTypedText.length === 0 || isSuggestionLoading || instruction.length === 0) return;
    setSuggestionLoading(true);
    const refactoredText = await getRefactoredText(userTypedText, instruction);
    if (typeof refactoredText === 'string') {
      setUserTypedText(refactoredText);
    } else {
      const textAsString = typeof refactoredText === 'object' 
      ? JSON.stringify(refactoredText) 
      : String(refactoredText);
      setUserTypedText(textAsString);
    }
    setSuggestionLoading(false);
  }

  return (
    <div className="h-full">
      <TooltipProvider>
        <main className="grid text-center gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 h-full border overflow-auto">
          <div
            className="flex-col flex flex-col gap-12 md:flex" x-chunk="dashboard-03-chunk-0"
          >
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Auto Complete
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="content">Brief</Label>
                <Textarea
                  id="content"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Give a context to get suggestions..."
                  className="min-h-[9.5rem] resize-none shadow-none focus-visible:ring-0"
                />
              </div>
            </fieldset>
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Refactor
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="content">Instruction</Label>
                <Textarea
                  id="content"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Give instructions about the change you want to make..."
                  className="min-h-[9.5rem] resize-none shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant={"secondary"} onClick={handleRefactor} >Refactor</Button>
              </div>
            </fieldset>
          </div>
          <fieldset className="relative grid gap-6 rounded-lg border p-4 lg:col-span-2">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Scratch Pad
            </legend>
            {isSuggestionLoading ? <IconSpinner className="size-5 absolute top-4 right-4" /> : <Copy onClick={() => copyToClipboard(userTypedText)} className="size-5 absolute top-4 right-4 cursor-pointer z-10" />}
            <Editor
              value={userTypedText}
              onValueChange={text => {
                if (text.trim() !== userTypedText.trim()) {
                  setSuggestedText('');
                }
                setUserTypedText(text);
              }}
              highlight={handleEditorText}
              padding={10}
              className=""
              onKeyDown={handleKeyDown}
              placeholder="Start typing here... Press [cmd + .] to get a suggestion."
            />
          </fieldset>
        </main>
      </TooltipProvider>
    </div>
  )
}