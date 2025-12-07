import React from "react";
import AlertList from "./AlertList";

const Dashboard = ({
  alerts,
  selectedAlert,
  onAlertSelect,
  onFileUpload,
  loading,
  error,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* File Upload */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Upload Log File</h2>

        <input
          type="file"
          accept=".txt,.log"
          onChange={(e) => onFileUpload(e.target.files[0])}
          className="block w-full text-sm text-gray-700 p-2 border border-gray-300 rounded"
        />

        {loading && (
          <p className="mt-3 text-blue-600 font-medium animate-pulse">
            Processing logs...
          </p>
        )}

        {error && (
          <p className="mt-3 text-red-600 font-medium">Error: {error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2">
          <AlertList
            alerts={alerts}
            selectedAlert={selectedAlert}
            onAlertSelect={onAlertSelect}
          />
        </div>

        {/* Selected Alert Panel */}
        <div className="lg:col-span-1">
          {selectedAlert ? (
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-lg font-bold mb-3">Alert Details</h3>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedAlert.alert_type}
                </p>

                <p>
                  <span className="font-medium">Risk:</span>{" "}
                  {selectedAlert.risk}
                </p>

                <p>
                  <span className="font-medium">IP:</span>{" "}
                  {selectedAlert.ip || "N/A"}
                </p>

                <p>
                  <span className="font-medium">Description:</span>
                  <br />
                  {selectedAlert.description}
                </p>

                <div>
                  <span className="font-medium">Raw Log:</span>
                  <pre className="mt-1 p-2 bg-gray-100 rounded border text-xs">
                    {selectedAlert.details?.raw}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-6 h-full flex items-center justify-center border border-gray-200">
              <p className="text-gray-500">Upload a log file to see alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
