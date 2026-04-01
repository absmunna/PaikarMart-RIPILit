import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (user?.id === "guest") {
    return <Redirect to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={user?.phone || "+8801234567890"} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email || ""} placeholder="Add your email" />
                </div>
              </div>
              <Button type="button" className="mt-4">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Button variant="destructive" onClick={logout} className="w-full">
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
