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
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { themes } from "../constants/themes";
const ViewCapsule = () => {
  const { id } = useParams();

  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (capsule && capsule.isUnlocked) {
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

  const { title, message, unlockDate, isUnlocked, createdAt, media, theme } = capsule;
  const selectedTheme = themes.find((t) => t.id === theme);
  const images = media?.filter((m: any) => m.type === "image");
  const videos = media?.filter((m: any) => m.type === "video");
const audios = (media || []).filter((m: any) => m.type === "audio");
  const safeUnlockDate = unlockDate ? new Date(unlockDate) : null;


  return (
    <div className="min-h-screen pb-12">
      <Navbar isLoggedIn userName={localStorage.getItem("userName").split(' ')[0]} />

      {showConfetti && <Confetti />}

      <main className="w-full px-6 py-10 flex justify-center">
        <div className="flex justify-center">
  <div
  className={`w-full max-w-[1400px] lg:max-w-[1600px] xl:max-w-[1800px]
  rounded-[40px] shadow-2xl p-12 
  mx-auto ${selectedTheme?.class || ""}`}
>
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {isUnlocked ? (
          /* 🔓 UNLOCKED VIEW */
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-heading font-bold mb-2">
                    {title}
                  </h1>
                  <div className="flex justify-center mt-4">

</div>

                  <p className="text-muted-foreground">
                    Created on {format(new Date(createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
                  <div className="mb-10">
                <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl px-6 py-4 shadow-md text-center">
                  <p className="text-lg font-medium leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

                {/* Media */}
                
                {/* 📸 POLAROID MEDIA */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
  {[...images, ...videos].map((item: any, index: number) => (
    <div
      key={index}
      className="bg-white p-3 rounded-lg shadow-xl w-[300px] hover:scale-105 transition backdrop-blur-xl border border-white/20"
    >
      {/* IMAGE */}
      {item.type === "image" && (
        <img
          src={item.url}
          className="w-full h-80 object-cover rounded"
        />
      )}

      {/* VIDEO */}
      {item.type === "video" && (
        <video
          src={item.url}
          controls
          className="w-full h-80 object-cover rounded"
        />
      )}

      {/* CAPTION */}
      {item.caption && (
        <p
          className="text-center mt-2 text-sm font-medium"
          style={{ color: item.captionColor }}
        >
          {item.caption}
        </p>
      )}

      {/* REACTION */}
      {item.reaction && (
        <div className="text-center text-xl mt-1">
          {item.reaction}
        </div>
      )}
    </div>
  ))}
</div>
{/* 🎧 AUDIO SECTION */}
{audios.length > 0 && (
  <div className="mt-16">
    <h2 className="text-2xl font-semibold mb-6 text-center">
      🎧 Audio Memories
    </h2>

    <div className="max-w-3xl mx-auto space-y-4">
      {audios.map((audio: any, index: number) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-md"
        >
          <audio controls className="w-full">
            <source src={audio.url} />
          </audio>
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
                {safeUnlockDate && (
  <CountdownTimer unlockDate={safeUnlockDate} />
)}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Unlocks on{" "}
{safeUnlockDate
  ? format(safeUnlockDate, "MMMM d, yyyy")
  : "Loading..."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
        </div>
      </main>
    </div>

  );
};

export default ViewCapsule;