import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Facebook, Instagram, RefreshCw, Settings, Unplug, Loader2 } from 'lucide-react'
import { useSocialMediaSync } from '@/hooks'
import { toast } from 'sonner'
import type { SocialMediaAccount } from '@/types'

interface SocialMediaIntegrationProps {
  isAdmin: boolean
}

export const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ 
  isAdmin 
}) => {
  const {
    sync,
    isConnecting,
    isSyncing,
    connectFacebookAccount,
    connectInstagramAccount,
    disconnectAccount,
    syncCampaignData,
    toggleAutoSync,
    updateSyncInterval,
  } = useSocialMediaSync()

  const [syncInterval, setSyncInterval] = useState(sync.syncInterval.toString())

  const handleSyncIntervalUpdate = () => {
    const interval = parseInt(syncInterval)
    if (interval < 5) {
      toast.error('Sync interval must be at least 5 minutes')
      return
    }
    updateSyncInterval(interval)
  }

  const getAccountIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (account: SocialMediaAccount) => {
    if (account.isConnected) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
    }
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Disconnected</Badge>
  }

  if (!isAdmin) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Social Media Integration
          </CardTitle>
          <CardDescription>
            Campaign data is automatically synced from connected accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sync.accounts.filter(acc => acc.isConnected).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No social media accounts connected. Contact your administrator to set up integrations.
              </p>
            ) : (
              <>
                <div className="grid gap-4">
                  {sync.accounts.filter(acc => acc.isConnected).map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAccountIcon(account.platform)}
                        <div>
                          <p className="font-medium">{account.accountName}</p>
                          <p className="text-sm text-muted-foreground">
                            Last synced: {account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(account)}
                    </div>
                  ))}
                </div>
                
                {sync.lastSync && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Last campaign sync: {new Date(sync.lastSync).toLocaleString()}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Connections */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Social Media Account Integration
          </CardTitle>
          <CardDescription>
            Connect your Facebook and Instagram ad accounts to sync campaign data automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Facebook Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Facebook Ad Account</h3>
            {sync.accounts.find(acc => acc.platform === 'facebook' && acc.isConnected) ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <Facebook className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {sync.accounts.find(acc => acc.platform === 'facebook')?.accountName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connected • Last synced: {
                        sync.accounts.find(acc => acc.platform === 'facebook')?.lastSyncAt 
                          ? new Date(sync.accounts.find(acc => acc.platform === 'facebook')!.lastSyncAt!).toLocaleString()
                          : 'Never'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fbAccount = sync.accounts.find(acc => acc.platform === 'facebook')
                      if (fbAccount) disconnectAccount(fbAccount.id)
                    }}
                  >
                    <Unplug className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Facebook className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">Facebook Ad Account</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button 
                  onClick={connectFacebookAccount}
                  disabled={isConnecting === 'facebook'}
                >
                  {isConnecting === 'facebook' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Connect Account
                </Button>
              </div>
            )}
          </div>

          {/* Instagram Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instagram Business Account</h3>
            {sync.accounts.find(acc => acc.platform === 'instagram' && acc.isConnected) ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-pink-50">
                <div className="flex items-center gap-3">
                  <Instagram className="w-6 h-6 text-pink-600" />
                  <div>
                    <p className="font-medium">
                      {sync.accounts.find(acc => acc.platform === 'instagram')?.accountName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connected • Last synced: {
                        sync.accounts.find(acc => acc.platform === 'instagram')?.lastSyncAt 
                          ? new Date(sync.accounts.find(acc => acc.platform === 'instagram')!.lastSyncAt!).toLocaleString()
                          : 'Never'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const igAccount = sync.accounts.find(acc => acc.platform === 'instagram')
                      if (igAccount) disconnectAccount(igAccount.id)
                    }}
                  >
                    <Unplug className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Instagram className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">Instagram Business Account</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button 
                  onClick={connectInstagramAccount}
                  disabled={isConnecting === 'instagram'}
                >
                  {isConnecting === 'instagram' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Connect Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Configure how and when campaign data is synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Sync */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Manual Sync</p>
              <p className="text-sm text-muted-foreground">
                Manually sync campaign data from connected accounts
              </p>
            </div>
            <Button 
              onClick={() => syncCampaignData(true)}
              disabled={isSyncing || sync.accounts.filter(acc => acc.isConnected).length === 0}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>

          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatic Sync</p>
              <p className="text-sm text-muted-foreground">
                Automatically sync campaign data at regular intervals
              </p>
            </div>
            <Switch
              checked={sync.isEnabled}
              onCheckedChange={toggleAutoSync}
            />
          </div>

          {/* Sync Interval */}
          {sync.isEnabled && (
            <div className="space-y-2">
              <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
              <div className="flex items-center gap-2">
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="360">6 hours</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSyncIntervalUpdate} size="sm">
                  Update
                </Button>
              </div>
            </div>
          )}

          {/* Last Sync Info */}
          {sync.lastSync && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Last successful sync: {new Date(sync.lastSync).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total campaigns synced: {sync.campaigns.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Overview */}
      {sync.campaigns.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Connected Campaigns</CardTitle>
            <CardDescription>
              Overview of campaigns from connected social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sync.campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getAccountIcon(campaign.platform)}
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)} • 
                        Spend: ${campaign.spend.toFixed(2)} • 
                        Impressions: {campaign.impressions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
              ))}
              
              {sync.campaigns.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {sync.campaigns.length - 5} more campaigns...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}