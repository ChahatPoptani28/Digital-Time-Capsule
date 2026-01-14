import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Confetti = () => {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    const colors = ["hsl(262 83% 68%)", "hsl(45 90% 55%)", "hsl(160 60% 60%)", "hsl(25 85% 70%)", "hsl(200 60% 70%)"];
    setPieces(Array.from({ length: 50 }, (_, i) => ({ id: i, x: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)], delay: Math.random() * 0.5 })));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div key={piece.id} initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }} animate={{ y: "110vh", rotate: 720, opacity: [1, 1, 0] }} transition={{ duration: 3, delay: piece.delay, ease: "easeOut" }} className="absolute w-3 h-3 rounded-sm" style={{ backgroundColor: piece.color }} />
      ))}
    </div>
  );
};

export default Confetti;
