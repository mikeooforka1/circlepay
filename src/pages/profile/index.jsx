import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/assets/images/default-avatar.png";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!user);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setAvatarPreview(data.user.avatar_url || DEFAULT_AVATAR);
          login(data.user); // update context
        }
      } catch (e) {}
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Handle edit button
  const handleEdit = () => {
    setEditFields({
      fullname: profile.fullname,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      countryCode: profile.countryCode,
      age: profile.age,
      dob: profile.dob ? profile.dob.slice(0, 10) : "",
      gender: profile.gender,
      avatar_url: profile.avatar_url || DEFAULT_AVATAR,
    });
    setAvatarPreview(profile.avatar_url || DEFAULT_AVATAR);
    setAvatarFile(null);
    setEditing(true);
  };

  // Handle avatar file select in edit mode
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setEditFields((prev) => ({ ...prev, avatar_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle save changes (including avatar)
  const handleSave = async () => {
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      // Prepare payload
      const payload = { ...editFields };
      // If avatarFile is set, avatar_url is already a base64 string in editFields
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        login(data.user);
        setEditing(false);
      }
    } catch (e) {}
    setUploading(false);
  };

  // Handle field change
  const handleFieldChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  // Update logout to redirect to home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-white/80">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Not Authenticated</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-10 flex justify-center items-start bg-gradient-to-br from-[#10141a] to-[#1e293b]">
      <div className="w-full max-w-lg bg-white/10 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 rounded-t-2xl opacity-70"></div>
        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative group">
            <img
              src={avatarPreview || DEFAULT_AVATAR}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg bg-white transition-transform duration-300 group-hover:scale-105"
            />
            {editing ? (
              <>
                <button
                  className="absolute bottom-1 right-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2 shadow transition-opacity opacity-80 group-hover:opacity-100"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Change Profile Photo"
                  style={{ zIndex: 2 }}
                  type="button"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7" />
                    <path d="M9 5v4l2 2" />
                  </svg>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </>
            ) : (
              <button
                className="absolute bottom-1 right-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2 shadow transition-opacity opacity-80 group-hover:opacity-100"
                onClick={handleEdit}
                title="Edit Profile"
                style={{ zIndex: 2 }}
                type="button"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="7" />
                  <path d="M9 5v4l2 2" />
                </svg>
              </button>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">{profile.fullname}</h2>
          <span className="text-cyan-300 font-mono">@{profile.username}</span>
          {!editing && (
            <button
              className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 hover:from-cyan-500 hover:to-yellow-500 text-slate-900 font-semibold text-sm shadow transition"
              onClick={handleEdit}
              disabled={uploading}
              type="button"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {editing ? (
            <>
              <ProfileEditField label="Full Name" name="fullname" value={editFields.fullname} onChange={handleFieldChange} />
              <ProfileEditField label="Username" name="username" value={editFields.username} onChange={handleFieldChange} />
              <ProfileEditField label="Email" name="email" value={editFields.email} onChange={handleFieldChange} />
              <ProfileEditField label="Phone" name="phone" value={editFields.phone} onChange={handleFieldChange} />
              <ProfileEditField label="Country" name="country" value={editFields.country} onChange={handleFieldChange} />
              <ProfileEditField label="Country Code" name="countryCode" value={editFields.countryCode} onChange={handleFieldChange} />
              <ProfileEditField label="Age" name="age" value={editFields.age} onChange={handleFieldChange} type="number" />
              <ProfileEditField label="Date of Birth" name="dob" value={editFields.dob} onChange={handleFieldChange} type="date" />
              <ProfileEditField label="Gender" name="gender" value={editFields.gender} onChange={handleFieldChange} type="text" />
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 hover:from-cyan-500 hover:to-yellow-500 text-slate-900 font-semibold text-sm shadow transition"
                  onClick={handleSave}
                  disabled={uploading}
                  type="button"
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-semibold text-sm shadow transition"
                  onClick={() => setEditing(false)}
                  disabled={uploading}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Phone" value={profile.phone} />
              <ProfileField label="Country" value={profile.country} />
              <ProfileField label="Country Code" value={profile.countryCode} />
              <ProfileField label="Age" value={profile.age} />
              <ProfileField label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ""} />
              <ProfileField label="Gender" value={profile.gender} />
            </>
          )}
        </div>
        {/* Logout button at the bottom */}
        <div className="mt-10 flex justify-center">
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-400 hover:from-rose-600 hover:to-yellow-500 text-white font-semibold text-base shadow transition"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          main {
            padding-top: 2.5rem !important;
            padding-bottom: 2rem !important;
          }
          .max-w-lg {
            padding: 2.2rem !important;
          }
        }
      `}</style>
    </main>
  );
};

function ProfileField({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-white/70 font-medium w-36">{label}:</span>
      <span className="text-white break-all">{value}</span>
    </div>
  );
}

function ProfileEditField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <label className="text-white/70 font-medium w-36" htmlFor={name}>{label}:</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="rounded px-3 py-2 bg-white/20 text-white w-full sm:w-auto focus:ring-2 focus:ring-cyan-400 border border-white/20"
      />
    </div>
  );
}

export default Profile;