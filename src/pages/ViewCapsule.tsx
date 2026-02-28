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
import API from "@/api/axios";

const ViewCapsule = () => {
  const { id } = useParams();

  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // 🔹 Fetch capsule from backend
  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/capsules/${id}`);
        setCapsule(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load capsule");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCapsule();
  }, [id]);

  // 🔹 Reveal animation for unlocked capsule
  useEffect(() => {
    if (capsule && !capsule.isLocked) {
      const timer = setTimeout(() => {
        setRevealed(true);
        setShowConfetti(true);
      }, 500);

      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [capsule]);

  // 🔹 Loading
  if (loading) {
    return <div className="p-10 text-center">Loading capsule...</div>;
  }

  // 🔹 Error
  if (error) {
    return <div className="p-10 text-center text-destructive">{error}</div>;
  }

  // 🔹 Safety check
  if (!capsule) return null;

  const { title, message, unlockDate, isLocked, createdAt, media } = capsule;

  return (
    <div className="min-h-screen pb-12">
      <Navbar isLoggedIn userName="Alex" />

      {showConfetti && <Confetti />}

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {!isLocked ? (
          /* 🔓 UNLOCKED VIEW */
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-unlocked/20 border border-unlocked/30 text-unlocked mb-4">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Memory Unlocked</span>
                  </div>

                  <h1 className="text-3xl font-heading font-bold mb-2">
                    {title}
                  </h1>

                  <p className="text-muted-foreground">
                    Created on {format(new Date(createdAt), "MMMM d, yyyy")}
                  </p>
                </div>

                <Card variant="glass" className="mb-8">
                  <CardContent className="p-8">
                    <div className="relative">
                      <Mail className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                      <div className="pl-4 border-l-4 border-primary/20">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">
                          {message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                {media && media.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      Media
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {media.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="aspect-video rounded-2xl overflow-hidden shadow-card"
                        >
                          {item.type === "image" && (
                            <img
                              src={item.url}
                              alt="Capsule media"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* 🔒 LOCKED VIEW */
          <div className="text-center py-12">
            <Card variant="locked" className="max-w-xl mx-auto">
              <CardContent className="p-12">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-locked/20 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-locked" />
                  </div>
                </div>

                <h1 className="text-2xl font-heading font-bold mb-4">
                  {title}
                </h1>

                <p className="text-muted-foreground mb-8">
                  This memory is waiting for the right moment…
                </p>

                <div className="flex justify-center mb-8">
                  <CountdownTimer unlockDate={new Date(unlockDate)} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Unlocks on {format(new Date(unlockDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewCapsule;