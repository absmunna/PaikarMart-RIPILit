import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useGetUserWallet } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight,
  Clock, TrendingUp, Lock, Gift, BarChart3, Coins
} from "lucide-react";

const MOCK_GRAPH = [30, 55, 40, 70, 60, 85, 75, 90, 80, 95, 88, 100];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BarGraph({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-32 relative">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-green-600 to-emerald-400 transition-all duration-500 hover:from-green-500 hover:to-emerald-300 cursor-pointer"
            style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
            title={`${labels[i]}: ৳${v * 1000}`}
          />
          <span className="text-[9px] text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuth();

  if (user?.id === "guest") {
    return <Redirect to="/login" />;
  }

  const { data: wallet, isLoading } = useGetUserWallet(user?.id || "user-1");

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Track your balance, rewards, and investment value</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-700 to-emerald-600 text-white border-none shadow-lg md:col-span-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Available Balance</p>
                  <h2 className="text-4xl font-extrabold">৳{wallet?.balance?.toLocaleString() || "0"}</h2>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <WalletIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-2 text-center text-xs cursor-not-allowed opacity-60">
                  <Lock className="h-3 w-3 inline mr-1" /> Withdraw
                  <div className="text-[9px] mt-0.5 text-white/60">Coming Soon</div>
                </div>
                <div className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-2 text-center text-xs cursor-not-allowed opacity-60">
                  <Lock className="h-3 w-3 inline mr-1" /> Deposit
                  <div className="text-[9px] mt-0.5 text-white/60">Coming Soon</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-green-500" /> Total Earned
                </p>
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">৳{wallet?.totalEarned?.toLocaleString() || "0"}</h3>
              <p className="text-xs text-gray-500 mt-2">From rewards, cashbacks & referrals</p>
              <Badge className="mt-3 bg-green-50 text-green-700 border-green-100 text-[10px]">2–3% reward per order</Badge>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-500" /> Investment Value
                </p>
                <ArrowUpRight className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">৳{wallet?.investmentValue?.toLocaleString() || "0"}</h3>
              <p className="text-xs text-gray-500 mt-2">Estimated account value</p>
              <Badge className="mt-3 bg-blue-50 text-blue-700 border-blue-100 text-[10px]">
                <Lock className="h-2.5 w-2.5 mr-1 inline" /> Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" /> Monthly Activity
                </h3>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-100 text-[10px]">Preview Data</Badge>
              </div>
              <BarGraph data={MOCK_GRAPH} labels={MONTHS} />
              <p className="text-xs text-gray-400 mt-3 text-center">Real-time analytics • Coming Soon</p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Coins className="h-4 w-4 text-orange-500" /> Reward Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Order Rewards (2-3%)", value: 65, color: "bg-green-500" },
                  { label: "Referral Bonus", value: 20, color: "bg-blue-500" },
                  { label: "Platform Cashback", value: 15, color: "bg-purple-500" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">Analytics feature • Coming Soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <h2 className="text-lg font-bold mb-4 text-gray-900">Transaction History</h2>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-0">
            {wallet?.transactions?.length ? (
              <div className="divide-y">
                {wallet.transactions.map(tx => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === "reward" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {tx.type === "reward" ? <Gift className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800 capitalize">
                          {tx.type} {tx.description ? `— ${tx.description}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-base ${tx.type === "reward" ? "text-green-600" : "text-gray-800"}`}>
                      {tx.type === "reward" ? "+" : ""}৳{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <WalletIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">Start shopping to earn rewards!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
