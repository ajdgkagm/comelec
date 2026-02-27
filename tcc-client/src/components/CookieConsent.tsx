import { useState, useEffect } from "react";
import "./CookieConsent.css";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setShowBanner(false);
  };

  return showBanner ? (
    <div className="cookie-banner">
      <p>
        🍪 We use cookies to improve your experience. By continuing, you agree to our use of cookies.
      </p>
      <button className="btn-accept" onClick={acceptAll}>
        Accept All
      </button>
    </div>
  ) : null;
}