import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query";
import axios from "axios";

import { cn } from "@/lib/utils"
import PromptForm from "./prompt-form"
import { IconOpenAI, IconSpinner, IconUser } from "./icons"
import { AssistantContext } from "./assistant-provider";
import { GET_MESSAGES_ENDPOINT } from "@/lib/constants";
import { File, Message } from "@/lib/type";
import { toast } from "./ui/use-toast";

export function ChatArea() {
	const { files, selectedChatId, selectedFileId } = useContext(AssistantContext);
	const [localMessages, setLocalMessages] = useState<Message[]>([]);
	const [file, setFile] = useState<File | null>(null);

	const fetchMessages = async (chatId: string) => {
		const messageResponse = await axios.get(GET_MESSAGES_ENDPOINT, {
			params: {
				chatId
			}
		});
		return messageResponse.data;
	}
	const { data: messages, isLoading: isMessagesLoading, isError: messagesError, refetch: messagesRefetch } = useQuery<Message[]>('messages', () => fetchMessages(selectedChatId));

	useEffect(() => {
		if (messages) {
			setLocalMessages(messages);
		}
		if (messagesError) {
			setLocalMessages([]);
			toast({
				title: "Error",
				description: "Error fetching messages",
			})
		}
	}, [messages, messagesError]);

	useEffect(() => {
		messagesRefetch();
	}, [selectedChatId]);

	useEffect(() => {
		if (selectedFileId) {
			setFile(files.find((file) => file.id === selectedFileId) ?? null);
		}
	}, [selectedFileId]);


	return (
		<div className="flex flex-col w-4/5 items-center py-2">
			{selectedFileId ?
				<div className="size-full">
					<embed
						style={{ width: '100%', height: '100%' }}
						src={file?.url}
						type="application/pdf"
					/>
				</div> :
				<><div className="flex-1 overflow-y-auto w-2/3 pl-12 py-4" style={{ scrollbarWidth: "none" }}>
					{isMessagesLoading ? <IconSpinner /> : localMessages.map((message, index) => (
						<div className="relative flex items-center mb-4">
							{message.role === "user" ? <IconUser className="absolute -left-8" /> : <IconOpenAI className="absolute -left-8" />}
							{message.role === "loading" ?
								<div className="flex justify-center items-center space-x-1 py-2">
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-dot-keyframes"></div>
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-dot-keyframes delay-200"></div>
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-dot-keyframes delay-500"></div>
								</div> :
								<div
									key={index}
									className={cn(
										"flex w-max flex-col gap-2 rounded-lg px-3 py-2 text-sm",
										message.role === "user"
											? "bg-muted"
											: "bg-primary text-primary-foreground"
									)}
								>
									{message.content}
								</div>
							}
						</div>
					))}
				</div>
					<PromptForm localMessages={localMessages} setLocalMessages={setLocalMessages} />
				</>
			}
		</div>
	)
}