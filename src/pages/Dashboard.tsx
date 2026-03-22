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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | locked | unlocked
  const [sort, setSort] = useState("newest"); // newest | oldest
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
const filteredCapsules = capsules
  .filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.message?.toLowerCase().includes(search.toLowerCase())
  )
  .filter((c) => {
    if (filter === "locked") return !c.isUnlocked;
    if (filter === "unlocked") return c.isUnlocked;
    return true;
  })
  .sort((a, b) => {
    if (sort === "newest") {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
  });
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
          <p className="text-muted-foreground text-lg opacity-80">
            Your memories are safely preserved and waiting for you.
          </p>
        </motion.div>
        {/* 🔍 SEARCH + FILTER + SORT */}
{/* 🔥 PREMIUM CONTROL BAR */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-5 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg"
>
  <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

    {/* SEARCH */}
    <div className="relative w-full md:w-[300px]">
      <input
        type="text"
        placeholder="🔍 Search memories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-4 pr-4 py-2 rounded-xl border bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
    </div>

    {/* FILTER CHIPS */}
    <div className="flex gap-2 flex-wrap">
      {["all", "locked", "unlocked"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full text-sm transition ${
            filter === f
              ? "bg-primary text-white shadow-md"
              : "bg-white/70 hover:bg-white"
          }`}
        >
          {f === "all" && "All"}
          {f === "locked" && "Locked"}
          {f === "unlocked" && "Unlocked"}
        </button>
      ))}
    </div>

    {/* SORT BUTTONS */}
    <div className="flex gap-2">
      <button
        onClick={() => setSort("newest")}
        className={`px-4 py-2 rounded-xl ${
          sort === "newest"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-white/70"
        }`}
      >
        Newest
      </button>

      <button
        onClick={() => setSort("oldest")}
        className={`px-4 py-2 rounded-xl ${
          sort === "oldest"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-white/70"
        }`}
      >
        Oldest
      </button>
    </div>

  </div>
</motion.div>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="rounded-2xl p-5 text-center backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:scale-105 transition">
            <Gift className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-heading font-bold">
              {capsules.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Capsules
            </div>
          </div>

          <div className="rounded-2xl p-5 text-center backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:scale-105 transition">
            <Clock className="w-8 h-8 mx-auto mb-2 text-locked" />
            <div className="text-2xl font-heading font-bold">
              {lockedCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Locked
            </div>
          </div>

          <div className="rounded-2xl p-5 text-center backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:scale-105 transition">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-unlocked" />
            <div className="text-2xl font-heading font-bold">
              {unlockedCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Unlocked
            </div>
          </div>

          <div className="rounded-2xl p-5 text-center backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:scale-105 transition">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCapsules.map((capsule, index) => (
                <motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  <CapsuleCard
    key={capsule.id}
    capsule={capsule}
    index={index}
    onDelete={fetchCapsules}
  />
</motion.div>
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
              className="rounded-full shadow-xl gap-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 transition"
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