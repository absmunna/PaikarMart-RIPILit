import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Bell, Menu, User, MapPin, Globe } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [location, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">Home</Link>
                <Link href="/products" className="text-lg font-semibold">Products</Link>
                <Link href="/vendors" className="text-lg font-semibold">Vendors</Link>
                {user?.role === "seller" && (
                  <Link href="/seller/dashboard" className="text-lg font-semibold">Seller Dashboard</Link>
                )}
                {user?.role === "admin" && (
                  <Link href="/admin/dashboard" className="text-lg font-semibold">Admin Dashboard</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">PaikarMart</span>
          </Link>
        </div>

        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search products, categories..." 
              className="w-full pl-10 pr-4 rounded-full bg-muted/50 border-transparent focus:bg-background"
            />
          </div>
          <Button variant="outline" className="hidden lg:flex gap-2">
            <MapPin className="h-4 w-4" />
            <span>Select Location</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>বাংলা</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user?.id !== "guest" ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/orders")}>Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/wallet")}>Wallet</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setLocation("/login")}>Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/register")}>Register</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
