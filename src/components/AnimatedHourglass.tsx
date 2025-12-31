import { motion } from "framer-motion";

interface AnimatedHourglassProps {
  className?: string;
  size?: number;
}

const AnimatedHourglass = ({ className = "", size = 20 }: AnimatedHourglassProps) => {
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

      {/* Animated sand falling - visible stream */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Falling sand particles - center stream */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-gold rounded-full"
          style={{
            width: Math.max(2, size * 0.1),
            height: Math.max(2, size * 0.1),
          }}
          animate={{
            top: ["30%", "70%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-gold rounded-full"
          style={{
            width: Math.max(2, size * 0.08),
            height: Math.max(2, size * 0.08),
          }}
          animate={{
            top: ["30%", "70%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeIn",
            delay: 0.3,
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-gold-glow rounded-full"
          style={{
            width: Math.max(1, size * 0.06),
            height: Math.max(1, size * 0.06),
          }}
          animate={{
            top: ["30%", "70%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeIn",
            delay: 0.5,
          }}
        />

        {/* Top sand pile */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-gold rounded-b-full"
          style={{
            width: size * 0.4,
            top: "18%",
          }}
          animate={{
            height: [size * 0.18, size * 0.1, size * 0.18],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom sand pile */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-gold rounded-t-full"
          style={{
            width: size * 0.4,
            bottom: "8%",
          }}
          animate={{
            height: [size * 0.1, size * 0.18, size * 0.1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedHourglass;