import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useGetUserWallet } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="font-medium text-primary-foreground/80">Available Balance</p>
                <WalletIcon className="h-5 w-5 text-primary-foreground/80" />
              </div>
              <h2 className="text-4xl font-bold mb-4">৳{wallet?.balance.toLocaleString() || 0}</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="w-full text-xs" disabled>
                  Withdraw (Coming Soon)
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" disabled>
                  Deposit (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-muted-foreground">Total Earned</p>
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold">৳{wallet?.totalEarned.toLocaleString() || 0}</h3>
              <p className="text-sm text-muted-foreground mt-2">Lifetime rewards and cashbacks</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-muted-foreground">Investment Value</p>
                <ArrowUpRight className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold">৳{wallet?.investmentValue.toLocaleString() || 0}</h3>
              <p className="text-sm text-muted-foreground mt-2">Estimated account value</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <Card>
          <CardContent className="p-0">
            {wallet?.transactions?.length ? (
              <div className="divide-y">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'reward' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {tx.type === 'reward' ? <ArrowDownRight className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type} {tx.description ? `- ${tx.description}` : ""}</p>
                        <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === 'reward' ? 'text-green-600' : ''}`}>
                      {tx.type === 'reward' ? '+' : ''}৳{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
