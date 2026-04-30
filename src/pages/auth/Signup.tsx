import React, { useState } from "react";
import { signupUser } from "../../services/firebase/auth";
import { TextInput } from "../../components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/vite.png";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signupUser(email, password, name);
      navigate("/onboarding/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 
      bg-linear-to-br from-blue-50 via-white to-indigo-50"
    >
      <div className="w-full max-w-md">
        {/* Logo + Branding */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} className="h-12 w-auto mb-3" alt="Logo" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-500">
            Start planning your trips today
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <TextInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
                w-full bg-blue-600 text-white py-2.5 rounded-xl
                hover:bg-blue-700 active:scale-[0.98]
                transition font-medium
              "
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
