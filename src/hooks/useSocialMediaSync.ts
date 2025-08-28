import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { SocialMediaAccount, Campaign, AdInsight, SocialMediaSync } from '../types'

export const useSocialMediaSync = () => {
  const [sync, setSync, deleteSync] = useKV<SocialMediaSync>('social-media-sync', {
    isEnabled: false,
    syncInterval: 15, // 15 minutes
    lastSync: '',
    accounts: [],
    campaigns: [],
    insights: []
  })

  const [isConnecting, setIsConnecting] = useState<'facebook' | 'instagram' | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Mock Facebook/Instagram API connection (in real implementation, use Facebook Graph API)
  const connectFacebookAccount = useCallback(async () => {
    setIsConnecting('facebook')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock account data - in real implementation, get this from Facebook Graph API
      const mockAccount: SocialMediaAccount = {
        id: 'fb_' + Date.now(),
        platform: 'facebook',
        accountId: 'act_123456789',
        accountName: 'GKM Media - Facebook Ads',
        accessToken: 'mock_facebook_token', // In real app, store securely
        isConnected: true,
        connectedAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString()
      }

      setSync(current => ({
        ...current,
        accounts: [...current.accounts.filter(acc => acc.platform !== 'facebook'), mockAccount]
      }))

      toast.success('Facebook Ad Account connected successfully!')
    } catch (error) {
      console.error('Failed to connect Facebook account:', error)
      toast.error('Failed to connect Facebook account')
    } finally {
      setIsConnecting(null)
    }
  }, [setSync])

  const connectInstagramAccount = useCallback(async () => {
    setIsConnecting('instagram')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock account data - in real implementation, get this from Instagram Graph API
      const mockAccount: SocialMediaAccount = {
        id: 'ig_' + Date.now(),
        platform: 'instagram',
        accountId: 'ig_123456789',
        accountName: 'GKM Media - Instagram Business',
        accessToken: 'mock_instagram_token', // In real app, store securely
        isConnected: true,
        connectedAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString()
      }

      setSync(current => ({
        ...current,
        accounts: [...current.accounts.filter(acc => acc.platform !== 'instagram'), mockAccount]
      }))

      toast.success('Instagram Business Account connected successfully!')
    } catch (error) {
      console.error('Failed to connect Instagram account:', error)
      toast.error('Failed to connect Instagram account')
    } finally {
      setIsConnecting(null)
    }
  }, [setSync])

  const disconnectAccount = useCallback(async (accountId: string) => {
    try {
      setSync(current => ({
        ...current,
        accounts: current.accounts.map(acc => 
          acc.id === accountId 
            ? { ...acc, isConnected: false, accessToken: undefined }
            : acc
        ),
        campaigns: current.campaigns.filter(campaign => 
          current.accounts.find(acc => acc.id === accountId)?.accountId !== campaign.accountId
        ),
        insights: current.insights.filter(insight => 
          !current.campaigns.some(campaign => 
            campaign.id === insight.campaignId && 
            current.accounts.find(acc => acc.id === accountId)?.accountId === campaign.accountId
          )
        )
      }))

      const account = sync.accounts.find(acc => acc.id === accountId)
      toast.success(`${account?.platform.charAt(0).toUpperCase()}${account?.platform.slice(1)} account disconnected`)
    } catch (error) {
      console.error('Failed to disconnect account:', error)
      toast.error('Failed to disconnect account')
    }
  }, [sync.accounts, setSync])

  const syncCampaignData = useCallback(async (force = false) => {
    if (isSyncing && !force) return
    
    const connectedAccounts = sync.accounts.filter(acc => acc.isConnected)
    if (connectedAccounts.length === 0) {
      toast.error('No connected accounts to sync')
      return
    }

    setIsSyncing(true)
    
    try {
      // Simulate API calls to fetch campaign data
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock campaign data - in real implementation, fetch from Facebook/Instagram APIs
      const mockCampaigns: Campaign[] = []
      const mockInsights: AdInsight[] = []
      
      for (const account of connectedAccounts) {
        // Generate mock campaigns for each account
        const campaignCount = Math.floor(Math.random() * 5) + 1
        
        for (let i = 0; i < campaignCount; i++) {
          const campaignId = `${account.platform}_campaign_${Date.now()}_${i}`
          
          const campaign: Campaign = {
            id: campaignId,
            platform: account.platform,
            accountId: account.accountId,
            name: `${account.platform === 'facebook' ? 'FB' : 'IG'} Campaign ${i + 1}`,
            status: ['active', 'paused', 'completed'][Math.floor(Math.random() * 3)] as any,
            objective: account.platform === 'facebook' ? 'CONVERSIONS' : 'REACH',
            budget: Math.floor(Math.random() * 1000) + 100,
            budgetType: Math.random() > 0.5 ? 'daily' : 'lifetime',
            spend: Math.floor(Math.random() * 800) + 50,
            impressions: Math.floor(Math.random() * 10000) + 1000,
            clicks: Math.floor(Math.random() * 500) + 50,
            reach: Math.floor(Math.random() * 8000) + 500,
            conversions: Math.floor(Math.random() * 50) + 5,
            cpm: Math.round((Math.random() * 10 + 2) * 100) / 100,
            cpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
            ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
            startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          mockCampaigns.push(campaign)
          
          // Generate mock insights for the last 7 days
          for (let day = 0; day < 7; day++) {
            const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000)
            
            const insight: AdInsight = {
              campaignId: campaignId,
              platform: account.platform,
              date: date.toISOString().split('T')[0],
              impressions: Math.floor(Math.random() * 2000) + 100,
              clicks: Math.floor(Math.random() * 100) + 10,
              spend: Math.floor(Math.random() * 150) + 10,
              reach: Math.floor(Math.random() * 1500) + 100,
              conversions: Math.floor(Math.random() * 10) + 1,
              ...(account.platform === 'instagram' && {
                videoViews: Math.floor(Math.random() * 500) + 50,
                engagements: Math.floor(Math.random() * 200) + 20,
                comments: Math.floor(Math.random() * 50) + 5,
                shares: Math.floor(Math.random() * 30) + 3,
                saves: Math.floor(Math.random() * 40) + 4,
              })
            }
            
            mockInsights.push(insight)
          }
        }
      }
      
      setSync(current => ({
        ...current,
        campaigns: mockCampaigns,
        insights: mockInsights,
        lastSync: new Date().toISOString(),
        accounts: current.accounts.map(acc => 
          connectedAccounts.find(ca => ca.id === acc.id)
            ? { ...acc, lastSyncAt: new Date().toISOString() }
            : acc
        )
      }))

      toast.success(`Synced ${mockCampaigns.length} campaigns from ${connectedAccounts.length} account(s)`)
    } catch (error) {
      console.error('Failed to sync campaign data:', error)
      toast.error('Failed to sync campaign data')
    } finally {
      setIsSyncing(false)
    }
  }, [sync.accounts, isSyncing, setSync])

  const toggleAutoSync = useCallback((enabled: boolean) => {
    setSync(current => ({
      ...current,
      isEnabled: enabled
    }))
    
    if (enabled) {
      toast.success('Auto-sync enabled')
    } else {
      toast.info('Auto-sync disabled')
    }
  }, [setSync])

  const updateSyncInterval = useCallback((interval: number) => {
    setSync(current => ({
      ...current,
      syncInterval: interval
    }))
    
    toast.success(`Sync interval updated to ${interval} minutes`)
  }, [setSync])

  // Auto-sync functionality
  useEffect(() => {
    if (!sync.isEnabled) return
    
    const interval = setInterval(() => {
      const lastSync = sync.lastSync ? new Date(sync.lastSync) : new Date(0)
      const now = new Date()
      const minutesSinceLastSync = (now.getTime() - lastSync.getTime()) / (1000 * 60)
      
      if (minutesSinceLastSync >= sync.syncInterval) {
        syncCampaignData(true)
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [sync.isEnabled, sync.syncInterval, sync.lastSync, syncCampaignData])

  return {
    sync,
    isConnecting,
    isSyncing,
    connectFacebookAccount,
    connectInstagramAccount,
    disconnectAccount,
    syncCampaignData,
    toggleAutoSync,
    updateSyncInterval,
  }
}