import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
  X, 
  Image, 
  Archive
  CheckCir
  Loa

  id: str
  progre
  preview?

  onFilesUploa
  acceptedType
  classNa


  'image/png',
  'image/web
  'applicati
  'application/vnd
  'video/mp4',
  'video/x-msvideo
 



  onFilesUploaded, 
  acceptedTypes = ACCEPTED
  className = ""
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
        continue

      const upload: FileUpload = {

        status: 'pending',
      }
    }
    if (newUploads.length === 0) return
    setUploads(prev => [...prev, ...newUploads])
  }
  c

      // Update status to uploading
        prev.map(u =>

      for (let progress = 0; progress <= 100; progress += 10) {
        setUploads(prev
        )

      setUploads(prev => 
      )

    
    const completed
     
   

    // Clear uploads after a delay
      setUploads([])
    
  }
  const removeUpload = (id: string) => {
  }
  c

  }, [])
  const handleDragLeave = useCallback((e: Rea
    e.stopPropagation()
  }, 
  const handleDrop = useCallback((
    e.stopPropagation()

    if (files.l
   

    const files = e.target.files
      processFiles(files)
    // Clear input value to allow re-up
  }
  const handleClick = () => {
    input.type = 'file'
    inpu
    i

   

          ${isDragOver 
            : 'border-muted-foreground/
        onDragOver={handleDragOver}

      >
          <div className="flex flex-col items-ce
              <Upload classN
            
              <h
       

              <div className="flex flex-wrap gap-2 
                  Max {formatFileS
                <Badge variant="outline" clas
             
            </div>
            <Button varian
              C
       
      </Card>
     

            <div className="flex items-

              {!isUploading && (
                  variant="ghost" 
   

                </Button>
            </div>

                <div key={upload.id
                    {getFileIcon(up
                  
                    <div className="flex items-center justify-between mb-1">
       

                            varia
                            onClick={() => removeUpload(upload.
                          >
                          <
                      </div>
         
       

                    {uploa
                    )}
                  
       
     

                    </div
    
            </div>
        </Card>
    </div>
}















































































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