import React from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import useAlerts from "./hooks/useAlerts";

function App() {
  const { alerts, selectedAlert, loading, error, processLogFile, selectAlert } =
    useAlerts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header alerts={alerts} />

      <Dashboard
        alerts={alerts}
        selectedAlert={selectedAlert}
        onFileUpload={processLogFile}
        onAlertSelect={selectAlert}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default App;
