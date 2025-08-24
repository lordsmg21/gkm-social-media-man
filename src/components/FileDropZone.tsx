import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
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
}
interface FileDropZo
  maxFileSize?: number
  multiple?: boolean
}
export functio
  maxFileSize 
  multiple = t
}: FileDropZoneProps
  const [uploads, setUploads] = u

  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

    if (file.type === 
    if (file
  }
  const getStatusI
      case 'uploading':
      case 'comple
 

    }

    if (!files) return
    const newUploads: File
    for (let i = 0; 
      
 

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
      setUploads(prev => 
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-purple-500" />
      )
    }
    // Mark as completed
    return <File className="w-4 h-4 text-gray-500" />
   

    const completedFiles = newUploads.map(u =
    setIsUploading(fa
    // Clear uploads af
      setUploads([])
  }, [maxFileSize, acce
  const removeFile = (id: string) => {
  }
        return <X className="w-3 h-3 text-red-500" />
    e.stopProp
        return null
  con
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!files) return
    
    const newUploads: FileUpload[] = []
    

    const input = document.
    in
    input.onchange = (e) =>
      if (target.files) {
      }
    input.click(
      }
    <d
        className={`glass-c
        }`}
        onDragOver={handleDragOver}
        onDrop={
       
      
            </div>
            <div className="text-
        file,
              <p cla
              </p>

      
          </div>
      </Card>
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


  const removeFile = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {


    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()











    }











      }
    }





      <Card 






        onDrop={handleDrop}
      >





            



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