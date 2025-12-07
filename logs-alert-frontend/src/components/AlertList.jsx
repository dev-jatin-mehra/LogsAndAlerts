import React from "react";
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const severityColor = {
  Critical: "border-l-4 border-red-500 bg-red-50 hover:bg-red-100",
  High: "border-l-4 border-orange-500 bg-orange-50 hover:bg-orange-100",
  Medium: "border-l-4 border-yellow-500 bg-yellow-50 hover:bg-yellow-100",
  Low: "border-l-4 border-green-500 bg-green-50 hover:bg-green-100",
};

const severityIcon = {
  Critical: <FaExclamationCircle className="text-red-500" />,
  High: <FaExclamationCircle className="text-orange-500" />,
  Medium: <FaExclamationTriangle className="text-yellow-500" />,
  Low: <FaInfoCircle className="text-green-500" />,
};

const AlertList = ({ alerts, selectedAlert, onAlertSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Detected Alerts ({alerts.length})
        </h3>
        <p className="text-sm text-gray-600">Click an alert to view details</p>
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
              severityColor[alert.risk] || severityColor["Low"]
            } ${selectedAlert === alert ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => onAlertSelect(alert)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">{severityIcon[alert.risk]}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {alert.alert_type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp}
                  </span>
                </div>

                <p className="text-sm text-gray-800 font-mono bg-white p-2 rounded border border-gray-300">
                  {alert.description}
                </p>

                <div className="mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                    {alert.risk}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList;
