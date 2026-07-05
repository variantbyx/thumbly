import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SoftBackDrop from "./SoftBackDrop";
import { useAuth } from "../context/AuthContext";
import { UserIcon, MailIcon, LockIcon, AlertCircleIcon, Loader2Icon } from "lucide-react";

function Login() {
  const [state, setState] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error, clearError, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || "/generate";
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setLocalLoading(true);

    try {
      if (state === "login") {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          throw new Error("Name is required");
        }
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err: any) {
      setLocalError(err.message || "An error occurred. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <>
      <SoftBackDrop />
      <div className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[380px] bg-surface/40 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl flex flex-col"
        >
          <h1 className="text-text-primary text-3xl mt-4 font-bold tracking-tight">
            {state === "login" ? "Sign In" : "Sign Up"}
          </h1>

          <p className="text-text-secondary text-sm mt-2">
            {state === "login" ? "Enter your details to sign in" : "Create an account to get started"}
          </p>

          {/* Error Message */}
          {(localError || error) && (
            <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs text-left">
              <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
              <p className="font-medium">{localError || error}</p>
            </div>
          )}

          {/* Name Field (for Register) */}
          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-slate-900/50 border border-slate-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all">
              <UserIcon size={16} className="text-text-secondary" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-transparent text-text-primary placeholder:text-text-secondary border-none outline-none text-sm pr-4"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex items-center w-full mt-4 bg-slate-900/50 border border-slate-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all">
            <MailIcon size={16} className="text-text-secondary" />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="w-full bg-transparent text-text-primary placeholder:text-text-secondary border-none outline-none text-sm pr-4"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center mt-4 w-full bg-slate-900/50 border border-slate-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all">
            <LockIcon size={16} className="text-text-secondary" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-text-primary placeholder:text-text-secondary border-none outline-none text-sm pr-4"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {state === "login" && (
            <div className="mt-3 text-right">
              <button type="button" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={localLoading || loading}
            className="mt-6 w-full h-11 rounded-full text-white bg-primary hover:bg-primary/95 transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(localLoading || loading) && <Loader2Icon size={16} className="animate-spin" />}
            {state === "login" ? "Sign In" : "Sign Up"}
          </button>

          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-text-secondary text-sm mt-6 mb-4 cursor-pointer self-center"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="text-primary hover:underline ml-1.5 font-semibold">
              Click here
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
