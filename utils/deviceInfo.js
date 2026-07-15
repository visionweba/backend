const geoip = require("geoip-lite");
const { UAParser } = require("ua-parser-js");

// Pulls a real client IP out of the request (handles proxies) and resolves
// device / browser / OS + rough city-state-country location from it.
function getDeviceInfo(req) {
  let ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    "";

  ip = ip.replace("::ffff:", "");

  const parser = new UAParser(req.headers["user-agent"] || "");
  const ua = parser.getResult();

  const geo = geoip.lookup(ip) || {};

  return {
    ip: ip || "Unknown",
    device: ua.device.model
      ? `${ua.device.vendor || ""} ${ua.device.model}`.trim()
      : ua.device.type || "Desktop",
    browser: ua.browser.name ? `${ua.browser.name} ${ua.browser.version || ""}`.trim() : "Unknown",
    os: ua.os.name ? `${ua.os.name} ${ua.os.version || ""}`.trim() : "Unknown",
    city: geo.city || "Unknown",
    state: geo.region || "Unknown",
    country: geo.country || "Unknown",
  };
}

module.exports = getDeviceInfo;
