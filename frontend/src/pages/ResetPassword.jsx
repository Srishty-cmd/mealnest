import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ResetPassword() {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialToken = query.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, password);
      setMessage(data.message || "Password reset successful. Please sign in.");
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 font-sans transition-colors duration-300 relative selection:bg-rose-500 selection:text-white">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-800/50 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
            Reset Password
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-2 leading-relaxed">
            Paste your token and provide a new password to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(message || error) && (
            <div
              className={`border-l-4 p-4 rounded-r-xl text-xs font-bold shadow-sm ${message ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300" : "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-300"}`}
            >
              {message || error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">
              Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter reset token here"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-700 transition"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-700 transition"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-700 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold tracking-wider uppercase text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition duration-250"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-450 border-t border-slate-150 dark:border-slate-800 pt-4">
          Remembered your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-rose-500 font-black hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
