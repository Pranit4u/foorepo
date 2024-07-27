import { useContext, useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Chat, Message } from "@/lib/type"
import { nanoid } from "@/lib/utils"
import { AssistantContext } from "./assistant-provider"
import axios from "axios"
import { GET_RESPONSE_ENDPOINT } from "@/lib/constants"
import { addChatToDb, addMessageToDb } from "@/lib/actions"
import { InsertImageDialogBox } from "./dialog-box"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { IconClose } from "./icons"

const PromptForm = ({ localMessages, setLocalMessages }: { localMessages: Message[], setLocalMessages: React.Dispatch<React.SetStateAction<Message[]>> }) => {
  const { chats, selectedChatId, setChats }: { chats: Chat[], selectedChatId: string, setChats: React.Dispatch<React.SetStateAction<Chat[]>> } = useContext(AssistantContext);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const getBase64 = async (img: File) => {
    return new Promise(resolve => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        baseURL = reader.result as string;
        baseURL = baseURL.split(",")[1];
        resolve(baseURL);
      };
    });
  };

  const handleSend = async () => {
    const prompt = inputText;
    setInputText("");
    if (prompt.trim() === "") return;
    setLoading(true);
    const initialMessages = localMessages;
    setLocalMessages([...initialMessages, { role: "user", content: prompt, id: nanoid(), chatId: selectedChatId }, { role: "loading", content: "Loading...", id: nanoid(), chatId: selectedChatId }]);

    const aiResponse = await axios.post(GET_RESPONSE_ENDPOINT, {
      messages: [
        ...localMessages.map((message) => ({ role: message.role, content: message.content })),
        { role: "user", content: prompt }
      ],
      images_base64: await Promise.all(images.map(async (image) => getBase64(image)))
    });

    setLocalMessages([...initialMessages, { role: "user", content: prompt, id: nanoid(), chatId: selectedChatId }, { role: "assistant", content: aiResponse.data, id: nanoid(), chatId: selectedChatId }]);

    if (!chats.find((chat) => chat.id === selectedChatId)) {
      setChats(prev => [...prev, { id: selectedChatId, title: prompt.length < 15 ? prompt : prompt.slice(0, 15) + '...', type: "private" }]);
      await addChatToDb({
        id: selectedChatId,
        title: prompt,
        type: "private"
      })
    }
    await addMessageToDb({
      id: nanoid(),
      chatId: selectedChatId,
      role: "user",
      content: prompt
    })
    await addMessageToDb({
      id: nanoid(),
      chatId: selectedChatId,
      role: "assistant",
      content: aiResponse.data
    })
    setLoading(false);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="grid gap-2 w-2/3 pl-12">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="p-4 resize-none shadow-none focus-visible:ring-0"
        placeholder="Enter your prompt here..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 items-center">
        <InsertImageDialogBox setImages={setImages} />
        <DropdownMenu>
          <DropdownMenuTrigger className="text-xs font-normal">{`${images.length} Images Attached`}</DropdownMenuTrigger>
          {images.length > 0 && <DropdownMenuContent>
            <DropdownMenuLabel>Images</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {images.map((image, index) => (
              <DropdownMenuItem className="flex gap-4 justify-between max-w-80" key={index}>
                <div className="truncate flex-1">
                {image.name}
                </div>
                <IconClose onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}/>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>}
        </DropdownMenu>
        <Button
          onClick={handleSend}
          size="sm"
          className="ml-auto"
          disabled={loading}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default PromptForm