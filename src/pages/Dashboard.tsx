import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CapsuleCard, { Capsule } from "@/components/CapsuleCard";
import API from "@/api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = localStorage.getItem("userName").split(' ')[0];

  const unlockedCount = capsules.filter((c) => c.isUnlocked).length;
  const lockedCount = capsules.filter((c) => !c.isUnlocked).length;

  /* =========================
     FETCH CAPSULES (Reusable)
  ========================= */

  const fetchCapsules = async () => {
    try {
      setLoading(true);

      const response = await API.get("/capsules");
      const data = response.data.data;

      const formattedCapsules: Capsule[] = data.map((c: any) => {
      const media = c.media || [];

      return {
        id: c._id,
        title: c.title,
        message: c.message,
        unlockDate: new Date(c.unlockDate),
        isUnlocked: c.status === "unlocked",
        media,
        hasMessage: !!c.message,
        hasImage: media.some((m: any) => m.type === "image"),
        hasVideo: media.some((m: any) => m.type === "video"),
        hasAudio: media.some((m: any) => m.type === "audio"),
        createdAt: new Date(c.unlockDate),
        };
      });

      setCapsules(formattedCapsules);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch capsules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* =========================
     LOADING / ERROR STATES
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">
          Loading capsules...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen pb-24">
      <Navbar
        isLoggedIn
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Hello, {userName} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Your memories are safely preserved and waiting for you.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card rounded-2xl p-5 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-heading font-bold">
              {capsules.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Capsules
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-locked" />
            <div className="text-2xl font-heading font-bold">
              {lockedCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Locked
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-unlocked" />
            <div className="text-2xl font-heading font-bold">
              {unlockedCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Unlocked
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-gold" />
            <div className="text-2xl font-heading font-bold">
              {capsules.filter((c) => c.hasImage || c.hasVideo).length}
            </div>
            <div className="text-sm text-muted-foreground">
              With Media
            </div>
          </div>
        </motion.div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No capsules yet.</p>
            <p className="text-sm mt-2">
              Create your first memory capsule ✨
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {capsules.map((capsule, index) => (
                <CapsuleCard
                  key={capsule.id}
                  capsule={capsule}
                  index={index}
                  onDelete={fetchCapsules}   
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Floating Create Button */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="fixed bottom-6 right-6"
        >
          <Link to="/create">
            <Button
              variant="hero"
              size="xl"
              className="rounded-full shadow-glow gap-2 px-6"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">
                Create New Capsule
              </span>
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;