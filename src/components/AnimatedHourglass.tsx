import { motion } from "framer-motion";

interface AnimatedHourglassProps {
  className?: string;
  size?: number;
}

const AnimatedHourglass = ({ className = "", size = 20 }: AnimatedHourglassProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Main hourglass SVG */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full animate-hourglass-glow"
      >
        {/* Hourglass frame */}
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </motion.svg>

      {/* Animated sand particles */}
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        {/* Top sand pile */}
        <motion.div
          className="absolute top-[25%] w-[3px] h-[3px] rounded-full bg-gold"
          animate={{
            y: [0, size * 0.4],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-[25%] w-[2px] h-[2px] rounded-full bg-gold-glow"
          animate={{
            y: [0, size * 0.4],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-[25%] w-[2px] h-[2px] rounded-full bg-gold-soft"
          animate={{
            y: [0, size * 0.4],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedHourglass;
