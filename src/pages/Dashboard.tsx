import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Clock, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CapsuleCard, { Capsule } from "@/components/CapsuleCard";

// Mock data for demonstration
const mockCapsules: Capsule[] = [
  {
    id: "1",
    title: "Message to Future Me",
    unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isUnlocked: false,
    hasMessage: true,
    hasImage: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Our Anniversary Memories 💕",
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isUnlocked: false,
    hasMessage: true,
    hasImage: true,
    hasVideo: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Birthday Surprise for Sarah",
    unlockDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isUnlocked: true,
    hasMessage: true,
    hasImage: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Graduation Day Reflections",
    unlockDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isUnlocked: false,
    hasMessage: true,
    createdAt: new Date(),
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [capsules] = useState<Capsule[]>(mockCapsules);
  const userName = "Alex";

  const unlockedCount = capsules.filter((c) => c.isUnlocked).length;
  const lockedCount = capsules.filter((c) => !c.isUnlocked).length;

  // 🔐 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Passing logout to Navbar */}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-heading font-semibold mb-4">
            Your Capsules
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map((capsule, index) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating Button */}
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
