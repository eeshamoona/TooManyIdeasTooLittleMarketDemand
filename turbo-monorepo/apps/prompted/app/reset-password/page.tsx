"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp } from "./action";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const emailParam = searchParams.get("email");
      const tokenParam = searchParams.get("token");

      if (!emailParam || !tokenParam) {
        setMessage("Invalid reset link.");
        setLoading(false);
        return;
      }

      const result = await verifyOtp(tokenParam, emailParam);
      if (result === "SUCCESS") {
        setEmail(emailParam);
        setToken(tokenParam); // Save token in state
        setIsVerified(true);
      } else {
        setMessage("Invalid or expired token.");
        setIsVerified(false);
      }
      setLoading(false);
    };

    // Run verification only on the initial render
    verifyToken();
  }, [searchParams]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!email || !token) {
      setMessage("Invalid request. Please try again.");
      return;
    }

    try {
      const response = await fetch(`/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      });

      if (response.ok) {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const result = await response.json();
        setMessage(result.error || "Failed to reset password.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Reset Password</h1>
      {loading && <p>Verifying reset link...</p>}
      {!loading && message && <p>{message}</p>}
      {!loading && isVerified && (
        <>
          <p>Resetting password for: {email}</p>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <button
            onClick={handleResetPassword}
            style={{ padding: "10px 20px" }}
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}
