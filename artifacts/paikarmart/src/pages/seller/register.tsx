import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegisterSeller } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function SellerRegisterPage() {
  const { mutate: registerSeller, isPending } = useRegisterSeller();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // In a real app, we would get the actual user ID from context
    // and pass the proper payload
    registerSeller({
      id: "user-1",
      data: {
        shopName: formData.get("shopName") as string,
        businessType: formData.get("businessType") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        district: formData.get("district") as string,
      }
    }, {
      onSuccess: () => {
        toast.success("Registration submitted successfully! Pending approval.");
        setLocation("/");
      },
      onError: () => {
        toast.error("Failed to register. Please try again.");
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Become a Seller</h1>
          <p className="text-muted-foreground">Join PaikarMart and reach millions of customers across Bangladesh.</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop / Business Name <span className="text-destructive">*</span></Label>
                <Input id="shopName" name="shopName" required placeholder="E.g. Rahim Traders" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type <span className="text-destructive">*</span></Label>
                <select 
                  id="businessType" 
                  name="businessType" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a type...</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="retailer">Retailer</option>
                  <option value="brand_seller">Brand Seller</option>
                  <option value="local_shop">Local Shop</option>
                  <option value="dropship">Dropshipper</option>
                  <option value="service">Service Provider</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                  <Input id="phone" name="phone" required placeholder="01XXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="example@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                  <Input id="district" name="district" required placeholder="E.g. Dhaka" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
                  <Input id="address" name="address" required placeholder="Street, Thana, Area" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trade License / Documents (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <div className="text-sm font-medium mb-1">Click to upload documents</div>
                  <div className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Apply for Seller Account"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By applying, you agree to our <span className="text-primary hover:underline cursor-pointer">Seller Terms & Conditions</span>.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
