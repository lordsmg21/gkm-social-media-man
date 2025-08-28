import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Facebook, CheckCircle, AlertCircle, Link, Key, Globe, Settings, TrendingUp, DollarSign, Target, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface CampaignData {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  reach: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  lastUpdated: string
}

interface FacebookAccount {
  id: string
  name: string
  status: 'connected' | 'disconnected'
  accountId: string
  connectedAt?: string
  lastSync?: string
  campaigns?: CampaignData[]
  totalSpend?: number
  totalReach?: number
  totalConversions?: number
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

  const generateMockCampaigns = (): CampaignData[] => {
    return [
      {
        id: 'camp_1',
        name: 'Q1 Lead Generation Campaign',
        status: 'active',
        budget: 5000,
        spent: 3250,
        reach: 45000,
        impressions: 125000,
        clicks: 2100,
        conversions: 85,
        ctr: 1.68,
        cpc: 1.55,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'camp_2',
        name: 'Brand Awareness - Social',
        status: 'active',
        budget: 3000,
        spent: 1800,
        reach: 32000,
        impressions: 89000,
        clicks: 1450,
        conversions: 42,
        ctr: 1.63,
        cpc: 1.24,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'camp_3',
        name: 'Retargeting Campaign',
        status: 'paused',
        budget: 2000,
        spent: 2000,
        reach: 18000,
        impressions: 55000,
        clicks: 890,
        conversions: 23,
        ctr: 1.62,
        cpc: 2.25,
        lastUpdated: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }

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
      
      const mockCampaigns = generateMockCampaigns()
      
      const newAccount: FacebookAccount = {
        id: `fb-${Date.now()}`,
        name: accountName,
        status: 'connected',
        accountId,
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
        campaigns: mockCampaigns,
        totalSpend: mockCampaigns.reduce((sum, camp) => sum + camp.spent, 0),
        totalReach: mockCampaigns.reduce((sum, camp) => sum + camp.reach, 0),
        totalConversions: mockCampaigns.reduce((sum, camp) => sum + camp.conversions, 0)
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
    const updatedCampaigns = generateMockCampaigns()
    
    setFacebookAccounts(prev => 
      prev.map(acc => 
        acc.accountId === accountId 
          ? { 
              ...acc, 
              lastSync: new Date().toISOString(),
              campaigns: updatedCampaigns,
              totalSpend: updatedCampaigns.reduce((sum, camp) => sum + camp.spent, 0),
              totalReach: updatedCampaigns.reduce((sum, camp) => sum + camp.reach, 0),
              totalConversions: updatedCampaigns.reduce((sum, camp) => sum + camp.conversions, 0)
            }
          : acc
      )
    )
    toast.success('Campaign data synchronized successfully')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl glass-modal max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Connected Accounts ({facebookAccounts.length})
              </h3>
              <div className="space-y-4">
                {facebookAccounts.map((account) => (
                  <Card key={account.id} className="glass-card">
                    <CardContent className="p-6">
                      {/* Account Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Facebook className="h-6 w-6 text-blue-600" />
                          <div>
                            <div className="font-semibold text-lg">{account.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Account ID: {account.accountId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={account.status === 'connected' ? 'default' : 'secondary'}
                            className={account.status === 'connected' ? 'bg-green-100 text-green-700 border-green-300' : ''}
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
                                className="hover:bg-blue-50"
                              >
                                <Settings className="h-3 w-3 mr-1" />
                                Sync Data
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

                      {/* Account Summary - Only show if connected and has data */}
                      {account.status === 'connected' && account.campaigns && (
                        <>
                          {/* Quick Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <Card className="p-3 bg-blue-50/50 border-blue-200">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="text-xs text-blue-600">Total Spend</div>
                                  <div className="font-semibold">{formatCurrency(account.totalSpend || 0)}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-green-50/50 border-green-200">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-green-600" />
                                <div>
                                  <div className="text-xs text-green-600">Total Reach</div>
                                  <div className="font-semibold">{formatNumber(account.totalReach || 0)}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-purple-50/50 border-purple-200">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-purple-600" />
                                <div>
                                  <div className="text-xs text-purple-600">Conversions</div>
                                  <div className="font-semibold">{account.totalConversions || 0}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-orange-50/50 border-orange-200">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-orange-600" />
                                <div>
                                  <div className="text-xs text-orange-600">Active Campaigns</div>
                                  <div className="font-semibold">
                                    {account.campaigns.filter(c => c.status === 'active').length}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Campaign Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground">Campaign Performance</h4>
                            {account.campaigns.map((campaign) => (
                              <Card key={campaign.id} className="p-3 bg-white/50 border">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{campaign.name}</span>
                                      <Badge 
                                        variant={
                                          campaign.status === 'active' ? 'default' : 
                                          campaign.status === 'paused' ? 'secondary' : 'outline'
                                        }
                                        className="text-xs"
                                      >
                                        {campaign.status}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                                      <div>
                                        <span className="text-muted-foreground">Budget:</span>
                                        <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Spent:</span>
                                        <div className="font-medium">{formatCurrency(campaign.spent)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Reach:</span>
                                        <div className="font-medium">{formatNumber(campaign.reach)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Clicks:</span>
                                        <div className="font-medium">{campaign.clicks}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">CTR:</span>
                                        <div className="font-medium">{campaign.ctr}%</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Conversions:</span>
                                        <div className="font-medium">{campaign.conversions}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <Progress 
                                      value={(campaign.spent / campaign.budget) * 100} 
                                      className="w-16"
                                    />
                                    <div className="text-xs text-muted-foreground text-center mt-1">
                                      {Math.round((campaign.spent / campaign.budget) * 100)}%
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </>
                      )}

                      {account.lastSync && (
                        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
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