import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '../App'

// Mock FileDropZone component since it's not available
function FileDropZone({ onFilesSelected, acceptedFileTypes, maxFileSize, className }: {
  onFilesSelected: (files: File[]) => void
  acceptedFileTypes: string[]
  maxFileSize: number
  className?: string
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onFilesSelected(files)
  }

  return (
    <div className={`glass-card border-2 border-dashed border-primary/30 rounded-xl p-6 text-center hover:border-primary/50 transition-colors ${className}`}>
      <input
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-muted-foreground">
          <div className="p-4 bg-primary/20 rounded-lg inline-flex mb-3">
            <span className="text-primary text-3xl">↑</span>
          </div>
          <p className="font-medium">Click to upload or drag and drop</p>
          <p className="text-sm">PDF files up to {maxFileSize}MB</p>
        </div>
      </label>
    </div>
  )
}

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
  const [invoices, setInvoices] = useKV<Invoice[]>('billing-invoices', [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      clientId: 'client1',
      clientName: 'De Korenbloem',
      amount: 2500.00,
      currency: '$',
      dueDate: '2024-02-15',
      issueDate: '2024-01-15',
      status: 'sent',
      description: 'Social media management services for January 2024',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI1Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihJbnZvaWNlOiBJTlYtMjAyNC0wMDEpIFRqCjAgLTIwIFRkCihDbGllbnQ6IERlIEtvcmVuYmxvZW0pIFRqCjAgLTIwIFRkCihBbW91bnQ6ICQyNTAwLjAwKSBUagowIC0yMCBUZAooRGVzY3JpcHRpb246IFNvY2lhbCBtZWRpYSBtYW5hZ2VtZW50IHNlcnZpY2VzKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA1MyAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAzNDggMDAwMDAgbiAKMDAwMDAwMDU2NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjY2NQolJUVPRg==',
      fileName: 'INV-2024-001.pdf',
      fileSize: 245000,
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      clientId: 'client2',
      clientName: 'Bella Vista',
      amount: 1800.00,
      currency: '$',
      dueDate: '2024-02-20',
      issueDate: '2024-01-20',
      status: 'paid',
      description: 'Instagram campaign design and implementation',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI1Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihJbnZvaWNlOiBJTlYtMjAyNC0wMDIpIFRqCjAgLTIwIFRkCihDbGllbnQ6IEJlbGxhIFZpc3RhKSBUagowIC0yMCBUZAooQW1vdW50OiAkMTgwMC4wMCkgVGoKMCAtMjAgVGQKKERlc2NyaXB0aW9uOiBJbnN0YWdyYW0gY2FtcGFpZ24gZGVzaWduKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA1MyAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAzNDggMDAwMDAgbiAKMDAwMDAwMDU2NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjY2NQolJUVPRg==',
      fileName: 'INV-2024-002.pdf',
      fileSize: 189000,
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-20T14:30:00Z'
    }
  ])
  
  // Get clients from the shared users database
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

  // Get available clients for admin
  const availableClients = user.role === 'admin' 
    ? allUsers.filter(u => u.role === 'client')
    : []

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
      alert('Please fill in invoice details first')
      return
    }

    const file = files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed for invoices')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be under 10MB')
      return
    }

    try {
      // Create blob URL from the uploaded file
      const fileUrl = URL.createObjectURL(file)
      
      const selectedClient = availableClients.find(c => c.id === newInvoice.clientId)
      
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: newInvoice.invoiceNumber,
        clientId: newInvoice.clientId,
        clientName: selectedClient?.name || 'Unknown Client',
        amount: parseFloat(newInvoice.amount) || 0,
        currency: '$',
        dueDate: newInvoice.dueDate,
        issueDate: new Date().toISOString().split('T')[0],
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
      alert('Invoice uploaded successfully')
    } catch (error) {
      alert('Failed to upload invoice')
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
      alert('Invoice downloaded')
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
    alert('Invoice status updated')
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-700 border border-green-500/30'
      case 'sent': return 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-700 border border-red-500/30'
      case 'draft': return 'bg-muted text-muted-foreground border border-border'
      default: return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">
              {user.role === 'admin' ? 'Invoice Management' : 'My Invoices'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {user.role === 'admin' 
                ? 'Upload and manage client invoices' 
                : 'View and download your invoices'
              }
            </p>
          </div>
          
          {user.role === 'admin' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg"
            >
              <span className="text-xl">$</span>
              Upload Invoice
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <span className="text-primary text-xl">$</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground font-heading">
                ${calculateTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-foreground font-heading">{statusCounts.paid}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <span className="text-blue-600 text-xl">↗</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold text-foreground font-heading">{statusCounts.sent}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-foreground font-heading">{statusCounts.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
          >
            <option value="all">All Invoices</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-xl">
            <div className="p-4 bg-primary/20 rounded-lg inline-flex mb-4">
              <span className="text-primary text-6xl">$</span>
            </div>
            <p className="text-lg font-medium text-foreground font-heading">No invoices found</p>
            <p className="text-muted-foreground">
              {user.role === 'admin' 
                ? 'Upload your first invoice to get started' 
                : 'No invoices available yet'
              }
            </p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <span className="text-primary text-xl">$</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground font-heading">{invoice.invoiceNumber}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        {invoice.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>$</span>
                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⏱</span>
                        Due: {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                    {invoice.description && (
                      <p className="text-sm text-muted-foreground mt-1">{invoice.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <select
                      value={invoice.status}
                      onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as Invoice['status'])}
                      className="px-3 py-2 text-sm bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  )}
                  
                  <button
                    onClick={() => handlePreview(invoice)}
                    className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>👁</span>
                    Preview
                  </button>
                  
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="px-4 py-2 text-sm bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>↓</span>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-modal rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground font-heading">Upload New Invoice</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-background/50 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={newInvoice.invoiceNumber}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="INV-2024-001"
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Client
                  </label>
                  <select
                    value={newInvoice.clientId}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  >
                    <option value="">Select client</option>
                    {availableClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1500.00"
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Social media management services for January 2024"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, status: e.target.value as 'draft' | 'sent' }))}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Upload PDF Invoice
                </label>
                <FileDropZone
                  onFilesSelected={handleFileUpload}
                  acceptedFileTypes={['.pdf']}
                  maxFileSize={10}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-modal rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground font-heading">
                  Invoice Preview - {selectedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-background/50 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 h-full overflow-hidden">
              {selectedInvoice.fileUrl ? (
                <iframe
                  src={selectedInvoice.fileUrl}
                  className="w-full h-full border border-border rounded-lg"
                  title="Invoice Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground">No file available for preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [currentUser] = useState<AppUser>({
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BillingView user={currentUser} />
    </div>
  )
}