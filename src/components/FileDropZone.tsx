import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Film, 
  Archive,
  File,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

export interface FileUpload {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  preview?: string
}

interface FileDropZoneProps {
  onFilesUploaded: (files: FileUpload[]) => void
  maxFileSize?: number // in bytes, default 200MB
  acceptedTypes?: string[]
  multiple?: boolean
  className?: string
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'application/zip',
  'application/x-rar-compressed',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

export function FileDropZone({ 
  onFilesUploaded, 
  maxFileSize = MAX_FILE_SIZE,
  acceptedTypes = ACCEPTED_TYPES,
  multiple = true,
  className = ""
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />
    if (file.type.startsWith('video/')) return <Film className="w-6 h-6" />
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6" />
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="w-6 h-6" />
    return <File className="w-6 h-6" />
  }

  const getStatusIcon = (status: FileUpload['status']) => {
    switch (status) {
      case 'pending':
        return <Upload className="w-4 h-4 text-muted-foreground" />
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`
    }
    return null
  }

  const createFilePreview = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    }
    return undefined
  }

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newUploads: FileUpload[] = []

    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`)
        continue
      }

      const preview = await createFilePreview(file)
      const upload: FileUpload = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: 'pending',
        preview
      }
      newUploads.push(upload)
    }

    if (newUploads.length === 0) return

    setUploads(prev => [...prev, ...newUploads])
    await simulateUpload(newUploads)
  }

  const simulateUpload = async (uploads: FileUpload[]) => {
    setIsUploading(true)

    for (const upload of uploads) {
      // Update status to uploading
      setUploads(prev => 
        prev.map(u => u.id === upload.id ? { ...u, status: 'uploading' as const } : u)
      )

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploads(prev => 
          prev.map(u => u.id === upload.id ? { ...u, progress } : u)
        )
      }

      // Mark as completed
      setUploads(prev => 
        prev.map(u => u.id === upload.id ? { ...u, status: 'completed' as const, progress: 100 } : u)
      )
    }

    setIsUploading(false)
    
    // Call callback with completed uploads
    const completedUploads = uploads.map(upload => ({
      ...upload,
      status: 'completed' as const,
      progress: 100
    }))
    
    onFilesUploaded(completedUploads)
    
    // Clear uploads after a delay
    setTimeout(() => {
      setUploads([])
    }, 2000)
    
    toast.success(`${uploads.length} file${uploads.length !== 1 ? 's' : ''} uploaded successfully`)
  }

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Clear input value to allow re-uploading the same file
    e.target.value = ''
  }

  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = acceptedTypes.join(',')
    input.onchange = (e) => handleFileInput(e as any)
    input.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card 
        className={`relative overflow-hidden transition-all duration-200 cursor-pointer border-2 border-dashed
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/20'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {isDragOver ? 'Drop files here' : 'Upload Files'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">
                  Max {formatFileSize(maxFileSize)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PDF, Images, Videos, Documents
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm">
                Uploading {uploads.length} file{uploads.length !== 1 ? 's' : ''}
              </h4>
              {!isUploading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setUploads([])}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(upload.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(upload.status)}
                        {upload.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUpload(upload.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(upload.file.size)}</span>
                      <span>{upload.progress}%</span>
                    </div>
                    
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-1 mt-2" />
                    )}
                  </div>
                  
                  {upload.preview && (
                    <div className="flex-shrink-0">
                      <img 
                        src={upload.preview} 
                        alt={upload.file.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}