"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAppStore } from "@/lib/store";
import { loginSchema } from "@/lib/utils/validation";

export default function LoginPage() {
  const { login, users } = useAppStore();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("sarah@bashar.ai");
  const [password, setPassword] = useState("");

  // Signup Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      setFormError("");
      return;
    }
    setErrors({});
    const result = login(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      setFormError(result.error ?? "Unable to sign in.");
      return;
    }
    setFormError("");
    router.push("/");
  }

  return (
    <div className="login-page">
      {/* Animated background glow */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />
      <div className="bg-glow-3" />

      <div className="login-card reveal">
        <Link href="/" className="brand" aria-label="Bashaar AI home">
          <div className="brand-icon">
            <span className="brand-mark">B</span>
          </div>
          <span className="brand-text">
            Bashaar <span className="brand-highlight">AI</span>
          </span>
        </Link>

        <p className="subtitle">One source of truth for your sales</p>

        <div className="tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={`tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => {
              setMode("signin");
              setFormError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={`tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setFormError("");
            }}
          >
            Create Account
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={onSubmit} noValidate>
            <div className="input-group">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                error={errors.email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-futuristic"
              />
            </div>

            <div className="input-group">
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                error={errors.password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-futuristic"
              />
            </div>

            {formError ? (
              <p className="field-error" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="summary-bar">
              <label className="remember-me">
                <input type="checkbox" name="remember" />
                <span className="checkmark" />
                Remember me
              </label>
              <a href="#forgot-password" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="gold" className="btn-gold">
              Sign in
              <span className="btn-arrow">→</span>
            </Button>

            <div className="demo-section">
              <p className="demo-label">Demo accounts (password: <strong>demo</strong>)</p>
              <ul className="demo-list">
                {users
                  .filter((u) => u.active)
                  .map((u) => (
                    <li key={u.id}>
                      <span className="demo-dot" />
                      {u.email} — <span className="demo-role">{u.role}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormError("Account creation is UI-only in this preview. Use Sign In with a demo account.");
            }}
          >
            <div className="input-group">
              <Input
                label="Full name"
                name="name"
                placeholder="Jordan Lee"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="input-futuristic"
              />
            </div>
            <div className="input-group">
              <Input
                label="Work email"
                name="signupEmail"
                type="email"
                placeholder="you@company.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="input-futuristic"
              />
            </div>
            <div className="input-group">
              <Input
                label="Password"
                name="signupPassword"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="input-futuristic"
              />
            </div>
            {formError ? (
              <p className="field-error" role="alert">
                {formError}
              </p>
            ) : null}
            <Button type="submit" variant="gold" className="btn-gold">
              Create account
              <span className="btn-arrow">→</span>
            </Button>
          </form>
        )}
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        /* Animated background glows */
        .bg-glow-1,
        .bg-glow-2,
        .bg-glow-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }

        .bg-glow-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #f4c54220 0%, transparent 70%);
          top: -10%;
          right: -5%;
          animation-delay: 0s;
        }

        .bg-glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #f4c54215 0%, transparent 70%);
          bottom: -10%;
          left: -5%;
          animation-delay: -7s;
        }

        .bg-glow-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #ffffff10 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -14s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        /* Login Card */
        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: opacity 0.3s;
        }

        .brand:hover {
          opacity: 0.8;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.3);
        }

        .brand-mark {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.5px;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brand-highlight {
          color: #f4c542;
        }

        .subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 2rem;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        /* Tabs */
        .tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 0.4rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .tab {
          padding: 0.7rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.04);
        }

        .tab.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.25);
        }

        /* Input Group */
        .input-group {
          margin-bottom: 1.25rem;
        }

        .input-group :global(.input-futuristic) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          padding: 0.85rem 1rem !important;
          font-size: 0.95rem !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .input-group :global(.input-futuristic:focus) {
          border-color: #f4c542 !important;
          box-shadow: 0 0 0 4px rgba(244, 197, 66, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }

        .input-group :global(.input-futuristic::placeholder) {
          color: rgba(255, 255, 255, 0.25) !important;
        }

        .input-group :global(label) {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 0.8rem !important;
          font-weight: 500 !important;
          margin-bottom: 0.4rem !important;
          display: block !important;
          letter-spacing: 0.3px !important;
        }

        /* Error */
        .field-error {
          color: #ff6b6b;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          padding: 0.6rem 1rem;
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.15);
          border-radius: 10px;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
          }
        }

        /* Summary Bar */
        .summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .summary-bar a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.3s;
          font-size: 0.8rem;
        }

        .summary-bar a:hover {
          color: #f4c542;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 0.8rem;
        }

        .remember-me input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 5px;
          display: inline-block;
          position: relative;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .remember-me input:checked + .checkmark {
          background: #f4c542;
          border-color: #f4c542;
        }

        .remember-me input:checked + .checkmark::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #0a0a0a;
          font-size: 12px;
          font-weight: 700;
        }

        /* Gold Button */
        .btn-gold {
          width: 100% !important;
          padding: 0.9rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 12px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          position: relative !important;
          overflow: hidden !important;
          font-family: inherit !important;
        }

        .btn-gold:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 40px rgba(244, 197, 66, 0.35) !important;
        }

        .btn-gold:active {
          transform: scale(0.98);
        }

        .btn-arrow {
          display: inline-block;
          transition: transform 0.3s;
          font-size: 1.2rem;
        }

        .btn-gold:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Demo Section */
        .demo-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .demo-label {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .demo-label strong {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .demo-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .demo-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: monospace;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
          transition: background 0.3s;
        }

        .demo-list li:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .demo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f4c542;
          flex-shrink: 0;
          opacity: 0.5;
        }

        .demo-role {
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 1.75rem 1.25rem;
          }

          .brand-text {
            font-size: 1.2rem;
          }

          .brand-icon {
            width: 36px;
            height: 36px;
          }

          .brand-mark {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}