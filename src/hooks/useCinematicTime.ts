import { useEffect, useState } from "react";

export interface AtmosphereConfig {
  blurIntensity: string; // e.g. "40px" or "80px"
  animationSpeed: number; // multiplier e.g. 0.5 for slow, 1 for normal
  primary: string;
  glow: string;
  aurora: string;
  mood: string;
}

export function useCinematicTime(): AtmosphereConfig {
  const [config, setConfig] = useState<AtmosphereConfig>({
    blurIntensity: "40px",
    animationSpeed: 1,
    primary: "oklch(0.78 0.16 295)",
    glow: "oklch(0.85 0.18 320)",
    aurora: "oklch(0.82 0.15 200)",
    mood: "Daytime"
  });

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      
      let blur = "40px";
      let speed = 1;
      let primary = "oklch(0.78 0.16 295)";
      let glow = "oklch(0.85 0.18 320)";
      let aurora = "oklch(0.82 0.15 200)";
      let mood = "Daytime";

      if (hour >= 2 && hour < 5) {
        mood = "Deep Night";
        blur = "80px";
        speed = 0.3; // super slow
        primary = "oklch(0.25 0.1 270)"; // deep indigo
        glow = "oklch(0.3 0.12 280)";
        aurora = "oklch(0.2 0.08 250)";
      } else if (hour >= 5 && hour < 12) {
        mood = "Morning";
        blur = "30px";
        speed = 1.2;
        primary = "oklch(0.75 0.15 80)"; // amber
        glow = "oklch(0.85 0.18 90)"; // yellow glow
        aurora = "oklch(0.8 0.12 60)"; // warm orange
      } else if (hour >= 12 && hour < 17) {
        mood = "Afternoon";
        blur = "40px";
        speed = 1;
        // defaults
      } else if (hour >= 17 && hour < 21) {
        mood = "Evening";
        blur = "50px";
        speed = 0.8;
        primary = "oklch(0.55 0.15 320)"; // twilight purple
        glow = "oklch(0.65 0.18 340)";
        aurora = "oklch(0.5 0.12 290)";
      } else {
        mood = "Late Night";
        blur = "60px";
        speed = 0.5;
        primary = "oklch(0.35 0.12 280)"; // midnight blue
        glow = "oklch(0.45 0.15 295)";
        aurora = "oklch(0.3 0.1 260)";
      }

      setConfig({
        blurIntensity: blur,
        animationSpeed: speed,
        primary,
        glow,
        aurora,
        mood
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return config;
}
