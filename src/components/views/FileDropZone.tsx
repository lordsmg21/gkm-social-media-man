import { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image, FileVideo, FileText } from 'lucide-react'
import { toast } from 'sonner'
interface FileDropZoneProps {
  acceptedFileTypes?: string[]

}
export function FileDropZone({
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  multiple?: boolean
  className?: string
}

export function FileDropZone({
  onFileUpload,
  const fileInputRef = useRef<
  maxFileSize = 200,
    if (fileType.s
  className = ''
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6" />
    if (fileType.startsWith('video/')) return <FileVideo className="w-6 h-6" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-6 h-6" />
    return <File className="w-6 h-6" />
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`)
      return false
  }

    // Check file type if specific types are required
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes('*/*')) {
      const isValidType = acceptedFileTypes.some(type => {
        if (type.includes('*')) {
    const fileNames = validFiles.map(f => f.n
          return file.type.startsWith(baseType)
    for (
        return file.type === type
      co

      if (!isValidType) {
        toast.error(`File type "${file.type}" is not supported.`)
        }
      }
     

    }
  }

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
  const handleDragEnter = useCallback((
    const validFiles = fileArray.filter(validateFile)

    if (validFiles.length === 0) return

    // Simulate upload progress
    if (!e.currentTarget.contains(e.relatedTarget
    setUploadingFiles(prev => [...prev, ...fileNames])

    for (const file of validFiles) {
    e.preventDefault()
      let progress = 0

        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadingFiles(prev => prev.filter(name => name !== file.name))
        }
        setUploadProgress(prev => ({
  const handleFile
          [file.name]: Math.min(progress, 100)
      handl
      }, 100)
    i

  }
    toast.success(`${validFiles.length} file(s) uploaded successfully`)
  }, [onFileUpload, maxFileSize, acceptedFileTypes])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
        

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
        

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
                {getFile

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
                    setUploadingFile
      handleFileUpload(files)
    }
    // Reset input value so same file can be selected again
                  }}
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
        </div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}

        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          glass-card rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50'}

        onClick={handleBrowseClick}

        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="text-lg font-semibold mb-2">
          {isDragOver ? 'Drop files here' : 'Drag & drop files here'}

        <p className="text-muted-foreground mb-4">


        <p className="text-sm text-muted-foreground">
          Maximum file size: {maxFileSize}MB
        </p>
        

          ref={fileInputRef}

          multiple={multiple}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploading files...</h4>

            <div key={fileName} className="glass-card p-3 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {getFileIcon('application/octet-stream')}
                <span className="flex-1 text-sm truncate">{fileName}</span>
                <Button

                  size="sm"
                  onClick={() => {
                    setUploadingFiles(prev => prev.filter(name => name !== fileName))
                    setUploadProgress(prev => {
                      const newProgress = { ...prev }
                      delete newProgress[fileName]
                      return newProgress
                    })
                  }}
                  className="h-6 w-6 p-0"
                >

                </Button>

              <Progress value={uploadProgress[fileName] || 0} className="h-2" />

          ))}

      )}

  )
