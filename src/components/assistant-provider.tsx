import { Chat, File } from '@/lib/type';
import { createContext } from 'react';

type AssistantProviderState = {
  selectedChatId: string;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string>>
  selectedFileId: string;
  setSelectedFileId: React.Dispatch<React.SetStateAction<string>>
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export const AssistantContext = createContext<AssistantProviderState>({} as AssistantProviderState);
