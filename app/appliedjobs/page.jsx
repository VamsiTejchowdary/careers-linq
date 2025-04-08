"use client";
import Appliedjobs from "../../components/appliedjobs";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useAuth
  }

  return <Appliedjobs />;
}