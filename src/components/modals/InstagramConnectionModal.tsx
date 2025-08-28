import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Instagram, CheckCircle, AlertCircle, Link, Key, Globe, Settings, TrendingUp, DollarSign, Target, Eye, Heart, MessageCircle, Share } from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface InstagramCampaignData {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  reach: number
  impressions: number
  engagement: number
  likes: number
  comments: number
  shares: number
  profileVisits: number
  websiteClicks: number
  cpm: number
  cpe: number
  lastUpdated: string
}

interface InstagramAccount {
  id: string
  name: string
  username: string
  status: 'connected' | 'disconnected'
  accountId: string
  connectedAt?: string
  lastSync?: string
  campaigns?: InstagramCampaignData[]
  totalSpend?: number
  totalReach?: number
  totalEngagement?: number
  followerCount?: number
  profilePicture?: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstagramConnectionModal({ open, onOpenChange }: Props) {
  const [instagramAccounts, setInstagramAccounts] = useKV<InstagramAccount[]>('instagram-accounts', [])
  const [isConnecting, setIsConnecting] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [accountName, setAccountName] = useState('')
  const [username, setUsername] = useState('')

  const generateMockInstagramCampaigns = (): InstagramCampaignData[] => {
    return [
      {
        id: 'ig_camp_1',
        name: 'Spring Collection Promotion',
        status: 'active',
        budget: 3500,
        spent: 2100,
        reach: 68000,
        impressions: 185000,
        engagement: 12500,
        likes: 8900,
        comments: 1200,
        shares: 2400,
        profileVisits: 3200,
        websiteClicks: 890,
        cpm: 11.35,
        cpe: 0.17,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ig_camp_2',
        name: 'Brand Awareness Stories',
        status: 'active',
        budget: 2500,
        spent: 1850,
        reach: 45000,
        impressions: 125000,
        engagement: 9800,
        likes: 7200,
        comments: 980,
        shares: 1620,
        profileVisits: 2100,
        websiteClicks: 650,
        cpm: 14.80,
        cpe: 0.19,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ig_camp_3',
        name: 'User Generated Content',
        status: 'paused',
        budget: 1800,
        spent: 1800,
        reach: 32000,
        impressions: 89000,
        engagement: 6800,
        likes: 4900,
        comments: 750,
        shares: 1150,
        profileVisits: 1500,
        websiteClicks: 420,
        cpm: 20.22,
        cpe: 0.26,
        lastUpdated: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accountId || !accessToken || !accountName || !username) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsConnecting(true)
    
    try {
      // Simulate API connection (in real app, this would connect to Instagram Business API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockCampaigns = generateMockInstagramCampaigns()
      
      const newAccount: InstagramAccount = {
        id: `ig-${Date.now()}`,
        name: accountName,
        username: username.replace('@', ''),
        status: 'connected',
        accountId,
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
        campaigns: mockCampaigns,
        totalSpend: mockCampaigns.reduce((sum, camp) => sum + camp.spent, 0),
        totalReach: mockCampaigns.reduce((sum, camp) => sum + camp.reach, 0),
        totalEngagement: mockCampaigns.reduce((sum, camp) => sum + camp.engagement, 0),
        followerCount: Math.floor(Math.random() * 50000) + 10000, // Mock follower count
        profilePicture: `https://via.placeholder.com/64/FF6B6B/FFFFFF?text=${username.charAt(0).toUpperCase()}`
      }
      
      // Remove any existing account with same accountId and add new one
      setInstagramAccounts(prev => [
        ...prev.filter(acc => acc.accountId !== accountId),
        newAccount
      ])
      
      toast.success(`Successfully connected Instagram Business Account: ${accountName} (@${username})`)
      
      // Reset form
      setAccountId('')
      setAccessToken('')
      setAccountName('')
      setUsername('')
      
    } catch (error) {
      toast.error('Failed to connect Instagram account. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (accountId: string) => {
    setInstagramAccounts(prev => 
      prev.map(acc => 
        acc.accountId === accountId 
          ? { ...acc, status: 'disconnected' as const }
          : acc
      )
    )
    toast.success('Instagram account disconnected')
  }

  const handleSync = (accountId: string) => {
    const updatedCampaigns = generateMockInstagramCampaigns()
    
    setInstagramAccounts(prev => 
      prev.map(acc => 
        acc.accountId === accountId 
          ? { 
              ...acc, 
              lastSync: new Date().toISOString(),
              campaigns: updatedCampaigns,
              totalSpend: updatedCampaigns.reduce((sum, camp) => sum + camp.spent, 0),
              totalReach: updatedCampaigns.reduce((sum, camp) => sum + camp.reach, 0),
              totalEngagement: updatedCampaigns.reduce((sum, camp) => sum + camp.engagement, 0)
            }
          : acc
      )
    )
    toast.success('Instagram campaign data synchronized successfully')
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
            <Instagram className="h-6 w-6 text-pink-600" />
            Instagram Business Account Connection
          </DialogTitle>
          <DialogDescription>
            Connect your Instagram Business account to sync campaign data and analytics with your GKM Portal dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connected Accounts */}
          {instagramAccounts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Connected Accounts ({instagramAccounts.length})
              </h3>
              <div className="space-y-4">
                {instagramAccounts.map((account) => (
                  <Card key={account.id} className="glass-card">
                    <CardContent className="p-6">
                      {/* Account Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Instagram className="h-6 w-6 text-pink-600" />
                            {account.profilePicture && (
                              <img 
                                src={account.profilePicture} 
                                alt={account.username}
                                className="absolute -top-1 -right-1 h-4 w-4 rounded-full border border-white"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-lg flex items-center gap-2">
                              {account.name}
                              <span className="text-pink-600 text-sm">@{account.username}</span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              Account ID: {account.accountId}
                              {account.followerCount && (
                                <>
                                  <span>•</span>
                                  <span>{formatNumber(account.followerCount)} followers</span>
                                </>
                              )}
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
                                className="hover:bg-pink-50"
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
                                setUsername(account.username)
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
                            <Card className="p-3 bg-pink-50/50 border-pink-200">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-pink-600" />
                                <div>
                                  <div className="text-xs text-pink-600">Total Spend</div>
                                  <div className="font-semibold">{formatCurrency(account.totalSpend || 0)}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-purple-50/50 border-purple-200">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-purple-600" />
                                <div>
                                  <div className="text-xs text-purple-600">Total Reach</div>
                                  <div className="font-semibold">{formatNumber(account.totalReach || 0)}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-orange-50/50 border-orange-200">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-orange-600" />
                                <div>
                                  <div className="text-xs text-orange-600">Total Engagement</div>
                                  <div className="font-semibold">{formatNumber(account.totalEngagement || 0)}</div>
                                </div>
                              </div>
                            </Card>
                            <Card className="p-3 bg-blue-50/50 border-blue-200">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="text-xs text-blue-600">Active Campaigns</div>
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
                                    <div className="grid grid-cols-2 md:grid-cols-8 gap-2 text-xs">
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
                                        <span className="text-muted-foreground">Engagement:</span>
                                        <div className="font-medium">{formatNumber(campaign.engagement)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Likes:</span>
                                        <div className="font-medium">{formatNumber(campaign.likes)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Comments:</span>
                                        <div className="font-medium">{campaign.comments}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">CPM:</span>
                                        <div className="font-medium">${campaign.cpm}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">CPE:</span>
                                        <div className="font-medium">${campaign.cpe}</div>
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
                  <Label htmlFor="account-name">Business Account Name</Label>
                  <Input
                    id="account-name"
                    placeholder="e.g. GKM Media Business"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Instagram Username</Label>
                  <Input
                    id="username"
                    placeholder="e.g. @gkmedia"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-id">Instagram Business Account ID</Label>
                <Input
                  id="account-id"
                  placeholder="e.g. 17841400008460056"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="access-token" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Access Token
                </Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Enter your Instagram access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Generate an access token from Facebook Developer Console with Instagram Business permissions
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isConnecting}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Instagram className="h-4 w-4 mr-2" />
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
          <Card className="glass-card border-pink-200 bg-pink-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-pink-600" />
                How to get your Instagram Business credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>1. Go to <strong>Facebook Developer Console</strong></p>
              <p>2. Create or select your app with Instagram Basic Display API</p>
              <p>3. Add Instagram Business permissions to your app</p>
              <p>4. Generate an access token with <strong>instagram_basic</strong> and <strong>pages_read_engagement</strong> permissions</p>
              <p>5. Convert your Instagram account to a Business account</p>
              <p>6. Link it to a Facebook Page in Instagram settings</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}