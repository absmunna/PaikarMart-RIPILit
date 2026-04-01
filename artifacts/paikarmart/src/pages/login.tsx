import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: "user-1", name: "Test Buyer", role: "buyer", phone });
    setLocation("/");
  };

  const handleAdminLogin = () => {
    login({ id: "admin-1", name: "Admin", role: "admin" });
    setLocation("/admin/dashboard");
  };

  const handleSellerLogin = () => {
    login({ id: "seller-1", name: "Test Seller", role: "seller" });
    setLocation("/seller/dashboard");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login to PaikarMart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                    +880
                  </div>
                  <Input 
                    id="phone" 
                    placeholder="1XXXXXXXXX" 
                    className="rounded-l-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Send OTP</Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Test Accounts (For demo)
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={handleSellerLogin}>Login as Seller</Button>
                <Button variant="outline" onClick={handleAdminLogin}>Login as Admin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
