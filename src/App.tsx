import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import Home from './pages/home';
import { DockHeader } from './pages/dock-header';
import { Sage } from './pages/sage';
import AssistantPage from './pages/assistant-page';
import { CopilotPage } from './pages/copilot-page';
import { AssistantContext } from './components/assistant-provider';
import { useState } from 'react';
import { Chat, File } from './lib/type';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from './components/ui/toaster';
import { nanoid } from './lib/utils';
import { LoginPage } from './pages/login-page';
import Hackathon from './components/hackathon';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DockHeader />}>
      <Route index element={<Home />} />
      <Route path="assistant" element={<AssistantPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="copilot" element={<CopilotPage />} />
      <Route path="sage" element={<Sage />} />
      <Route path="hackathon" element={<Hackathon />} />
    </Route>
  )
)

const queryClient = new QueryClient()

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string>(nanoid());
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
      <AssistantContext.Provider value={{ selectedChatId, setSelectedChatId, selectedFileId, setSelectedFileId, chats, setChats, files, setFiles }}>
        <RouterProvider router={router}/>
        <Toaster />
      </AssistantContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
