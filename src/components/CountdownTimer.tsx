import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  unlockDate: Date;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ unlockDate, compact = false }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(unlockDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate]);

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 text-unlocked font-semibold"
      >
        <span className="text-lg">✨</span>
        <span>Ready to unlock!</span>
      </motion.div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{timeLeft.days}d</span>
        <span className="font-semibold text-foreground">{timeLeft.hours}h</span>
        <span className="font-semibold text-foreground">{timeLeft.minutes}m</span>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex gap-3 md:gap-4">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="glass-card rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
            <motion.span
              key={unit.value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl md:text-3xl font-heading font-bold gradient-text block text-center"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground mt-2 font-medium">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
