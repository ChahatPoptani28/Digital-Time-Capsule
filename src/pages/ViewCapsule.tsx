import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import API from "@/api/axios";

// ================= MAIN =================

const ViewCapsule = () => {
  const { id } = useParams();

  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [themeIndex, setThemeIndex] = useState(0);

  const themes = ["classic", "floating", "minimal", "grid", "stack", "glass"];

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const res = await API.get(`/capsules/${id}`);
        setCapsule(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCapsule();
  }, [id]);

  useEffect(() => {
    if (capsule && !capsule.isLocked) {
      setTimeout(() => setRevealed(true), 500);
    }
  }, [capsule]);

  useEffect(() => {
    if (revealed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [revealed]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!capsule) return null;

  const { message, media, isLocked, unlockDate, title } = capsule;

  return (
    <div className="min-h-screen pb-12">
      <Navbar isLoggedIn userName={localStorage.getItem("userName")?.split(" ")[0]} />

      {showConfetti && <Confetti />}

      <main className="container mx-auto px-6 py-8 max-w-6xl">

        {!isLocked ? (
          <AnimatePresence mode="wait">
            {revealed && (
              <div className="relative">

                {/* BUTTONS */}
                <button
                  onClick={() => setThemeIndex((prev) => (prev - 1 + themes.length) % themes.length)}
                  className="absolute left-2 z-20 bg-white/80 p-3 rounded-full"
                >
                  ←
                </button>

                <button
                  onClick={() => setThemeIndex((prev) => (prev + 1) % themes.length)}
                  className="absolute right-2 z-20 bg-white/80 p-3 rounded-full"
                >
                  →
                </button>

                {/* CARD */}
                <div className="flex justify-center">
                  <motion.div
                    key={themeIndex}
                    className="w-full max-w-[1200px]"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -80) setThemeIndex((p) => (p + 1) % themes.length);
                      if (info.offset.x > 80) setThemeIndex((p) => (p - 1 + themes.length) % themes.length);
                    }}
                  >
                    {themes[themeIndex] === "classic" && <ClassicCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                    {themes[themeIndex] === "floating" && <FloatingCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                    {themes[themeIndex] === "minimal" && <MinimalCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                    {themes[themeIndex] === "grid" && <GridCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                    {themes[themeIndex] === "stack" && <StackCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                    {themes[themeIndex] === "glass" && <GlassCard message={message} media={media} setSelectedMedia={setSelectedMedia} />}
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        ) : (
          <Card className="max-w-xl mx-auto p-10 text-center">
            <h1>{title}</h1>
            <CountdownTimer unlockDate={new Date(unlockDate)} />
          </Card>
        )}

        {/* MODAL */}
        <AnimatePresence mode="wait">
          {selectedMedia && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setSelectedMedia(null)}
            >
              {selectedMedia.includes(".mp4") ? (
                <video src={selectedMedia} controls autoPlay className="max-h-[80%]" />
              ) : selectedMedia.includes(".mp3") ? (
                <audio src={selectedMedia} controls autoPlay />
              ) : (
                <img src={selectedMedia} className="max-h-[80%]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

// ================= MEDIA RENDERER =================

const MediaRenderer = ({ item, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-xl shadow-xl cursor-pointer transition hover:scale-105"
    >
      {/* POLAROID FRAME */}
      <div className="bg-white p-2 rounded-lg">
        {item.type === "image" && (
          <img
            src={item.url}
            onError={(e:any)=> e.target.src="/placeholder.png"}
            className="w-full h-[180px] object-cover rounded"
          />
        )}

        {item.type === "video" && (
          <video
            src={item.url}
            onError={(e:any)=> e.target.style.display="none"}
            controls
            className="w-full h-[180px] rounded"
          />
        )}

        {item.type === "audio" && (
          <div className="flex flex-col items-center">
            🎵
            <audio controls className="w-full mt-2">
              <source src={item.url} />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};
// ================= THEMES =================
const POSITION_SLOTS = [
  { top: "12%", left: "12%" },
  { top: "12%", left: "42%" },
  { top: "12%", left: "72%" },

  { top: "40%", left: "15%" },
  { top: "40%", left: "45%" },
  { top: "40%", left: "75%" },

  { top: "70%", left: "20%" },
  { top: "70%", left: "50%" },
  { top: "70%", left: "75%" },
];

const getPolaroidPositions = (count: number) => {
  const shuffled = [...POSITION_SLOTS].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map((pos, i) => ({
    top: pos.top,
    left: pos.left,
   rotate: Math.random() * 20 - 10,
    zIndex: i,
  }));
};

const ClassicCard = ({ message, media, setSelectedMedia }: any) => {
  const safeMedia = media || [];
  const limitedMedia = media.slice(0, 9);
  const visualMedia = limitedMedia.filter((m:any)=>m.type !== "audio");
const audioMedia = limitedMedia.filter((m:any)=>m.type === "audio");
  const [positions] = useState(getPolaroidPositions(visualMedia.length));
  if (!media || media.length === 0) {
  return (
    <Card className="h-[650px] flex items-center justify-center rounded-3xl">
      <p className="text-lg text-gray-500 text-center px-6">
        {message || "No memories found 💭"}
      </p>
    </Card>
  );
}
  return (
    <Card className="h-[650px] bg-[#fffaf0] rounded-3xl shadow-2xl p-6 relative overflow-hidden">

      {/* paper texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/paper-texture.png')]" />

      {/* MESSAGE */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-lg font-serif text-gray-700">{message}</p>
      </div>

      {visualMedia.map((item: any, i: number) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: positions[i].top,
            left: positions[i].left,
            transform: `rotate(${positions[i].rotate}deg)`,
            width: "180px",
          }}
        >
          <MediaRenderer
            item={item}
            onClick={() => setSelectedMedia(item.url)}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 flex-wrap justify-center max-w-[90%]">
  {audioMedia.map((item:any,i:number)=>(
    <MediaRenderer
      key={i}
      item={item}
      onClick={()=>setSelectedMedia(item.url)}
    />
  ))}
</div>
    </Card>
  );
};
const FloatingCard = ({ message, media, setSelectedMedia }: any) => {
  const limitedMedia = media.slice(0, 9);
  const visualMedia = limitedMedia.filter((m:any)=>m.type !== "audio");
const audioMedia = limitedMedia.filter((m:any)=>m.type === "audio");
  const [positions] = useState(getPolaroidPositions(visualMedia.length));
  if (!media || media.length === 0) {
  return (
    <Card className="h-[650px] flex items-center justify-center rounded-3xl">
      <p className="text-lg text-gray-500 text-center px-6">
        {message || "No memories found 💭"}
      </p>
    </Card>
  );
}
  return (
    
    <Card className="h-[650px] p-6 rounded-3xl overflow-hidden relative 
    bg-gradient-to-br from-violet-200 via-pink-100 to-blue-100 shadow-2xl">

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4),transparent)]" />

      {/* MESSAGE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center max-w-md">
        <p className="text-xl font-semibold text-gray-800 backdrop-blur-md bg-white/40 px-6 py-3 rounded-2xl">
          {message}
        </p>
      </div>

      {/* MEDIA */}
      {visualMedia.map((item: any, i: number) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: positions[i].top,
            left: positions[i].left,
            transform: `rotate(${positions[i].rotate}deg)`,
            width: "180px",
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <MediaRenderer
            item={item}
            onClick={() => setSelectedMedia(item.url)}
          />
        </motion.div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 flex-wrap justify-center max-w-[90%]">
  {audioMedia.map((item:any,i:number)=>(
    <MediaRenderer
      key={i}
      item={item}
      onClick={()=>setSelectedMedia(item.url)}
    />
  ))}
</div>
{media.length > 9 && (
  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg">
    +{media.length - 9} more
  </div>
)}
    </Card>
  );
};
const MinimalCard = ({ message, media, setSelectedMedia }: any) => {
  return (
    <Card className="h-[650px] bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl shadow-2xl p-10">

      <div className="text-center text-white mb-8">
        <p className="text-2xl tracking-wide">{message}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {media.map((item: any, i: number) => (
          <div className="hover:scale-105 transition">
            <MediaRenderer
              item={item}
              onClick={() => setSelectedMedia(item.url)}
            />
          </div>
        ))}
      </div>

    </Card>
  );
};

const GridCard = ({ message, media, setSelectedMedia }: any) => (
  <Card className="h-[650px] rounded-3xl p-10 shadow-2xl 
  bg-[radial-gradient(circle,#fbcfe8_10%,transparent_10%)] bg-[size:30px_30px]">

    <p className="text-center mb-6 text-lg font-medium">{message}</p>

    <div className="grid grid-cols-3 gap-6">
      {media.map((item: any, i: number) => (
        <div className="hover:rotate-2 transition">
          <MediaRenderer
            item={item}
            onClick={() => setSelectedMedia(item.url)}
          />
        </div>
      ))}
    </div>

  </Card>
);

const StackCard = ({ message, media, setSelectedMedia }: any) => (
  <Card className="h-[650px] bg-gradient-to-br from-yellow-100 to-orange-200 rounded-3xl p-10 shadow-2xl">

    <p className="text-center mb-6">{message}</p>

    <div className="flex justify-center items-center gap-6 flex-wrap">
      {media.map((item: any, i: number) => (
        <div
          style={{
            transform: `rotate(${(i % 5 - 2) * 5}deg) scale(${1 - i * 0.03})`,
            zIndex: 10 - i,
          }}
        >
          <MediaRenderer
            item={item}
            onClick={() => setSelectedMedia(item.url)}
          />
        </div>
      ))}
    </div>

  </Card>
);
const GlassCard = ({ message, media, setSelectedMedia }: any) => (
  <Card className="h-[650px] rounded-3xl p-10 backdrop-blur-xl 
  bg-white/20 border border-white/30 shadow-2xl">

    <p className="text-center mb-6 text-gray-800">{message}</p>

    <div className="grid grid-cols-3 gap-6">
      {media.map((item: any, i: number) => (
        <div className="backdrop-blur-md bg-white/30 p-2 rounded-xl">
          <MediaRenderer
            item={item}
            onClick={() => setSelectedMedia(item.url)}
          />
        </div>
      ))}
    </div>

  </Card>
);

export default ViewCapsule;