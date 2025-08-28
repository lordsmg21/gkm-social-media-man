import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { SocialMediaSync, SocialMediaAccount, Campaign, AdInsight } from '../types'

export function useSocialMediaSync() {
  const [sync, setSync, deleteSync] = useKV<SocialMediaSync>('social-media-sync', {
    isEnabled: false,
    syncInterval: 60,
    lastSync: new Date().toISOString(),
    accounts: [],
    campaigns: [],
    insights: []
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [isConnecting, setIsConnecting] = useState<'facebook' | 'instagram' | null>(null)

  // Mock Facebook connection
  const connectFacebook = useCallback(async () => {
    setIsConnecting('facebook')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock account data - in real implementation, get this from Facebook Graph API
      const mockAccount: SocialMediaAccount = {
        id: 'fb_' + Date.now(),
        platform: 'facebook',
        accountId: 'act_123456789',
        accountName: 'GKM Business',
        accessToken: 'mock_facebook_token', // In real app, get from OAuth
        isConnected: true,
        connectedAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString()
      }

      setSync(current => ({
        ...current,
        accounts: [...current.accounts.filter(acc => acc.platform !== 'facebook'), mockAccount],
        isEnabled: true
      }))

      toast.success('Facebook account connected successfully!')
      
    } catch (error) {
      toast.error('Failed to connect Facebook account')
    } finally {
      setIsConnecting(null)
    }
  }, [setSync])

  // Mock Instagram connection
  const connectInstagram = useCallback(async () => {
    setIsConnecting('instagram')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock account data - in real implementation, get this from Instagram Graph API
      const mockAccount: SocialMediaAccount = {
        id: 'ig_' + Date.now(),
        platform: 'instagram',
        accountId: 'ig_123456789',
        accountName: 'GKM_Official',
        accessToken: 'mock_instagram_token', // In real app, get from OAuth
        isConnected: true,
        connectedAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString()
      }

      setSync(current => ({
        ...current,
        accounts: [...current.accounts.filter(acc => acc.platform !== 'instagram'), mockAccount],
        isEnabled: true
      }))

      toast.success('Instagram account connected successfully!')
      
    } catch (error) {
      toast.error('Failed to connect Instagram account')
    } finally {
      setIsConnecting(null)
    }
  }, [setSync])

  // Disconnect account
  const disconnectAccount = useCallback(async (platform: 'facebook' | 'instagram') => {
    setSync(current => ({
      ...current,
      accounts: current.accounts.filter(acc => acc.platform !== platform)
    }))
    
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account disconnected`)
  }, [setSync])

  // Manual sync campaigns and insights
  const syncData = useCallback(async () => {
    if (!sync.accounts.length) {
      toast.error('No connected accounts to sync')
      return
    }

    setIsSyncing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock campaign data
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp_1',
          platform: 'facebook',
          accountId: 'act_123456789',
          name: 'Lead Generation Campaign',
          status: 'active',
          objective: 'LEAD_GENERATION',
          budget: 1000,
          budgetType: 'daily',
          spend: 750,
          impressions: 25000,
          clicks: 1200,
          reach: 18000,
          conversions: 45,
          cpm: 30,
          cpc: 0.625,
          ctr: 4.8,
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'camp_2',
          platform: 'instagram',
          accountId: 'ig_123456789',
          name: 'Brand Awareness Campaign',
          status: 'active',
          objective: 'BRAND_AWARENESS',
          budget: 800,
          budgetType: 'daily',
          spend: 600,
          impressions: 35000,
          clicks: 2100,
          reach: 28000,
          conversions: 38,
          cpm: 17.14,
          cpc: 0.286,
          ctr: 6.0,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]

      // Mock insights data
      const mockInsights: AdInsight[] = []
      const days = 7
      
      mockCampaigns.forEach(campaign => {
        for (let i = 0; i < days; i++) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          mockInsights.push({
            campaignId: campaign.id,
            platform: campaign.platform,
            date: date.toISOString().split('T')[0],
            impressions: Math.floor(campaign.impressions / days) + Math.floor(Math.random() * 1000),
            clicks: Math.floor(campaign.clicks / days) + Math.floor(Math.random() * 100),
            spend: Math.floor(campaign.spend / days) + Math.floor(Math.random() * 50),
            reach: Math.floor(campaign.reach / days) + Math.floor(Math.random() * 500),
            conversions: Math.floor(campaign.conversions / days) + Math.floor(Math.random() * 5),
            videoViews: campaign.platform === 'instagram' ? Math.floor(Math.random() * 1000) : undefined,
            engagements: campaign.platform === 'instagram' ? Math.floor(Math.random() * 500) : undefined,
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 25),
            saves: campaign.platform === 'instagram' ? Math.floor(Math.random() * 75) : undefined
          })
        }
      })

      setSync(current => ({
        ...current,
        campaigns: mockCampaigns,
        insights: mockInsights,
        lastSync: new Date().toISOString()
      }))

      toast.success('Campaign data synced successfully!')
      
    } catch (error) {
      toast.error('Failed to sync campaign data')
    } finally {
      setIsSyncing(false)
    }
  }, [sync.accounts, setSync])

  // Get campaign performance summary
  const getCampaignSummary = useCallback(() => {
    const totalSpend = sync.campaigns.reduce((sum, campaign) => sum + campaign.spend, 0)
    const totalImpressions = sync.campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
    const totalClicks = sync.campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
    const totalConversions = sync.campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
    
    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalConversions,
      averageCTR: totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      averageCPC: totalClicks > 0 ? totalSpend / totalClicks : 0,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    }
  }, [sync.campaigns])

  return {
    sync,
    connectFacebook,
    connectInstagram,
    disconnectAccount,
    syncData,
    getCampaignSummary,
    isSyncing,
    isConnecting
  }
}