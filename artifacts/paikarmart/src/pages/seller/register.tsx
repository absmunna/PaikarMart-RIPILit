import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRegisterSeller } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Package, Tag, Building2, Store, TrendingUp, HeadphonesIcon,
  Users, CheckCircle, Upload, MapPin, Phone, Mail, FileText
} from "lucide-react";

const BUSINESS_TYPES = [
  { value: "wholesaler", label: "Wholesaler", icon: Package, desc: "Sell in bulk to retailers & businesses", color: "border-orange-500/35 bg-orange-500/10 text-orange-400" },
  { value: "retailer", label: "Retailer", icon: Tag, desc: "Sell directly to end customers", color: "border-blue-500/35 bg-blue-500/10 text-blue-400" },
  { value: "brand_seller", label: "Brand Seller", icon: Building2, desc: "Official brand or authorized dealer", color: "border-purple-500/35 bg-purple-500/10 text-purple-400" },
  { value: "local_shop", label: "Local Shop", icon: Store, desc: "Physical store in your area", color: "border-yellow-500/35 bg-yellow-500/10 text-yellow-400" },
  { value: "dropship", label: "Dropshipper", icon: TrendingUp, desc: "Sell without holding inventory", color: "border-teal-500/35 bg-teal-500/10 text-teal-400" },
  { value: "service", label: "Service Provider", icon: HeadphonesIcon, desc: "Offer professional services", color: "border-pink-500/35 bg-pink-500/10 text-pink-400" },
  { value: "b2b_seller", label: "B2B Supplier", icon: Users, desc: "Sell wholesale to PaikarMart businesses", color: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400", isNew: true },
];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
];

const CATEGORIES = [
  "Electronics", "Fashion", "Grocery", "Health & Beauty",
  "Home & Living", "Sports & Outdoors", "Toys & Games",
  "Services", "Digital Products", "Wholesale", "Other"
];

export default function SellerRegisterPage() {
  const { mutate: registerSeller, isPending } = useRegisterSeller();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedType) { toast.error("Please select a business type"); return; }
    const formData = new FormData(e.currentTarget);
    registerSeller({
      id: "user-1",
      data: {
        shopName: formData.get("shopName") as string,
        businessType: selectedType,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        district: formData.get("district") as string,
      }
    }, {
      onSuccess: () => {
        toast.success("Application submitted! Our team will review within 24 hours.");
        setStep(3);
      },
      onError: () => {
        toast.error("Failed to register. Please try again.");
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 mb-3">Join 500+ Active Sellers</Badge>
          <h1 className="text-3xl font-extrabold text-white mb-3">Start Selling on PaikarMart</h1>
          <p className="text-white/45">Reach thousands of buyers across Bangladesh. Fast approval, no upfront fee.</p>
        </div>

        {/* Steps indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? "bg-green-600 text-white" : "bg-white/5 text-white/35"
                }`}>{s}</div>
                <span className={`text-sm font-medium hidden sm:block ${step >= s ? "text-green-700" : "text-white/35"}`}>
                  {s === 1 ? "Business Type" : "Details"}
                </span>
                {s < 2 && <div className={`w-8 h-0.5 ${step > s ? "bg-green-600" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Business Type Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-white/85 mb-4">Select your business type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {BUSINESS_TYPES.map(bt => {
                const Icon = bt.icon;
                const isSelected = selectedType === bt.value;
                return (
                  <button key={bt.value} type="button" onClick={() => setSelectedType(bt.value)}
                    className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected ? `${bt.color} border-2 shadow-sm` : "border-white/10 bg-white/5 hover:border-gray-300 hover:shadow-sm"
                    }`}>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/60" : "bg-white/5"
                    }`}>
                      <Icon className={`h-5 w-5 ${isSelected ? "" : "text-white/45"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{bt.label}</p>
                        {bt.isNew && <Badge className="bg-green-600 text-white text-[9px] py-0 px-1.5">NEW</Badge>}
                      </div>
                      <p className="text-xs mt-0.5 opacity-80">{bt.desc}</p>
                    </div>
                    {isSelected && <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />}
                  </button>
                );
              })}
            </div>

            {selectedType === "b2b_seller" && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 mb-6 text-sm text-emerald-300">
                <strong>B2B Supplier Benefits:</strong> Access to bulk orders from verified businesses, priority listing, dedicated account manager, and higher commission rates.
              </div>
            )}

            <Button
              onClick={() => { if (!selectedType) { toast.error("Select a business type first"); return; } setStep(2); }}
              className="w-full h-11 font-semibold text-white"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 40%))" }}
              disabled={!selectedType}
            >
              Continue →
            </Button>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && (
          <Card className="border-white/8 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 p-3 bg-white/3 rounded-xl">
                {(() => {
                  const bt = BUSINESS_TYPES.find(b => b.value === selectedType);
                  const Icon = bt?.icon || Store;
                  return (
                    <>
                      <Icon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-white/70">Registering as: <strong>{bt?.label}</strong></span>
                    </>
                  );
                })()}
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="ml-auto text-white/45 text-xs">Change</Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-sm font-medium text-white/70 mb-1.5 block">
                    <FileText className="h-3.5 w-3.5 inline mr-1 text-green-600" /> Shop / Business Name *
                  </Label>
                  <Input name="shopName" required placeholder="E.g. Rahim Traders, Tech Solutions Ltd." className="border-white/10 focus:border-green-500" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-white/70 mb-1.5 block">Product Category *</Label>
                  <select
                    value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/5"
                    required
                  >
                    <option value="">Select your main category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-white/70 mb-1.5 block">
                      <Phone className="h-3.5 w-3.5 inline mr-1 text-green-600" /> Phone Number *
                    </Label>
                    <Input name="phone" required placeholder="01XXXXXXXXX" className="border-white/10 focus:border-green-500" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-white/70 mb-1.5 block">
                      <Mail className="h-3.5 w-3.5 inline mr-1 text-green-600" /> Email Address
                    </Label>
                    <Input name="email" type="email" placeholder="business@example.com" className="border-white/10 focus:border-green-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-white/70 mb-1.5 block">
                      <MapPin className="h-3.5 w-3.5 inline mr-1 text-green-600" /> District *
                    </Label>
                    <select name="district" required
                      className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/5">
                      <option value="">Select district...</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-white/70 mb-1.5 block">Full Business Address *</Label>
                    <Input name="address" required placeholder="Street, Thana, Area" className="border-white/10 focus:border-green-500" />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <Label className="text-sm font-medium text-white/70 mb-1.5 block">Documents (NID / Trade License)</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                    <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-white/70 mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-white/35">PDF, JPG, PNG up to 5MB • Optional for faster approval</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 font-semibold" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
                <p className="text-xs text-center text-white/35">
                  By applying, you agree to our <a href="/terms" className="text-green-600 hover:underline">Seller Terms & Conditions</a>
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
            <p className="text-white/45 mb-2 max-w-md mx-auto">Your seller application has been received. Our team will review and get back to you within <strong>24 hours</strong>.</p>
            <p className="text-sm text-green-600 mb-8">Check your phone/email for confirmation.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setLocation("/")}>Go to Home</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setLocation("/login")}>Login to Dashboard</Button>
            </div>
          </div>
        )}

        {/* Benefits */}
        {step === 1 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Free Registration", desc: "No fees to join PaikarMart" },
              { title: "Fast Approval", desc: "Get approved within 24 hours" },
              { title: "Grow Fast", desc: "Reach 100K+ buyers across BD" },
            ].map(b => (
              <div key={b.title} className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-sm text-white/85">{b.title}</p>
                <p className="text-xs text-white/45 mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
