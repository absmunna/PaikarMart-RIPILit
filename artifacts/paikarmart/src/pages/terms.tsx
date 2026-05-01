import React from "react";
import { Layout } from "@/components/layout/Layout";

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-slate dark:prose-invert">
        <h1>Terms and Conditions</h1>
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. General Rules</h2>
        <p>Welcome to PaikarMart. By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>
        
        <h2>2. Customer Rules</h2>
        <ul>
          <li>Customers must provide accurate information during registration and checkout.</li>
          <li>Cash on Delivery orders must be paid in full upon receiving the items.</li>
          <li>Fake orders or repeated refusal to accept Cash on Delivery orders may result in account suspension.</li>
        </ul>
        
        <h2>3. Seller Rules</h2>
        <ul>
          <li>Sellers must provide valid business documents during registration.</li>
          <li>Listing counterfeit or prohibited items is strictly forbidden.</li>
          <li>Sellers must fulfill confirmed orders within the stipulated timeframe.</li>
          <li>Sellers are responsible for the quality and accuracy of their product descriptions.</li>
        </ul>

        <h2>4. Platform Fees and Payments</h2>
        <p>PaikarMart reserves the right to charge platform fees or commissions on successful sales. Payment terms for sellers will be outlined in the Seller Dashboard upon approval.</p>

        <h2>5. Dispute Resolution</h2>
        <p>In case of disputes between buyers and sellers, PaikarMart acts as an intermediary. Our support team will investigate the issue and make a binding decision based on available evidence.</p>
      </div>
    </Layout>
  );
}
