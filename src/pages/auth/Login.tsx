import React, { useState } from "react";
import { loginUser } from "../../services/firebase/auth";
import { TextInput } from "../../components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/vite.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* LOGO + BRAND */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-12 w-auto mb-3" />
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue planning your trips
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="
                w-full bg-blue-600 text-white py-2.5 rounded-lg
                hover:bg-blue-700 active:scale-[0.98]
                transition
              "
            >
              Sign in
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-sm text-center text-gray-500 mt-5">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
