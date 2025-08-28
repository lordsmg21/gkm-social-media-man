import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Facebook, Instagram, TrendingUp, DollarSign, Eye, Users, MousePointer } from 'lucide-react'
import { useSocialMediaSync } from '@/hooks'
import type { Campaign, AdInsight } from '@/types'

interface CampaignAnalyticsProps {
  clientId?: string // If provided, filter for specific client
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ clientId }) => {
  const { sync } = useSocialMediaSync()

  // Filter campaigns and insights for specific client if provided
  const campaigns = useMemo(() => {
    return clientId 
      ? sync.campaigns.filter(campaign => campaign.clientId === clientId)
      : sync.campaigns
  }, [sync.campaigns, clientId])

  const insights = useMemo(() => {
    const campaignIds = campaigns.map(c => c.id)
    return sync.insights.filter(insight => campaignIds.includes(insight.campaignId))
  }, [sync.insights, campaigns])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0)
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
    const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
    const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0)
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
    
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalReach,
      totalConversions,
      avgCTR,
      avgCPC,
      conversionRate
    }
  }, [campaigns])

  // Prepare chart data
  const dailyInsightsData = useMemo(() => {
    const groupedByDate = insights.reduce((acc, insight) => {
      const date = insight.date
      if (!acc[date]) {
        acc[date] = {
          date,
          facebook: { spend: 0, impressions: 0, clicks: 0, conversions: 0 },
          instagram: { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
        }
      }
      
      const platform = insight.platform
      acc[date][platform].spend += insight.spend
      acc[date][platform].impressions += insight.impressions
      acc[date][platform].clicks += insight.clicks
      acc[date][platform].conversions += insight.conversions
      
      return acc
    }, {} as any)

    return Object.values(groupedByDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        facebookSpend: item.facebook.spend,
        instagramSpend: item.instagram.spend,
        facebookImpressions: item.facebook.impressions,
        instagramImpressions: item.instagram.impressions,
        facebookClicks: item.facebook.clicks,
        instagramClicks: item.instagram.clicks,
        facebookConversions: item.facebook.conversions,
        instagramConversions: item.instagram.conversions,
      }))
  }, [insights])

  // Platform distribution data
  const platformData = useMemo(() => {
    const facebook = campaigns.filter(c => c.platform === 'facebook')
    const instagram = campaigns.filter(c => c.platform === 'instagram')
    
    return [
      {
        name: 'Facebook',
        value: facebook.reduce((sum, c) => sum + c.spend, 0),
        campaigns: facebook.length,
        color: '#1877F2'
      },
      {
        name: 'Instagram',
        value: instagram.reduce((sum, c) => sum + c.spend, 0),
        campaigns: instagram.length,
        color: '#E4405F'
      }
    ].filter(item => item.value > 0)
  }, [campaigns])

  if (campaigns.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Campaign Analytics
          </CardTitle>
          <CardDescription>
            {clientId ? 'No campaigns found for this client.' : 'No campaign data available. Connect your social media accounts to view analytics.'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${summaryMetrics.totalSpend.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{summaryMetrics.totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{summaryMetrics.totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{summaryMetrics.totalConversions.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average CTR</p>
              <p className="text-xl font-semibold">{summaryMetrics.avgCTR.toFixed(2)}%</p>
              <Progress value={Math.min(summaryMetrics.avgCTR * 20, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average CPC</p>
              <p className="text-xl font-semibold">${summaryMetrics.avgCPC.toFixed(2)}</p>
              <Progress value={Math.max(100 - (summaryMetrics.avgCPC * 50), 0)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-semibold">{summaryMetrics.conversionRate.toFixed(2)}%</p>
              <Progress value={summaryMetrics.conversionRate * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="spend">Spend Analysis</TabsTrigger>
          <TabsTrigger value="platforms">Platform Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Daily Performance Trends</CardTitle>
              <CardDescription>
                Clicks and conversions over time by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dailyInsightsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="facebookClicks" 
                    stroke="#1877F2" 
                    strokeWidth={2}
                    name="Facebook Clicks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="instagramClicks" 
                    stroke="#E4405F" 
                    strokeWidth={2}
                    name="Instagram Clicks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="facebookConversions" 
                    stroke="#42D3FF" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Facebook Conversions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="instagramConversions" 
                    stroke="#FF6B6B" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Instagram Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spend">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Daily Spend Analysis</CardTitle>
              <CardDescription>
                Ad spend comparison between Facebook and Instagram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dailyInsightsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spend']} />
                  <Bar dataKey="facebookSpend" fill="#1877F2" name="Facebook" />
                  <Bar dataKey="instagramSpend" fill="#E4405F" name="Instagram" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Spend by Platform</CardTitle>
                <CardDescription>
                  Distribution of total ad spend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spend']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Platform Summary</CardTitle>
                <CardDescription>
                  Campaign overview by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformData.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {platform.name === 'Facebook' ? (
                          <Facebook className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Instagram className="w-6 h-6 text-pink-600" />
                        )}
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {platform.campaigns} campaign{platform.campaigns !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${platform.value.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total Spend</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Detailed view of all synchronized campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {campaign.platform === 'facebook' ? (
                    <Facebook className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Instagram className="w-5 h-5 text-pink-600" />
                  )}
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.objective} • Budget: ${campaign.budget} ({campaign.budgetType})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p>Spend: <span className="font-medium">${campaign.spend.toFixed(2)}</span></p>
                    <p>Clicks: <span className="font-medium">{campaign.clicks.toLocaleString()}</span></p>
                  </div>
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                    className={
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : campaign.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}