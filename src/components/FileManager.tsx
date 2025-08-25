import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  Search, 
  Filter,
  FolderOpen,
  File,
  Image,
  Video,
  FileText,
  Download,
  Trash2,
  MoreVertical,
  Eye,
  Share,
  Star,
  Users,
  User as UserIcon
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'

interface FileItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'other'
  size: number
  uploadDate: string
  uploadedBy: string
  project?: string
  client?: string
  clientId?: string
  url?: string
  thumbnail?: string
  tags: string[]
  isStarred: boolean
  accessibleTo?: string[] // User IDs who can access this file
  isPublic?: boolean // If true, all users can access
}

interface FileManagerProps {
  user: User
}

export function FileManager({ user }: FileManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedUploadClient, setSelectedUploadClient] = useState<string>('all')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useKV<FileItem[]>('file-manager', [
    {
      id: '1',
      name: 'korenbloem-instagram-stories.mp4',
      type: 'video',
      size: 15680000,
      uploadDate: '2024-01-20T10:30:00Z',
      uploadedBy: '2',
      project: 'Instagram Campaign',
      client: 'De Korenbloem',
      clientId: 'client1',
      url: '/files/video1.mp4',
      thumbnail: '/files/video1-thumb.jpg',
      tags: ['instagram', 'stories', 'bakery'],
      isStarred: true,
      accessibleTo: ['2', 'client1'],
      isPublic: false
    },
    {
      id: '2',
      name: 'bella-vista-menu-design.png',
      type: 'image',
      size: 2450000,
      uploadDate: '2024-01-19T14:15:00Z',
      uploadedBy: '3',
      project: 'Facebook Ads',
      client: 'Bella Vista',
      clientId: 'client2',
      url: '/files/menu-design.png',
      tags: ['design', 'menu', 'restaurant'],
      isStarred: false,
      accessibleTo: ['3', 'client2'],
      isPublic: false
    },
    {
      id: '3',
      name: 'fitness-first-strategy.pdf',
      type: 'document',
      size: 890000,
      uploadDate: '2024-01-18T09:20:00Z',
      uploadedBy: '1',
      project: 'Social Media Strategy',
      client: 'Fitness First',
      clientId: 'client3',
      url: '/files/strategy.pdf',
      tags: ['strategy', 'planning', 'fitness'],
      isStarred: false,
      accessibleTo: ['1', 'client3'],
      isPublic: false
    },
    {
      id: '4',
      name: 'gkm-brand-guidelines.pdf',
      type: 'document',
      size: 5200000,
      uploadDate: '2024-01-15T16:45:00Z',
      uploadedBy: '1',
      tags: ['branding', 'guidelines', 'internal'],
      isStarred: true,
      isPublic: true // All admins can access
    },
    {
      id: '5',
      name: 'valentine-campaign-mockups.zip',
      type: 'other',
      size: 12300000,
      uploadDate: '2024-01-21T11:30:00Z',
      uploadedBy: '2',
      project: 'Valentine Campaign',
      client: 'Fashion Boutique',
      clientId: 'client4',
      url: '/files/mockups.zip',
      tags: ['mockups', 'valentine', 'fashion'],
      isStarred: false,
      accessibleTo: ['2', 'client4'],
      isPublic: false
    }
  ])

  // Get clients from the main users database
  const [allUsers] = useKV<User[]>('users-database', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin', isOnline: true },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin', isOnline: true },
    { id: '3', name: 'Mike Visser', email: 'mike@gkm.nl', role: 'admin', isOnline: false },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin', isOnline: true },
    { id: 'client1', name: 'De Korenbloem', email: 'info@korenbloem.nl', role: 'client', isOnline: false },
    { id: 'client2', name: 'Bella Vista', email: 'info@bellavista.nl', role: 'client', isOnline: true },
    { id: 'client3', name: 'Fitness First', email: 'info@fitnessfirst.nl', role: 'client', isOnline: false },
    { id: 'client4', name: 'Fashion Boutique', email: 'info@fashionboutique.nl', role: 'client', isOnline: true }
  ])

  const fileTypeIcons = {
    image: Image,
    video: Video,
    document: FileText,
    other: File
  }

  const fileTypeColors = {
    image: 'bg-green-100 text-green-700',
    video: 'bg-blue-100 text-blue-700',
    document: 'bg-red-100 text-red-700',
    other: 'bg-gray-100 text-gray-700'
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getUploadedBy = (userId: string) => {
    return allUsers.find(u => u.id === userId)?.name || 'Unknown'
  }

  const getClientsList = () => {
    return allUsers.filter(u => u.role === 'client')
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (file.client?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    
    const matchesFilter = filterType === 'all' || file.type === filterType
    
    // Role-based filtering
    if (user.role === 'client') {
      // Clients can only see files they have access to
      const hasAccess = file.isPublic || 
                       file.accessibleTo?.includes(user.id) ||
                       file.uploadedBy === user.id
      return matchesSearch && matchesFilter && hasAccess
    }
    
    // Admins see all files
    return matchesSearch && matchesFilter
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          
          // Add the new file to the files array
          const newFile: FileItem = {
            id: Date.now().toString(),
            name: uploadedFiles[0].name,
            type: uploadedFiles[0].type.includes('image') ? 'image' :
                  uploadedFiles[0].type.includes('video') ? 'video' :
                  uploadedFiles[0].type.includes('pdf') ? 'document' : 'other',
            size: uploadedFiles[0].size,
            uploadDate: new Date().toISOString(),
            uploadedBy: user.id,
            tags: [],
            isStarred: false,
            isPublic: selectedUploadClient === 'all',
            accessibleTo: selectedUploadClient === 'all' ? undefined : [user.id, selectedUploadClient]
          }

          if (selectedUploadClient !== 'all') {
            const clientUser = allUsers.find(u => u.id === selectedUploadClient)
            if (clientUser) {
              newFile.client = clientUser.name
              newFile.clientId = selectedUploadClient
            }
          }

          setFiles((prevFiles) => [...prevFiles, newFile])
          setShowUploadDialog(false)
          
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      // Create a synthetic event object with proper typing
      const fileEvent = {
        target: {
          files: droppedFiles
        }
      } as React.ChangeEvent<HTMLInputElement>
      handleFileUpload(fileEvent)
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const canUserAccessFile = (file: FileItem) => {
    if (user.role === 'admin') return true
    // Simplified: clients can access files from their projects
    return file.client === 'My Client' || !file.client
  }

  const canUserDeleteFile = (file: FileItem) => {
    if (user.role === 'admin') return true
    // Clients can only delete files they uploaded
    return file.uploadedBy === user.id
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Files</h1>
          <p className="text-muted-foreground">
            Manage project assets and deliverables
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => user.role === 'admin' ? setShowUploadDialog(true) : fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,video/*,.pdf,.doc,.docx,.zip"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files, projects, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('image')}
          >
            Images
          </Button>
          <Button
            variant={filterType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('video')}
          >
            Videos
          </Button>
          <Button
            variant={filterType === 'document' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('document')}
          >
            Documents
          </Button>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <Card 
        className="glass-card border-dashed border-2 cursor-pointer hover:bg-muted/20 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg text-foreground mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Support for images, videos, documents, and compressed files up to 200MB
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>JPG, PNG, GIF</span>
              <span>MP4, MOV, AVI</span>
              <span>PDF, DOC, DOCX</span>
              <span>ZIP, RAR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files Actions */}
      {selectedFiles.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {user.role === 'admin' && (
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-2'
      }>
        {filteredFiles.map((file) => {
          const IconComponent = fileTypeIcons[file.type]
          const isSelected = selectedFiles.includes(file.id)
          const canAccess = canUserAccessFile(file)
          const canDelete = canUserDeleteFile(file)
          
          if (!canAccess) return null

          return (
            <Card 
              key={file.id}
              className={`glass-card cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${viewMode === 'list' ? 'p-0' : ''}`}
              onClick={() => toggleFileSelection(file.id)}
            >
              {viewMode === 'grid' ? (
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${fileTypeColors[file.type]}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      {file.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground truncate" title={file.name}>
                      {file.name}
                    </h4>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      by {getUploadedBy(file.uploadedBy)}
                    </div>
                    
                    {(file.client || file.project) && (
                      <div className="space-y-1">
                        {file.client && (
                          <Badge variant="outline" className="text-xs">
                            {file.client}
                          </Badge>
                        )}
                        {file.project && (
                          <Badge variant="secondary" className="text-xs">
                            {file.project}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{file.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(file)
                        setShowPreviewModal(true)
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle download
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              ) : (
                /* List View */
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${fileTypeColors[file.type]} flex-shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-foreground truncate">{file.name}</h4>
                        {file.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{formatDate(file.uploadDate)}</span>
                        <span>by {getUploadedBy(file.uploadedBy)}</span>
                        {file.client && <Badge variant="outline" className="text-xs">{file.client}</Badge>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg text-foreground mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'Upload your first file to get started'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl glass-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {selectedFile?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFile && (() => {
            const PreviewIconComponent = fileTypeIcons[selectedFile.type]
            return (
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  {selectedFile.type === 'image' ? (
                    <img 
                      src={selectedFile.url} 
                      alt={selectedFile.name}
                      className="max-w-full max-h-96 mx-auto rounded-lg"
                    />
                  ) : selectedFile.type === 'video' ? (
                    <video 
                      src={selectedFile.url} 
                      controls
                      className="max-w-full max-h-96 mx-auto rounded-lg"
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <div className="py-16">
                      <PreviewIconComponent className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Size: </span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded: </span>
                  <span>{formatDate(selectedFile.uploadDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded by: </span>
                  <span>{getUploadedBy(selectedFile.uploadedBy)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <span className="capitalize">{selectedFile.type}</span>
                </div>
              </div>
              
              {selectedFile.tags.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Tags: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFile.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {selectedFile && canUserDeleteFile(selectedFile) && (
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog for Admin Client Selection */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="glass-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Upload Files</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Client Access</label>
              <Select value={selectedUploadClient} onValueChange={setSelectedUploadClient}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose who can access these files" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>All Users (Public)</span>
                    </div>
                  </SelectItem>
                  {getClientsList().map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{client.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {selectedUploadClient === 'all' 
                  ? 'Files will be accessible by all users' 
                  : selectedUploadClient 
                    ? `Files will only be accessible by you and ${allUsers.find(u => u.id === selectedUploadClient)?.name || 'selected client'}`
                    : 'Choose access level for the uploaded files'}
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full gap-2" 
                onClick={() => {
                  fileInputRef.current?.click()
                }}
              >
                <Upload className="w-4 h-4" />
                Choose Files to Upload
              </Button>
              
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Max file size: 200MB
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx,.zip"
      />
    </div>
  )
}