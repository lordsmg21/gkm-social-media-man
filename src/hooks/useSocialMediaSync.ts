import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

  const [sync, setSync, deleteSync] = useKV<SocialMediaSync>('social-media-sync', {

    accounts: [],
    insights: []

  const [isSyncing, setIsSyncing] =
  // Mock Faceboo
    setIsConnecti
    try {
      await new 
    

        accountId: 'act_123456789',
        accessToken: 'mock_facebook_token', // In r

      }
      setSync(current => ({
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
        ...current,
    }
  }, [setSync])

      console.error('Failed to connect Instagram account:',
    setIsConnecting('instagram')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock account data - in real implementation, get this from Instagram Graph API
      const mockAccount: SocialMediaAccount = {
        id: 'ig_' + Date.now(),
        ),
        accountId: 'ig_123456789',
        ),
        accessToken: 'mock_instagram_token', // In real app, store securely
            campaign.id ==
        connectedAt: new Date().toISOString(),
        )
      }

      setSync(current => ({
        ...current,
        accounts: [...current.accounts.filter(acc => acc.platform !== 'instagram'), mockAccount]
      }))

      toast.success('Instagram Business Account connected successfully!')
    } catch (error) {
      console.error('Failed to connect Instagram account:', error)
      toast.error('Failed to connect Instagram account')
    }
      setIsConnecting(null)
    
  }, [setSync])

  const disconnectAccount = useCallback(async (accountId: string) => {
      con
      setSync(current => ({
      for (const ac
        accounts: current.accounts.map(acc => 
        
            ? { ...acc, isConnected: false, accessToken: undefined }
          
          
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
     
  }, [sync.accounts, setSync])

  const syncCampaignData = useCallback(async (force = false) => {
              impressions: Math.flo
    
    const connectedAccounts = sync.accounts.filter(acc => acc.isConnected)
    if (connectedAccounts.length === 0) {
                videoViews: Math.floor(Math.random
      return
     

            }
    
         
      // Simulate API calls to fetch campaign data
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock campaign data - in real implementation, fetch from Facebook/Instagram APIs
      const mockCampaigns: Campaign[] = []
        accounts: current.accounts.map(acc
      
      for (const account of connectedAccounts) {
        // Generate mock campaigns for each account
        const campaignCount = Math.floor(Math.random() * 5) + 1
        
        for (let i = 0; i < campaignCount; i++) {
          const campaignId = `${account.platform}_campaign_${Date.now()}_${i}`



























































































































