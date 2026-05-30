import { useEffect, useState } from "react";
import { config } from "../config";

function getCountdown() {
  const target = new Date(config.eventDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

export default function Countdown() {
  const [time, setTime] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div className="count-item">
        <strong>{time.days}</strong>
        <span>Days</span>
      </div>
      <div className="count-item">
        <strong>{time.hours}</strong>
        <span>Hours</span>
      </div>
      <div className="count-item">
        <strong>{time.minutes}</strong>
        <span>Minutes</span>
      </div>
      <div className="count-item">
        <strong>{time.seconds}</strong>
        <span>Seconds</span>
      </div>
    </div>
  );
}
