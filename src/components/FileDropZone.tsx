import React, { useState, useCallback } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Image, 
  Upload, 
  FileText, 
  Video,
  Archive,
  Loader2,
  CheckCircle
} from 'lucide-react'

interface FileUpload {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  preview?: string
}

interface FileDropZoneProps {
  onFilesUploaded: (files: File[]) => void
  maxFileSize?: number
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUploadFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-purple-500" />
    return <File className="w-4 h-4 text-gray-500" />

    return <File className="w-4 h-4 text-gray-500" />
   

        return <X className="w-3 h-3 text-red-500" />
        return null
  }

    if (!files) return
    const newUploads: FileUpload[] = []
    for (const file 
      if (!acceptedTypes.includes(file.type)) continu
      const up
        file,
     
  }   }
  }
/ Create preview for images
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
  }

  const removeFile = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
      processFiles(files)
    }
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    }
    // Clear input value to allow re-upload of same file
    if (e.target) {
    }

    const input = documen
     
      input.accept = acceptedTypes.join(',')
        const targe
          processFiles(ta
     
          target.value = ''
        }
      }
    }

    <div className={`spac
      <Card 
          glass-card file-drop-zone cursor-p
            ? 'border-primary b
          }
        onDragOver={handleDr
        onDrop={handleDrop}
      >
          <div className="flex flex-col items-center justify
              <Upload
            
         
       
                Max
     
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