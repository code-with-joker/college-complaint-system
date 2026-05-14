const emergencyKeywords = [
  "fire",
  "electric shock",
  "gas leak",
  "short circuit",
  "blast"
];

const highKeywords = [
  "server down",
  "water leakage",
  "power outage",
  "security issue",
  "internet down"
];

const mediumKeywords = [
  "wifi slow",
  "fan issue",
  "ac not working",
  "broken bench"
];

exports.detectPriority = (text = "") => {

  const lowerText = text.toLowerCase();

  // 🔥 Emergency
  if (
    emergencyKeywords.some(word =>
      lowerText.includes(word)
    )
  ) {
    return "Emergency";
  }

  // ⚠️ High
  if (
    highKeywords.some(word =>
      lowerText.includes(word)
    )
  ) {
    return "High";
  }

  // 🟡 Medium
  if (
    mediumKeywords.some(word =>
      lowerText.includes(word)
    )
  ) {
    return "Medium";
  }

  // 🟢 Default
  return "Low";
};