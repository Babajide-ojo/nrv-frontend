"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import HomePageLayout from "./components/layout/HomePageLayout";
import LandingPage from "./components/screens/landing-page/LandingPage";

export default function Index() {
  const [code, setCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const correctCode = "phlip2025"; // Change this to your desired code

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === correctCode) {
      setAccessGranted(true);
    } else {
      alert("Incorrect code. Please try again.");
    }
  };

  return (
    <div>
      {!accessGranted ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
          >
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold">Enter Access Code</h2>
              <p className="text-sm text-gray-500">This page is restricted</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Access Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </div>
      ) : (
        <HomePageLayout>
          <LandingPage />
        </HomePageLayout>
      )}
    </div>
  );
}
