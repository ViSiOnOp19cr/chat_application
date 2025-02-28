import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api/v1";

export const Signup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      const fullName = fullNameRef.current?.value;
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      // Validation
      if (!fullName || !email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      await axios.post(`${BACKEND_URL}/signup`, {
        fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join our chat community
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                ref={fullNameRef}
                type="text"
                placeholder="Full Name"
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                ref={emailRef}
                type="email"
                placeholder="Email Address"
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-700 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-center text-gray-400">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:text-blue-400">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:text-blue-400">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
