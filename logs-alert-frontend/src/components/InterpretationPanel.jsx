import React from "react";
import {
  FaLightbulb,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const InterpretationPanel = ({ alert, interpretation }) => {
  const getRiskIcon = (risk) => {
    switch (risk) {
      case "Critical":
        return <FaExclamationTriangle className="text-red-500" />;
      case "High":
        return <FaExclamationTriangle className="text-orange-500" />;
      case "Medium":
        return <FaShieldAlt className="text-yellow-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 h-full">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaLightbulb className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          Alert Interpretation
        </h3>
      </div>

      <div className="space-y-6">
        {/* Simple Explanation */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">In Simple Words:</h4>
          <p className="text-blue-800">{interpretation.message}</p>
        </div>

        {/* Risk Assessment */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Risk Level:</h4>

          <div className="flex items-center mb-3 space-x-2">
            {getRiskIcon(alert.risk)}
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full 
              ${
                alert.risk === "Critical"
                  ? "bg-red-100 text-red-800"
                  : alert.risk === "High"
                  ? "bg-orange-100 text-orange-800"
                  : alert.risk === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {alert.risk}
            </span>
          </div>

          <p className="text-sm text-gray-700">{alert.description}</p>
        </div>

        {/* Recommended Action */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center mb-2">
            {getRiskIcon(alert.risk)}
            <h4 className="font-semibold text-indigo-900 ml-2">
              Recommended Action:
            </h4>
          </div>
          <p className="text-indigo-800 font-medium">{interpretation.action}</p>
        </div>

        {/* Raw Log */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Raw Log Line:</h4>

          <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
            {alert.details?.raw}
          </pre>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <span className="font-medium">Timestamp:</span> {alert.timestamp}
            </p>
            <p>
              <span className="font-medium">IP:</span> {alert.ip || "N/A"}
            </p>
            <p>
              <span className="font-medium">Detection Type:</span>{" "}
              {alert.alert_type}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="text-xs text-gray-500 flex items-center">
          <FaShieldAlt className="mr-2" />
          <span>AI-powered detection • Based on backend rules</span>
        </div>
      </div>
    </div>
  );
};

export default InterpretationPanel;
