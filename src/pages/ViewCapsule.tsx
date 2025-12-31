import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, Calendar, Heart, Mail, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

// Mock capsule data
const mockCapsuleData = {
  id: "1",
  title: "Message to Future Me",
  message: `Dear Future Me,

I hope this message finds you well and happy. As I write this, I'm sitting by the window on a rainy afternoon, thinking about all the dreams we have.

Remember to be kind to yourself. Remember that every step forward, no matter how small, is still progress. Don't forget the people who stood by you, and always take time to appreciate the little moments.

I wonder what you've accomplished by now. I wonder if you still love coffee as much as I do right now, or if you've finally learned to cook that recipe you've been putting off.

Whatever life looks like for you now, know that I'm proud of you. You've made it this far, and that's something worth celebrating.

With love,
Your Past Self 💜`,
  unlockDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday (unlocked)
  isUnlocked: true,
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
  images: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60",
  ],
};

const mockLockedCapsule = {
  id: "2",
  title: "Our Anniversary Memories 💕",
  message: "",
  unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  isUnlocked: false,
  createdAt: new Date(),
  images: [],
};

const ViewCapsule = () => {
  const { id } = useParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Use mock data based on ID
  const capsule = id === "1" ? mockCapsuleData : mockLockedCapsule;
  const { title, message, unlockDate, isUnlocked, createdAt, images } = capsule;

  useEffect(() => {
    if (isUnlocked) {
      // Delay reveal animation
      const timer = setTimeout(() => {
        setRevealed(true);
        setShowConfetti(true);
      }, 500);

      // Hide confetti after animation
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [isUnlocked]);

  return (
    <div className="min-h-screen pb-12">
      <Navbar isLoggedIn userName="Alex" />

      {showConfetti && <Confetti />}

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {isUnlocked ? (
          /* Unlocked View */
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-unlocked/20 border border-unlocked/30 text-unlocked mb-4"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Memory Unlocked</span>
                  </motion.div>

                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                    {title}
                  </h1>

                  <p className="text-muted-foreground">
                    Created on {format(createdAt, "MMMM d, yyyy")}
                  </p>
                </div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card variant="glass" className="mb-8">
                    <CardContent className="p-8">
                      {/* Letter styling */}
                      <div className="relative">
                        <Mail className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                        <div className="pl-4 border-l-4 border-primary/20">
                          <p className="whitespace-pre-wrap text-lg leading-relaxed font-body">
                            {message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Images */}
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      Photos
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="aspect-video rounded-2xl overflow-hidden shadow-card"
                        >
                          <img
                            src={image}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Footer message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-muted-foreground italic">
                    This message was created by your past self 💌
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* Locked View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card variant="locked" className="max-w-xl mx-auto">
              <CardContent className="p-12">
                {/* Lock icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-locked/20 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-locked" />
                  </div>
                </motion.div>

                <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                  {title}
                </h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  This memory is waiting for the right moment…
                </p>

                {/* Countdown */}
                <div className="flex justify-center mb-8">
                  <CountdownTimer unlockDate={unlockDate} />
                </div>

                {/* Unlock date */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Unlocks on {format(unlockDate, "MMMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <p className="mt-8 text-muted-foreground italic max-w-md mx-auto">
              "The best things in life are worth waiting for"
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ViewCapsule;
