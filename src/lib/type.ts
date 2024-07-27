export interface Message {
  id: string,
  content: string,
  role: string,
  chatId: string,
}

export interface Chat {
  id: string,
  title: string,
  type: string,
}

export interface File {
  id: string,
  name: string,
  format: string,
  url: string,
  synchronized: boolean,
}

export interface Embedding {
  id: string,
  fileId: string,
  fileName: string,
  embedding: Float32Array[],
  text: string,
  page: number,
}

export interface EmbeddingResponse {
  text: string,
  embedding: Float32Array[],
  metadata: {
    source: string,
    page: number
  }
}