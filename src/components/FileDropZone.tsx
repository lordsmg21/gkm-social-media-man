import React, { useState, useCallback } from 'react'
import { Progress } from '@/components/ui/progr
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
  X, 
  Video,
  Loader

  id:
  progress:
  previe

  onFiles
  acceptedTypes?: str


  'image/jpe
  'image/png
  'image/webp',
  'application/pdf',
  'application/vnd
}

  'application/x-rar-compress
  'application/vnd.openxmlformats-officedo


  onFilesUploaded, 
  acceptedTypes = AC
 

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
   

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-purple-500" />
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-4 h-4 text-red-500" />
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="w-4 h-4 text-orange-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
   

    setUploads(prev => [...prev, ...newUploads])
    switch (status) {
      case 'uploading': return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'error': return <X className="w-3 h-3 text-red-500" />
      default: return null

  }

  const processFiles = async (files: FileList | null) => {
    if (!files) return

    const newUploads: FileUpload[] = []
    
    for (const file of Array.from(files)) {
      if (file.size > maxFileSize) continue
      )

      const upload: FileUpload = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
    setIsUploading(false)
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploads(prev => prev.map(u => 
            u.id === upload.id ? { ...u, preview: e.target?.result as string } : u
          ))
    setIs
        reader.readAsDataURL(file)
  const

      newUploads.push(upload)
    }

    if (newUploads.length === 0) return
    setIsDragOver(false)
    if (files.length > 0

    // Update status to uploading
    setUploads(prev => 
    const files = e.
        u.status === 'pending' ? { ...u, status: 'uploading' as const } : u
    }
    )

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploads(prev => 
    input.accept = acc
          u.status === 'uploading' ? { ...u, progress } : u
  }
      )
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Mark as completed
            ? 'border-p
      prev.map(u => 
        `}
      )
     

        <CardContent class
    const completedFiles = uploads
              <Upload className="w-8 h-8 text-primary" />
      .map(u => u.file)
    
    onFilesUploaded(completedFiles)
    setIsUploading(false)

    // Clear uploads after a delay
    setTimeout(() => {
              </p>
    }, 3000)
  }

            </Button>
    setUploads(prev => prev.filter(u => u.id !== id))
   

      {uploads.length > 0 && (
    e.preventDefault()
            <div classN
    setIsDragOver(true)
        

  const handleDragLeave = useCallback((e: React.DragEvent) => {

    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {

    e.stopPropagation()
    setIsDragOver(false)


    if (files.length > 0) {
      processFiles(files)
    }


  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

      processFiles(files)
    }
    // Clear input value to allow re-upload of same file



  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = acceptedTypes.join(',')
    input.onchange = handleFileInput
    input.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>

      <Card 

          glass-card file-drop-zone cursor-pointer transition-all duration-200 min-h-[200px] flex items-center justify-center

            ? 'border-primary bg-primary/5 drag-over' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }

        onDragOver={handleDragOver}

        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">














































































