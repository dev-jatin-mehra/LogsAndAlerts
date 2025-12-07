import { useState } from "react";
import { uploadLogFile } from "../api/logs";

export default function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const processLogFile = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const data = await uploadLogFile(file);

      setAlerts(data.alerts || []);
      setSelectedAlert(data.alerts?.[0] || null);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts,
    selectedAlert,
    loading,
    error,
    processLogFile,
    selectAlert: setSelectedAlert,
  };
}
