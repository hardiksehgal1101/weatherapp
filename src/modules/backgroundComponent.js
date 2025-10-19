import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Starry twinkling particles for night
function StarParticles({ numParticles = 40 }) {
  const particles = Array(numParticles).fill(0);
  return (
    <>
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2;
        const top = Math.random() * window.innerHeight;
        const left = Math.random() * window.innerWidth;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: "loop",
              delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.8)",
              top,
              left,
              boxShadow: "0 0 8px rgba(255,255,255,0.5)",
            }}
          />
        );
      })}
    </>
  );
}

// Subtle floating clouds for day
function FloatingClouds({ numClouds = 5 }) {
  const clouds = Array(numClouds).fill(0);
  return (
    <>
      {clouds.map((_, i) => {
        const size = Math.random() * 100 + 80; // width/height of cloud
        const top = Math.random() * 60; // top position
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 15; // slow float

        return (
          <motion.div
            key={i}
            initial={{ x: -size }}
            animate={{ x: "100vw" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration,
              delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top,
              width: size,
              height: size / 2,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              filter: "blur(10px)",
            }}
          />
        );
      })}
    </>
  );
}

// Main Background component
export default function Background() {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getHours();
      setIsNight(hours >= 19 || hours < 6); // night from 7 PM to 6 AM
    };
    checkTime();

    const interval = setInterval(checkTime, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      {isNight ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          }}
        >
          <StarParticles />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #6ca0dc, #4f7aa8)", // darker daytime sky
          }}
        >
          <FloatingClouds />
        </div>
      )}
    </div>
  );
}
