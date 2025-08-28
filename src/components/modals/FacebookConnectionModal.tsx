import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Facebook, CheckCircle, AlertCircle, Link, Key, Globe, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface FacebookAccount {
  id: string
  name: string
  status: 'connected' | 'disconnected'
  accountId: string
  connectedAt?: string
  lastSync?: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FacebookConnectionModal({ open, onOpenChange }: Props) {
  const [facebookAccounts, setFacebookAccounts] = useKV<FacebookAccount[]>('facebook-accounts', [])
  const [isConnecting, setIsConnecting] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [accountName, setAccountName] = useState('')

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accountId || !accessToken || !accountName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsConnecting(true)
    
    try {
      // Simulate API connection (in real app, this would connect to Facebook API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newAccount: FacebookAccount = {
        id: `fb-${Date.now()}`,
        name: accountName,
        status: 'connected',
        accountId,
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      }
      
      // Remove any existing account with same accountId and add new one
      setFacebookAccounts(prev => [
        ...prev.filter(acc => acc.accountId !== accountId),
        newAccount
      ])
      
      toast.success(`Successfully connected Facebook Ad Account: ${accountName}`)
      
      // Reset form
      setAccountId('')
      setAccessToken('')
      setAccountName('')
      
    } catch (error) {
      toast.error('Failed to connect Facebook account. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (accountId: string) => {
    setFacebookAccounts(prev => 
      prev.map(acc => 
        acc.accountId === accountId 
          ? { ...acc, status: 'disconnected' as const }
          : acc
      )
    )
    toast.success('Facebook account disconnected')
  }

  const handleSync = (accountId: string) => {
    setFacebookAccounts(prev => 
      prev.map(acc => 
        acc.accountId === accountId 
          ? { ...acc, lastSync: new Date().toISOString() }
          : acc
      )
    )
    toast.success('Data synchronized successfully')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Facebook className="h-6 w-6 text-blue-600" />
            Facebook Ad Account Connection
          </DialogTitle>
          <DialogDescription>
            Connect your Facebook ad account to sync campaign data and analytics with your GKM Portal dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connected Accounts */}
          {facebookAccounts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Connected Accounts
              </h3>
              <div className="space-y-2">
                {facebookAccounts.map((account) => (
                  <Card key={account.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Facebook className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{account.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Account ID: {account.accountId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={account.status === 'connected' ? 'default' : 'secondary'}
                            className={account.status === 'connected' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {account.status === 'connected' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {account.status}
                          </Badge>
                          {account.status === 'connected' ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSync(account.accountId)}
                              >
                                <Settings className="h-3 w-3 mr-1" />
                                Sync
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDisconnect(account.accountId)}
                              >
                                Disconnect
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setAccountId(account.accountId)
                                setAccountName(account.name)
                              }}
                            >
                              Reconnect
                            </Button>
                          )}
                        </div>
                      </div>
                      {account.lastSync && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Last sync: {new Date(account.lastSync).toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Add New Account */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Connect New Account
            </h3>
            
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    placeholder="e.g. GKM Main Ad Account"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-id">Facebook Ad Account ID</Label>
                  <Input
                    id="account-id"
                    placeholder="e.g. act_1234567890"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="access-token" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Access Token
                </Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Enter your Facebook access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Generate an access token from Facebook Developer Console with ads_read permissions
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isConnecting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Facebook className="h-4 w-4 mr-2" />
                      Connect Account
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <Card className="glass-card border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                How to get your Facebook credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>1. Go to <strong>Facebook Developer Console</strong></p>
              <p>2. Create or select your app</p>
              <p>3. Navigate to <strong>Marketing API</strong> section</p>
              <p>4. Generate an access token with <strong>ads_read</strong> permissions</p>
              <p>5. Find your Ad Account ID in Facebook Ads Manager settings</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}