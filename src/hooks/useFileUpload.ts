import { useKV } from '@github/spark/hooks'
import type { FileUpload } from '@/types'

export function useFileUpload() {
  const [files, setFiles] = useKV<FileUpload[]>('uploaded-files', [])

  const uploadFile = async (file: File, targetUsers: string[] | 'all', category: 'general' | 'invoice' | 'project' = 'general', uploadedBy: string) => {
    // Simulate file upload (in real app, would upload to server)
    const fileUrl = URL.createObjectURL(file)
    
    const newFile: FileUpload = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
      targetUsers,
      category
    }

    setFiles(currentFiles => [...currentFiles, newFile])
    return newFile
  }

  const deleteFile = (fileId: string) => {
    setFiles(currentFiles => currentFiles.filter(file => file.id !== fileId))
  }

  const getFilesByUser = (userId: string, userRole: 'admin' | 'client') => {
    return files.filter(file => {
      if (userRole === 'admin') return true
      return file.targetUsers === 'all' || 
             (Array.isArray(file.targetUsers) && file.targetUsers.includes(userId))
    })
  }

  const getFilesByCategory = (category: 'general' | 'invoice' | 'project') => {
    return files.filter(file => file.category === category)
  }

  return {
    files,
    uploadFile,
    deleteFile,
    getFilesByUser,
    getFilesByCategory
  }
}