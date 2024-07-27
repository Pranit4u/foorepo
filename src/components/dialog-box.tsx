import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input"
import { useContext, useRef, useState } from "react"
import { IconSpinner } from "./icons"
import { nanoid } from "@/lib/utils"
import { Form } from "react-router-dom"
import { toast } from "./ui/use-toast"
import { AssistantContext } from "./assistant-provider"
import { addFile } from "@/lib/actions"
import { Label } from "./ui/label"
import { PlusIcon } from "lucide-react"

export function DeleteDialogBox({ children, type, id, title, description, onConfirm }: { children: React.ReactNode, type: string, id?: string, title: string, description: string, onConfirm: () => Promise<void> }) {
  const { setChats, setFiles, setSelectedChatId, setSelectedFileId } = useContext(AssistantContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    if (type === 'Chat') {
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
      setSelectedChatId(nanoid());
    }
    else if (type === 'File') {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      setSelectedFileId('');
    }
    else if (type === 'All Chats') {
      setChats([]);
      setSelectedChatId(nanoid());
    }
    else if (type === 'All Files') {
      setFiles([]);
      setSelectedFileId('');
    }
    toast({
      title: "Success",
      description: `${type} deleted`,
    });
    setIsLoading(false);
    setIsDeleted(true);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-md">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isLoading || isDeleted} onClick={handleConfirm}>
            {isLoading ? <IconSpinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UploadDialogBox() {
  const { setFiles } = useContext(AssistantContext);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToStorage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = fileInputRef?.current?.files;
    if (!files) return;
    setIsUploading(true);
    const uploadedFiles = await Promise.all(Array.from(files).map((file) => {
      const formData = new FormData()
      formData.append('fileId', nanoid());
      formData.append('fileName', file.name);
      formData.append('file', file);
      return addFile(formData)
    }));
    if (!uploadedFiles) return;
    setIsUploading(false);
    toast({
      title: "Success",
      description: "Files uploaded successfully",
    });
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    fileInputRef.current.value = '';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">New File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={uploadToStorage}>
          <DialogHeader>
            <DialogTitle className="text-md">Upload Files</DialogTitle>
            <DialogDescription>
              <Input
                type="file"
                name="files"
                ref={fileInputRef}
                required
                multiple
                accept=".pdf" />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="mt-2" type="submit" disabled={isUploading}>{isUploading ? <IconSpinner /> : "Upload"}</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function InsertImageDialogBox({ setImages }: { setImages: React.Dispatch<React.SetStateAction<File[]>> }) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImgSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = imgInputRef?.current?.files;
    if (!files) return;
    setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    toast({
      title: "Success",
      description: "Images attached successfully",
    });
    imgInputRef.current.value = '';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
          <PlusIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={handleImgSubmit}>
          <DialogHeader>
            <DialogTitle className="text-md">Insert Image</DialogTitle>
            <DialogDescription>
              <Input
                type="file"
                name="files"
                ref={imgInputRef}
                required
                multiple
                accept=".jpg, .jpeg, .png" />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">Attach</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}