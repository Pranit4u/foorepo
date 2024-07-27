import axios from 'axios'
import { ADD_CHAT_ENDPOINT, ADD_EMBEDDING_ENDPOINT, ADD_FILE_ENDPOINT, ADD_MESSAGE_ENDPOINT, ADD_USER_ENDPOINT, DELETE_ALL_CHATS_ENDPOINT, DELETE_ALL_EMBEDDINGS_ENDPOINT, DELETE_ALL_FILES_ENDPOINT, DELETE_CHAT_ENDPOINT, DELETE_EMBEDDING_ENDPOINT, DELETE_FILE_ENDPOINT, GET_CHATS_ENDPOINT, GET_EMBEDDINGS_ENDPOINT, GET_FILE_ENDPOINT, GET_FILES_ENDPOINT, GET_MESSAGES_ENDPOINT, GET_REFACTOR_TEXT_ENDPOINT, GET_SUGGESTED_TEXT_ENDPOINT, GET_USER_ENDPOINT, UPDATE_FILE_ENDPOINT } from '@/lib/constants'
import { Chat, Embedding, EmbeddingResponse, File, Message } from './type'

/** Embedding Actions */
export async function addEmbeddingToDb(embedding: Embedding) {
  try {
    const { data } = await axios.post(ADD_EMBEDDING_ENDPOINT, embedding)
    return data
  } catch (error) {
    return
  }
}

export async function fetchEmbeddings(fileUrl: string): Promise<EmbeddingResponse[]> {
  const embeddingResponse = await axios.post(GET_EMBEDDINGS_ENDPOINT, {
    fileUrl
  });
  return embeddingResponse.data
}

/** Chat Actions */
export async function addChatToDb(chat: Chat) {
  try {
    const { data } = await axios.post(ADD_CHAT_ENDPOINT, chat)
    return data
  } catch (error) {
    return
  }
}

export const fetchChats = async () => {
  const chatsResponse = await axios.get(GET_CHATS_ENDPOINT);
  return chatsResponse.data;
}

export async function deleteChat(chatId: string, type: string) {
  const deleteResponse = await axios.get(DELETE_CHAT_ENDPOINT, {
    params: {
      chatId,
      type
    }
  });
  return deleteResponse.data;
}

export async function clearChats() {

  try {
    await axios.get(DELETE_ALL_CHATS_ENDPOINT)
  } catch (error) {
    return
  }
}


/** Message Actions */
export async function addMessageToDb(message: Message) {
  try {
    const { data } = await axios.post(ADD_MESSAGE_ENDPOINT, message)
    return data
  } catch (error) {
    return
  }
}

export async function getMessagesFromDb(chatId: string): Promise<Message[]> {
  try {
    const { data } = await axios.get(GET_MESSAGES_ENDPOINT, {
      params: {
        chatId
      }
    })
    return data as unknown as Message[]
  } catch (error) {
    return []
  }
}


/** File Actions */
export async function addFile(formData: FormData) {
  const fileResponse = await axios.post(ADD_FILE_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return fileResponse.data
}

export async function updateFileToDb(file: File) {
  try {
    const { data } = await axios.post(UPDATE_FILE_ENDPOINT, file)
    return data
  } catch (error) {
    return
  }
}

export async function getFileFromDb(fileId: string): Promise<File | null> {

  try {
    const { data } = await axios.get(GET_FILE_ENDPOINT, {
      params: {
        fileId
      }
    })
    return data as File
  } catch (error) {
    return null as unknown as File
  }
}

export const fetchFiles = async () => {
  const filesResponse = await axios.get(GET_FILES_ENDPOINT);
  return filesResponse.data;
}

export async function removeFileFromDb(fileId: string) {

  try {
    await axios.get(DELETE_FILE_ENDPOINT, {
      params: {
        fileId
      }
    })
    await axios.get(DELETE_EMBEDDING_ENDPOINT, {
      params: {
        fileId
      }
    })
  } catch (error) {
    return
  }
}

export async function clearFilesFromDb() {

  try {
    await axios.get(DELETE_ALL_FILES_ENDPOINT)
    await axios.get(DELETE_ALL_EMBEDDINGS_ENDPOINT)
  } catch (error) {
    return
  }

}

export const fetchSuggestion = async (text: string, context: string) => {
  const suggestionResponse = await axios.post(GET_SUGGESTED_TEXT_ENDPOINT, {
    text,
    context
  });
  return suggestionResponse.data;
}

export const getRefactoredText = async (text: string, instruction: string) => {
  const refactoredTextResponse = await axios.post(GET_REFACTOR_TEXT_ENDPOINT, {
    text,
    instruction
  });
  return refactoredTextResponse.data;
}