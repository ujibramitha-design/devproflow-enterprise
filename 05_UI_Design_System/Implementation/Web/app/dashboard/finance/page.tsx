"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import { Wallet, TrendingUp, DollarSign, CreditCard, PiggyBank, Receipt } from "lucide-react"

export default function FinanceDashboardPage() {
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <Wallet className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Finance Hub</h1>
            <p className="text-devpro-muted-foreground">Financial Management & Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-devpro-primary/10 text-devpro-primary border-0">
            <DollarSign className="size-3 mr-1" />
            Finance Department
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
            <TrendingUp className="size-3 mr-1" />
            Real-time Financials
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
            <div className="text-2xl font-bold">Rp 124.5M</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">24 pending approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disbursed</CardTitle>
            <PiggyBank className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 89.2M</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">On-time payment rate</p>
          </CardContent>
        </Card>
      </div>

      <FirebaseStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                <h3 className="font-semibold text-devpro-primary mb-2">New Applications</h3>
                <p className="text-sm text-devpro-muted-foreground">48 new loan applications this week</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-devpro-primary/20 rounded-full h-2">
                    <div className="bg-devpro-primary h-2 rounded-full" style={{width: '68%'}}></div>
                  </div>
                  <span className="text-sm font-medium">68%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h3 className="font-semibold text-emerald-600 mb-2">Approved Loans</h3>
                <p className="text-sm text-devpro-muted-foreground">32 loans approved, totaling Rp 45.2M</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-emerald-500/20 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                  <span className="text-sm font-medium">82%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="font-semibold text-amber-600 mb-2">Pending Review</h3>
                <p className="text-sm text-devpro-muted-foreground">16 applications under review</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-amber-500/20 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '24%'}}></div>
                  </div>
                  <span className="text-sm font-medium">24%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Loan Size</span>
                <span className="text-sm font-bold text-devpro-primary">Rp 1.4M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Interest Rate Average</span>
                <span className="text-sm font-bold text-devpro-primary">12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Loan-to-Value Ratio</span>
                <span className="text-sm font-bold text-amber-600">78.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Debt Service Coverage</span>
                <span className="text-sm font-bold text-emerald-600">1.82x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Non-Performing Loans</span>
                <span className="text-sm font-bold text-emerald-600">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Capital Adequacy</span>
                <span className="text-sm font-bold text-devpro-primary">18.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
