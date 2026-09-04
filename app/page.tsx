"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      router.push("/");
    } else {
      // If not logged in, redirect to login
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black">
      <div className="text-center">
        <div className="loader" />
        <p className="text-white-faint mt-4">Redirecting...</p>
      </div>

      <style jsx>{`
        .min-h-screen {
          min-height: 100vh;
        }

        .bg-matte-black {
          background: #0a0a0a;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .text-white-faint {
          color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}