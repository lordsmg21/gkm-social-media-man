import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Download, Upload, FileText, Calendar, Euro, User, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { FileDropZone } from './FileDropZone'
import type { User } from '../App'

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  amount: number
  currency: string
  dueDate: string
  issueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  description: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  uploadedBy: string
  uploadedAt: string
}

interface BillingViewProps {
  user: User
}

export function BillingView({ user }: BillingViewProps) {
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      clientId: '2',
      clientName: 'Sarah Johnson',
      amount: 2500.00,
      currency: 'EUR',
      dueDate: '2024-02-15',
      issueDate: '2024-01-15',
      status: 'sent',
      description: 'Social media management services for January 2024',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI1Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihJbnZvaWNlOiBJTlYtMjAyNC0wMDEpIFRqCjAgLTIwIFRkCihDbGllbnQ6IFNhcmFoIEpvaG5zb24pIFRqCjAgLTIwIFRkCihBbW91bnQ6IOKCrDI1MDAuMDApIFRqCjAgLTIwIFRkCihEZXNjcmlwdGlvbjogU29jaWFsIG1lZGlhIG1hbmFnZW1lbnQgc2VydmljZXMpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDUzIDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDM0OCAwMDAwMCBuIAowMDAwMDAwNTY1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNjY1CiUlRU9G',
      fileName: 'INV-2024-001.pdf',
      fileSize: 245000,
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      clientId: '3',
      clientName: 'Mike Chen',
      amount: 1800.00,
      currency: 'EUR',
      dueDate: '2024-02-20',
      issueDate: '2024-01-20',
      status: 'paid',
      description: 'Instagram campaign design and implementation',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI1Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihJbnZvaWNlOiBJTlYtMjAyNC0wMDIpIFRqCjAgLTIwIFRkCihDbGllbnQ6IE1pa2UgQ2hlbikgVGoKMCAtMjAgVGQKKEFtb3VudDog4oKsMTgwMC4wMCkgVGoKMCAtMjAgVGQKKERlc2NyaXB0aW9uOiBJbnN0YWdyYW0gY2FtcGFpZ24gZGVzaWduKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA1MyAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAzNDggMDAwMDAgbiAKMDAwMDAwMDU2NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjY2NQolJUVPRg==',
      fileName: 'INV-2024-002.pdf',
      fileSize: 189000,
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-20T14:30:00Z'
    }
  ])
  
  const [clients] = useKV<User[]>('clients', [
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'client' },
    { id: '3', name: 'Mike Chen', email: 'mike@startup.com', role: 'client' },
    { id: '4', name: 'Emma Davis', email: 'emma@business.com', role: 'client' }
  ])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Form state for creating new invoices
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    clientId: '',
    amount: '',
    dueDate: '',
    description: '',
    status: 'draft' as const
  })

  // Get available clients for admin
  const availableClients = user.role === 'admin' 
    ? clients.filter(client => client.role === 'client')
    : []

  // Filter invoices based on user role and filters
  const filteredInvoices = invoices
    .filter(invoice => {
      // Role-based filtering
      if (user.role === 'client') {
        return invoice.clientId === user.id
      }
      return true // Admin sees all
    })
    .filter(invoice => {
      // Status filter
      if (filterStatus !== 'all' && invoice.status !== filterStatus) {
        return false
      }
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return invoice.invoiceNumber.toLowerCase().includes(term) ||
               invoice.clientName.toLowerCase().includes(term) ||
               invoice.description.toLowerCase().includes(term)
      }
      return true
    })
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  const handleFileUpload = async (files: File[]) => {
    if (!newInvoice.invoiceNumber || !newInvoice.clientId) {
      toast.error('Please fill in invoice details first')
      return
    }

    const file = files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for invoices')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be under 10MB')
      return
    }

    try {
      // Create mock PDF blob for demo purposes
      const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/ProcSet [/PDF /Text]
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 125
>>
stream
BT
/F1 12 Tf
72 720 Td
(Invoice: ${newInvoice.invoiceNumber}) Tj
0 -20 Td
(Client: ${availableClients.find(c => c.id === newInvoice.clientId)?.name}) Tj
0 -20 Td
(Amount: €${newInvoice.amount}) Tj
0 -20 Td
(Description: ${newInvoice.description}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000000565 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
665
%%EOF`

      // Create blob URL from the uploaded file or use mock PDF
      let fileUrl: string
      if (file.type === 'application/pdf') {
        fileUrl = URL.createObjectURL(file)
      } else {
        // Create mock PDF blob
        const pdfBlob = new Blob([mockPdfContent], { type: 'application/pdf' })
        fileUrl = URL.createObjectURL(pdfBlob)
      }
      
      const selectedClient = availableClients.find(c => c.id === newInvoice.clientId)
      
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: newInvoice.invoiceNumber,
        clientId: newInvoice.clientId,
        clientName: selectedClient?.name || 'Unknown Client',
        amount: parseFloat(newInvoice.amount) || 0,
        currency: 'EUR',
        dueDate: newInvoice.dueDate,
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        status: newInvoice.status,
        description: newInvoice.description,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: user.name,
        uploadedAt: new Date().toISOString()
      }

      setInvoices(current => [...current, invoice])
      
      // Reset form
      setNewInvoice({
        invoiceNumber: '',
        clientId: '',
        amount: '',
        dueDate: '',
        description: '',
        status: 'draft'
      })
      
      setIsCreateModalOpen(false)
      toast.success('Invoice uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload invoice')
    }
  }

  const handleDownload = (invoice: Invoice) => {
    if (invoice.fileUrl) {
      const link = document.createElement('a')
      link.href = invoice.fileUrl
      link.download = invoice.fileName || `${invoice.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Invoice downloaded')
    }
  }

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPreviewModalOpen(true)
  }

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(current => 
      current.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      )
    )
    toast.success('Invoice status updated')
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateTotalAmount = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  }

  const getStatusCounts = () => {
    const counts = { draft: 0, sent: 0, paid: 0, overdue: 0 }
    filteredInvoices.forEach(invoice => {
      counts[invoice.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {user.role === 'admin' ? 'Invoice Management' : 'My Invoices'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'admin' 
              ? 'Upload and manage client invoices' 
              : 'View and download your invoices'
            }
          </p>
        </div>
        
        {user.role === 'admin' && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Upload Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl glass-modal">
              <DialogHeader>
                <DialogTitle>Upload New Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={newInvoice.invoiceNumber}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select 
                      value={newInvoice.clientId} 
                      onValueChange={(value) => setNewInvoice(prev => ({ ...prev, clientId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (EUR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="1500.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Social media management services for January 2024"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newInvoice.status} 
                    onValueChange={(value: 'draft' | 'sent') => setNewInvoice(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Upload PDF Invoice</Label>
                  <FileDropZone
                    onFilesSelected={handleFileUpload}
                    acceptedFileTypes={['.pdf']}
                    maxFileSize={10}
                    className="mt-2"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Euro className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                €{calculateTotalAmount().toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.paid}</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.sent}</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.overdue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No invoices found</p>
            <p className="text-muted-foreground">
              {user.role === 'admin' 
                ? 'Upload your first invoice to get started' 
                : 'No invoices available yet'
              }
            </p>
          </Card>
        ) : (
          filteredInvoices.map(invoice => (
            <Card key={invoice.id} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{invoice.invoiceNumber}</h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {invoice.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        €{invoice.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    {invoice.description && (
                      <p className="text-sm text-muted-foreground mt-1">{invoice.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Select 
                      value={invoice.status} 
                      onValueChange={(value: Invoice['status']) => updateInvoiceStatus(invoice.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(invoice)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(invoice)}
                    className="gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] glass-modal">
          <DialogHeader>
            <DialogTitle>
              Invoice Preview - {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedInvoice?.fileUrl ? (
              <iframe
                src={selectedInvoice.fileUrl}
                className="w-full h-full border rounded-lg"
                title="Invoice Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No file available for preview</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}