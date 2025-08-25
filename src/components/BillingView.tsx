import { useState } from 'react'

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
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
      <input
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-gray-500">
          <div className="mb-2">📁</div>
          <p>Click to upload or drag and drop</p>
          <p className="text-sm">PDF files up to {maxFileSize}MB</p>
        </div>
      </label>
    </div>
  )
}

// Define User interface locally
interface AppUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
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
  user: AppUser
}

export function BillingView({ user }: BillingViewProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([
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
  
  const [clients] = useState<AppUser[]>([
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
        currency: 'EUR',
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
      case 'paid': return 'bg-green-100 text-green-800 border border-green-200'
      case 'sent': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'overdue': return 'bg-red-100 text-red-800 border border-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'admin' ? 'Invoice Management' : 'My Invoices'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'admin' 
              ? 'Upload and manage client invoices' 
              : 'View and download your invoices'
            }
          </p>
        </div>
        
        {user.role === 'admin' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>➕</span>
            Upload Invoice
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                €{calculateTotalAmount().toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📄</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.paid}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📤</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.sent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white p-12 text-center rounded-lg shadow border">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium text-gray-900">No invoices found</p>
            <p className="text-gray-600">
              {user.role === 'admin' 
                ? 'Upload your first invoice to get started' 
                : 'No invoices available yet'
              }
            </p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">📄</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        {invoice.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>💰</span>
                        €{invoice.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        Due: {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                    {invoice.description && (
                      <p className="text-sm text-gray-600 mt-1">{invoice.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <select
                      value={invoice.status}
                      onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as Invoice['status'])}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  )}
                  
                  <button
                    onClick={() => handlePreview(invoice)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-1"
                  >
                    <span>👁️</span>
                    Preview
                  </button>
                  
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-1"
                  >
                    <span>⬇️</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload New Invoice</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={newInvoice.invoiceNumber}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="INV-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    value={newInvoice.clientId}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1500.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Social media management services for January 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, status: e.target.value as 'draft' | 'sent' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Invoice Preview - {selectedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 h-full overflow-hidden">
              {selectedInvoice.fileUrl ? (
                <iframe
                  src={selectedInvoice.fileUrl}
                  className="w-full h-full border rounded-lg"
                  title="Invoice Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">No file available for preview</p>
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
    <div className="min-h-screen bg-gray-100">
      <BillingView user={currentUser} />
    </div>
  )
}