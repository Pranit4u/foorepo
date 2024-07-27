import { Button } from "@/components/ui/button"
import { Separator } from "./ui/separator"
import { useQuery } from "react-query"
import { IconCheck, IconRefresh, IconSpinner, IconTrash } from "./icons"
import { Chat, File } from "@/lib/type"
import { useContext, useEffect, useState } from "react"
import { addEmbeddingToDb, clearChats, clearFilesFromDb, deleteChat, fetchChats, fetchEmbeddings, fetchFiles, removeFileFromDb, updateFileToDb } from "@/lib/actions"
import { nanoid } from "@/lib/utils"
import { AssistantContext } from "./assistant-provider"
import { DeleteDialogBox, UploadDialogBox } from "./dialog-box"
import { toast } from "./ui/use-toast"

export function Sidebar() {

	const { data: chats, isLoading: isChatsLoading, isError: chatsError } = useQuery<Chat[]>('chats', fetchChats);
	const { data: files, isLoading: isfilesLoading, isError: filesError } = useQuery<File[]>('files', fetchFiles);

	const { chats: localChats, setChats: setLocalChats, files: localFiles, setFiles: setLocalFiles, selectedChatId, selectedFileId, setSelectedChatId, setSelectedFileId } = useContext(AssistantContext);

	const [allDocsSynced, setAllDocsSynced] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);

	useEffect(() => {
		if (chatsError) {
			toast({
				title: "Error fetching chats",
				description: chatsError,
			});
			setLocalChats([]);
		}
		else if (chats) {
			setLocalChats(chats);
		}
		if (filesError) {
			toast({
				title: "Error fetching files",
				description: filesError,
			});
			setLocalFiles([]);
		}
		else if (files) {
			setLocalFiles(files);
		}
	}, [files, filesError, chats, chatsError]);

	useEffect(() => {
		setAllDocsSynced(localFiles.every(file => file.synchronized));
	}, [localFiles]);

	const syncFiles = async () => {
		if (!files) return;
		const filesToSync = files.filter(file => !file.synchronized);
		if (filesToSync.length === 0) return;
		setIsSyncing(true)
		const filesEmbeddingsPromises = filesToSync.map(file => fetchEmbeddings(file.url));
		const filesEmbeddings = await Promise.all(filesEmbeddingsPromises);
		const embeddingPromises = filesEmbeddings.map((fileEmbedding, index) => {
			return fileEmbedding.map(embedding => {
				return addEmbeddingToDb({
					id: nanoid(),
					fileId: files[index].id,
					fileName: files[index].name,
					embedding: embedding.embedding,
					text: embedding.text,
					page: embedding.metadata.page
				});
			});
		});
		await Promise.all(embeddingPromises);
		const filesUpdatePromises = files.map(file => updateFileToDb({
			...file,
			synchronized: true
		}));
		await Promise.all(filesUpdatePromises);
		setIsSyncing(false);
		setAllDocsSynced(true);
		toast({
			title: "Success",
			description: "Files synced successfully",
		});
	}

	const handleSyncFiles = () => {
		try {
			syncFiles();
		}
		catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			toast({
				title: "Error syncing files",
				description: errorMessage,
			});
		}
	}

	const selectChat = (chatId: string) => {
		setSelectedChatId(chatId);
		setSelectedFileId('');
	}

	const selectFile = (fileId: string) => {
		setSelectedFileId(fileId);
		setSelectedChatId('');
	}

	const deleteChatDialogBox = (chat: Chat) => (
		<DeleteDialogBox 
			children={<IconTrash className="m-1" />}
			type="Chat"
			id={chat.id}
			title={`Remove ${chat.title}`}
			description="Are you sure you want to remove this chat?"
			onConfirm={async() => await deleteChat(chat.id, chat.type)}
		/>
	)

	const deleteAllChatsDialogBox = () => (
		<DeleteDialogBox 
			children={<Button variant="link" className="h-min w-min self-end">Clear</Button>}
			type="All Chats"
			title="Remove All Chats"
			description="Are you sure you want to remove all chats?"
			onConfirm={async() => await clearChats()}
		/>
	)

	const deleteFileDialogBox = (file: File) => (
		<DeleteDialogBox 
			children={<IconTrash className="m-1" />}
			type="File"
			id={file.id}
			title={`Remove ${file.name}`}
			description="Are you sure you want to remove this file?"
			onConfirm={() => removeFileFromDb(file.id)}
		/>
	)

	const deleteAllFilesDialogBox = () => (
		<DeleteDialogBox 
			children={<Button variant="link" className="h-min w-min self-end">Clear</Button>}
			type="All Files"
			title="Remove All Files"
			description="Are you sure you want to remove all files?"
			onConfirm={async() => await clearFilesFromDb()}
		/>
	)

	return (
		<div className="h-full w-1/5">
			<div className="px-3 pt-2 h-1/2 flex flex-col">
				<h2 className="px-4 text-lg pb-2 font-semibold tracking-tight">
					Chats
				</h2>
				<div className="flex-1 flex flex-col gap-2 overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
					<Button variant="default" className="w-full flex" onClick={() => selectChat(nanoid())}>New Chat</Button>
					{isChatsLoading && <IconSpinner />}
					{localChats && localChats.map((chat) => (
						<Button key={chat.id} variant={selectedChatId === chat.id ? "secondary" : "ghost"} className="w-full flex" onClick={() => selectChat(chat.id)}>
							<div className="truncate flex-1 text-left">{chat.title}</div>
							{selectedChatId === chat.id && deleteChatDialogBox(chat)}
						</Button>
					))}
				</div>
				{localChats.length > 0 && deleteAllChatsDialogBox()}
			</div>
			<Separator />
			<div className="px-3 pt-2 h-1/2 flex flex-col">
				<div className="flex items-center justify-between pb-2">
					<h2 className="px-4 text-lg font-semibold tracking-tight">
						Files
					</h2>
					{allDocsSynced ? <IconCheck /> : isSyncing ? <IconSpinner /> : <IconRefresh onClick={handleSyncFiles} />}
				</div>
				<div className="flex-1 flex flex-col gap-2 overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
					<UploadDialogBox />
					{isfilesLoading && <IconSpinner />}
					{localFiles && localFiles.map((file) => (
						<Button variant={selectedFileId === file.id ? "secondary" : "ghost"} className="w-full flex" onClick={() => selectFile(file.id)}>
							<div className="truncate flex-1 text-left">{file.name}</div>
							{selectedFileId === file.id && deleteFileDialogBox(file)}
						</Button>
					))}
				</div>
				{localFiles.length > 0 && deleteAllFilesDialogBox()}
			</div>
		</div>
	)
}