import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsRow from "../../components/settings/SettingsRow";
import { auth } from "../../services/firebase/firebase";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      {/* Account Section */}
      <div>
        <h2 className="text-gray-500 text-sm mb-2">Account</h2>

        <div className="bg-white rounded-xl shadow">
          <SettingsRow
            label="Profile"
            icon="👤"
            onClick={() => navigate("/profile")}
          />
          <SettingsRow
            label="Change Password"
            icon="🔒"
            onClick={() => navigate("/settings/password")}
          />
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <h2 className="text-gray-500 text-sm mb-2">Preferences</h2>

        <div className="bg-white rounded-xl shadow">
          <SettingsRow
            label="Language"
            icon="🌐"
            onClick={() => navigate("/onboarding/language")}
          />
          <SettingsRow
            label="Accessibility"
            icon="♿"
            onClick={() => navigate("/onboarding/accessibility")}
          />
          <SettingsRow
            label="Travel Preferences"
            icon="🧭"
            onClick={() => navigate("/onboarding/preferences")}
          />
        </div>
      </div>

      {/* App Section */}
      <div>
        <h2 className="text-gray-500 text-sm mb-2">App</h2>

        <div className="bg-white rounded-xl shadow">
          <SettingsRow
            label="Privacy Notice"
            icon="🔐"
            onClick={() => navigate("/onboarding/privacy")}
          />
          <SettingsRow
            label="Notifications"
            icon="🔔"
            onClick={() => navigate("/settings/notifications")}
          />
        </div>
      </div>

      {/* Support Section */}
      <div>
        <h2 className="text-gray-500 text-sm mb-2">Support</h2>

        <div className="bg-white rounded-xl shadow">
          <SettingsRow
            label="Help Center"
            icon="❓"
            onClick={() => navigate("/settings/help")}
          />
          <SettingsRow
            label="Contact Support"
            icon="📨"
            onClick={() => navigate("/settings/contact")}
          />
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl shadow">
        <SettingsRow label="Log Out" icon="🚪" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Settings;
