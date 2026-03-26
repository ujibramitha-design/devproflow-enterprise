"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import { PieChart, TrendingUp, Users, DollarSign, BarChart3, Target } from "lucide-react"

export default function BODDashboardPage() {
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <PieChart className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Executive Dashboard</h1>
            <p className="text-devpro-muted-foreground">Board of Directors - Strategic Overview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-devpro-primary/10 text-devpro-primary border-0">
            <Target className="size-3 mr-1" />
            BOD Level
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
            <TrendingUp className="size-3 mr-1" />
            Live Analytics
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 45.2B</div>
            <p className="text-xs text-muted-foreground">+12.5% from last quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">3 launching this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,842</div>
            <p className="text-xs text-muted-foreground">+18.2% growth rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Share</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% this year</p>
          </CardContent>
        </Card>
      </div>

      <FirebaseStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                <h3 className="font-semibold text-devpro-primary mb-2">Digital Transformation</h3>
                <p className="text-sm text-devpro-muted-foreground">Complete digital integration across all departments</p>
                <div className="mt-2 w-full bg-devpro-primary/20 rounded-full h-2">
                  <div className="bg-devpro-primary h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h3 className="font-semibold text-emerald-600 mb-2">Market Expansion</h3>
                <p className="text-sm text-devpro-muted-foreground">Enter 3 new regional markets</p>
                <div className="mt-2 w-full bg-emerald-500/20 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="font-semibold text-amber-600 mb-2">Customer Experience</h3>
                <p className="text-sm text-devpro-muted-foreground">Achieve 95% customer satisfaction</p>
                <div className="mt-2 w-full bg-amber-500/20 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ROI</span>
                <span className="text-sm font-bold text-emerald-600">24.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Acquisition Cost</span>
                <span className="text-sm font-bold text-devpro-primary">Rp 2.3M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Lifetime Value</span>
                <span className="text-sm font-bold text-devpro-primary">Rp 45.6M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Net Promoter Score</span>
                <span className="text-sm font-bold text-emerald-600">72</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Operational Efficiency</span>
                <span className="text-sm font-bold text-amber-600">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
