import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import { Navigation } from "../components/common/Navigation";

const BACKEND_URL = "http://localhost:3000/api/v1";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/profile`, {
        headers: { Authorization: token },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setError("No profile data received");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || "Failed to fetch profile");

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          await axios.put(
            `${BACKEND_URL}/update-profile`,
            { profilePic: base64 },
            { headers: { Authorization: localStorage.getItem("token") } }
          );
          await fetchUserProfile();
        } catch (error: any) {
          setError(
            error.response?.data?.message || "Failed to update profile picture"
          );
        }
        setLoading(false);
      };
    } catch (error) {
      setLoading(false);
      setError("Failed to process image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      {/* Main content */}
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={40} className="text-gray-400" />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Camera size={24} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={loading}
            />
          </div>

          {/* User Info */}
          <div className="w-full space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Full Name</p>
              <p className="text-lg">{user?.fullName || "Not available"}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-lg">{user?.email || "Not available"}</p>
            </div>
          </div>

          {loading && (
            <div className="text-blue-500 flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Updating profile picture...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
