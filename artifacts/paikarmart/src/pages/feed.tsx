import React from "react";
import { useLocation } from "wouter";
import HomePage from "./index";

// Feed page mirrors the Home page (both show the product feed)
export default function FeedPage() {
  return <HomePage />;
}
