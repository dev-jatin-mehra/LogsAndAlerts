const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:23:45",
    rawLog: "ERROR: Failed login attempt from IP 192.168.1.100 for user admin",
    severity: "high",
    source: "Auth Service",
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:24:10",
    rawLog: "WARN: Database connection pool at 80% capacity",
    severity: "medium",
    source: "Database",
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:25:30",
    rawLog: "INFO: User johndoe logged in successfully",
    severity: "low",
    source: "Auth Service",
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:26:15",
    rawLog: "ERROR: Payment gateway timeout - 504 Gateway Timeout",
    severity: "high",
    source: "Payment Service",
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:27:45",
    rawLog: "WARN: High memory usage detected - 85% utilized",
    severity: "medium",
    source: "System Monitor",
  },
];

export default mockLogs;
