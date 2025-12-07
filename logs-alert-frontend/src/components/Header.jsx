import React from "react";
import { FaShieldAlt, FaBell } from "react-icons/fa";

const Header = ({ alerts = [] }) => {
  const totalAlerts = alerts.length;

  // Compute highest-risk badge color
  const highestRisk = alerts.reduce((acc, alert) => {
    const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return rank[alert.risk] > (rank[acc] || 0) ? alert.risk : acc;
  }, null);

  const riskColor = {
    Critical: "bg-red-600",
    High: "bg-orange-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-600",
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* LEFT SIDE LOGO */}
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Logs & Alerts Helper
              </h1>
              <p className="text-sm text-gray-600">
                Reads → Detects → Interprets → Highlights Risks
              </p>
            </div>
          </div>

          {/* RIGHT SIDE STATUS */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <FaBell className="h-6 w-6 text-gray-500 hover:text-blue-600 cursor-pointer" />

              {totalAlerts > 0 && (
                <span
                  className={`absolute -top-1 -right-1 h-4 w-4 text-xs text-white rounded-full flex items-center justify-center ${
                    riskColor[highestRisk] || "bg-gray-400"
                  }`}
                >
                  {totalAlerts}
                </span>
              )}
            </div>

            {/* AI Assistant */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">AI</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  AI Assistant
                </p>
                <p className="text-xs text-gray-500">
                  {totalAlerts > 0 ? "Alerts processed" : "Waiting for logs"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
