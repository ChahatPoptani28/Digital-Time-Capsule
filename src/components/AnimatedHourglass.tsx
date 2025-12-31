import { motion } from "framer-motion";

interface AnimatedHourglassProps {
  className?: string;
  size?: number;
}

const AnimatedHourglass = ({ className = "", size = 20 }: AnimatedHourglassProps) => {
  // Create multiple sand particles with staggered delays
  const sandParticles = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 0.2,
    x: (Math.random() - 0.5) * 2,
  }));

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Main hourglass SVG */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Hourglass frame */}
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>

      {/* Animated sand stream - continuous falling sand */}
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        {/* Main sand stream in center */}
        {sandParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              left: `calc(50% + ${particle.x}px)`,
            }}
            initial={{ top: "35%", opacity: 0 }}
            animate={{
              top: ["35%", "50%", "65%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}

        {/* Top sand pile shrinking */}
        <motion.div
          className="absolute rounded-b-full bg-gradient-to-b from-gold to-gold-glow"
          style={{
            width: size * 0.35,
            left: `calc(50% - ${size * 0.175}px)`,
            top: "22%",
          }}
          animate={{
            height: [size * 0.15, size * 0.08, size * 0.15],
            opacity: [0.8, 0.5, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom sand pile growing */}
        <motion.div
          className="absolute rounded-t-full bg-gradient-to-t from-gold to-gold-glow"
          style={{
            width: size * 0.35,
            left: `calc(50% - ${size * 0.175}px)`,
            bottom: "12%",
          }}
          animate={{
            height: [size * 0.08, size * 0.15, size * 0.08],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedHourglass;
