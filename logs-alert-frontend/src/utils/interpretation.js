const mapping = {
  Critical: {
    color: "red",
    message: "Immediate danger detected",
  },
  High: {
    color: "orange",
    message: "High-risk alert",
  },
  Medium: {
    color: "yellow",
    message: "Suspicious behavior detected",
  },
  Low: {
    color: "green",
    message: "Informational",
  },
};

export function interpretRisk(risk) {
  return mapping[risk] || mapping["Low"];
}
