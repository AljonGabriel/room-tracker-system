import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const navigate = useNavigate();

  // State to hold input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const validUser = "Dean";
    const validPassword = "123";

    // Simple validation
    if (email === validUser && password === validPassword) {
      navigate("/home");
    } else {
      toast.error("Invalid credentials. Try Dean / 123 😅");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4"
      data-theme="dark"
    >
      <div className="w-full max-w-md bg-base-200 shadow-xl rounded-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-sm text-base-content">Login to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base-content">Username</span>
            </label>
            <input
              type="text"
              placeholder="Dean"
              className="input input-bordered w-full bg-base-100 text-base-content"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base-content">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full bg-base-100 text-base-content"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-base-content opacity-60">
          <p>© 2025 Schedule System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
