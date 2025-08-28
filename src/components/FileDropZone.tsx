import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  X, 
  Image, 
  FileText, 
  Video,
  Loader2,
  CheckCircle,
  File
} from 'lucide-react'

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

interface FileUpload {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface FileDropZoneProps {
  onFilesUploaded: (files: File[]) => void
  acceptedTypes?: string[]
  maxFileSize?: number
  multiple?: boolean
  className?: string
}

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUploadFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />
    if (file.type.includes('pdf') || file.type.includes('text') || file.type.includes('document')) return <FileText className="w-4 h-4 text-green-500" />
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-purple-500" />
    return <File className="w-4 h-4 text-gray-500" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'error':
        return <X className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files) return
    
    const newUploads: FileUpload[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size
      if (file.size > maxFileSize) {
        console.warn(`File ${file.name} exceeds maximum size`)
        continue
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        console.warn(`File ${file.name} type not accepted`)
        continue
      }

      const upload: FileUpload = {
        id: `upload-${Date.now()}-${i}`,
        file,
        progress: 0,
        status: 'uploading'
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploads(prev => prev.map(u => 
            u.id === upload.id ? { ...u, preview: e.target?.result as string } : u
          ))
        }
        reader.readAsDataURL(file)
      }

      newUploads.push(upload)
    }

    setUploads(prev => [...prev, ...newUploads])
    setIsUploading(true)

    // Start uploading
    setUploads(prev => 
      prev.map(u => 
        newUploads.some(nu => nu.id === u.id) ? { ...u, status: 'uploading' as const } : u
      )
    )

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploads(prev => 
        prev.map(u => 
          u.status === 'uploading' ? { ...u, progress } : u
        )
      )
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Mark as completed
    setUploads(prev => 
      prev.map(u => 
        u.status === 'uploading' ? { ...u, status: 'completed' as const } : u
      )
    )
    
    // Return completed files to parent
    const completedFiles = newUploads.map(u => u.file)
    onFilesUploaded(completedFiles)
    setIsUploading(false)

    // Clear uploads after a delay
    setTimeout(() => {
      setUploads([])
    }, 3000)
  }, [maxFileSize, acceptedTypes, onFilesUploaded])

  const removeFile = (id: string) => {
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
    processFiles(files)
  }, [processFiles])

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = acceptedTypes.join(',')
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        processFiles(target.files)
      }
    }
    input.click()
  }, [processFiles, multiple, acceptedTypes])

  return (
    <div className={`space-y-4 ${className}`}>
      <Card 
        className={`glass-card file-drop-zone cursor-pointer transition-all ${
          isDragOver ? 'drag-over border-primary bg-primary/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Support for images, documents, and videos up to {formatFileSize(maxFileSize)}
              </p>
            </div>

            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            File Uploads ({uploads.length})
          </h4>
          
          {uploads.map((upload) => (
            <Card key={upload.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {upload.preview ? (
                    <img 
                      src={upload.preview} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="p-2 rounded bg-muted/50">
                      {getUploadFileIcon(upload.file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {upload.file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(upload.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(upload.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(upload.file.size)}
                      </span>
                      {upload.status === 'uploading' && (
                        <span className="text-xs text-muted-foreground">
                          {upload.progress}%
                        </span>
                      )}
                    </div>
                    
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-1" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}