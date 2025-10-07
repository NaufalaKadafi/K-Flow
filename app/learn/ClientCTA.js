"use client";
import { useRouter } from "next/navigation";

export default function ClientCTA({ className = "", children }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => router.push("/timer")}
    >
      {children}
    </button>
  );
}
