import { useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  className?: string
  multiple?: boolean
}

export function FileDropZone({
  onFilesSelected,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.doc', '.docx'],
  maxFileSize = 200,
  className = '',
  multiple = true
}: FileDropZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = []
    
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds maximum size of ${maxFileSize}MB`)
        return
      }

      // Check file type if specified
      if (acceptedFileTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!acceptedFileTypes.includes(fileExtension)) {
          console.warn(`File ${file.name} type not accepted`)
          return
        }
      }

      validFiles.push(file)
    })

    return validFiles
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const validFiles = validateFiles(files)
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    }
  }, [onFilesSelected, acceptedFileTypes, maxFileSize])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const validFiles = validateFiles(files)
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    }
    // Reset input
    e.target.value = ''
  }, [onFilesSelected, acceptedFileTypes, maxFileSize])

  return (
    <div
      className={`file-drop-zone border-2 border-dashed border-border rounded-lg p-8 text-center transition-all hover:border-primary/50 ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">Drop files here or click to select</p>
          <p className="text-sm text-muted-foreground">
            Maximum file size: {maxFileSize}MB
          </p>
          {acceptedFileTypes.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Accepted types: {acceptedFileTypes.join(', ')}
            </p>
          )}
        </div>

        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept={acceptedFileTypes.join(',')}
              multiple={multiple}
            />
            Select Files
          </label>
        </Button>
      </div>
    </div>
  )
}