import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";
import Navbar from "@/components/Navbar";
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

  const [stickers, setStickers] = useState<any[]>([]);

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

      {/* ===== 3 SECTION LAYOUT ===== */}
      <main className="max-w-[1500px] mx-auto px-4 py-6 flex gap-6">

        {/* LEFT - STICKERS */}
  {/* 🔒 ONLY SHOW WHEN UNLOCKED */}
  {!isLocked && (
    <div className="w-[120px] bg-white/60 backdrop-blur-md rounded-2xl p-3 flex flex-col gap-4 shadow-xl">
      {["⭐","❤️","🔥","🎉","📸"].map((s,i)=>(
        <div
          key={i}
          draggable
          onDragStart={(e)=> e.dataTransfer.setData("sticker", s)}
          className="text-2xl text-center cursor-grab hover:scale-110"
        >
          {s}
        </div>
      ))}
    </div>
  )}

        {/* CENTER - CARD */}
        <div className="flex-1 relative">

          {!isLocked ? (
            <AnimatePresence mode="wait">
              {revealed && (
                <div className="relative">

                  {/* ARROWS */}
                  <button
                    onClick={() => setThemeIndex((p) => (p - 1 + themes.length) % themes.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full"
                  >←</button>

                  <button
                    onClick={() => setThemeIndex((p) => (p + 1) % themes.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full"
                  >→</button>

                  <motion.div
                    key={themeIndex}
                    className="w-full"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e,info)=>{
                      if(info.offset.x < -80) setThemeIndex(p=> (p+1)%themes.length)
                      if(info.offset.x > 80) setThemeIndex(p=> (p-1+themes.length)%themes.length)
                    }}
                    onDragOver={(e)=> e.preventDefault()}
                          onDrop={(e)=>{
        const emoji = e.dataTransfer.getData("sticker")
        const rect = e.currentTarget.getBoundingClientRect()

        // 🚫 prevent drop on media
        if ((e.target as HTMLElement).closest(".media-item")) return;

        setStickers(prev=>[
          ...prev,
          {
            id: Date.now(),
            emoji,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          }
        ])
      }}
                  >
                    {themes[themeIndex] === "classic" && <ClassicCard {...{message,media,setSelectedMedia}} />}
                    {themes[themeIndex] === "floating" && <FloatingCard {...{message,media,setSelectedMedia}} />}
                    {themes[themeIndex] === "minimal" && <MinimalCard {...{message,media,setSelectedMedia}} />}
                    {themes[themeIndex] === "grid" && <GridCard {...{message,media,setSelectedMedia}} />}
                    {themes[themeIndex] === "stack" && <StackCard {...{message,media,setSelectedMedia}} />}
                    {themes[themeIndex] === "glass" && <GlassCard {...{message,media,setSelectedMedia}} />}
                  </motion.div>

                  {/* STICKERS */}
                  {stickers.map((s)=>(
                    <motion.div
                      key={s.id}
                      drag
                      style={{ position:"absolute", top:s.y, left:s.x }}
                      className="text-2xl cursor-move"
                    >
                      {s.emoji}
                    </motion.div>
                  ))}

                </div>
              )}
            </AnimatePresence>
          ) : (
            <Card className="max-w-xl mx-auto p-10 text-center">
              <h1>{title}</h1>
              <CountdownTimer unlockDate={new Date(unlockDate)} />
            </Card>
          )}

        </div>

        {/* RIGHT - AUDIO */}
        <div className="w-[260px] bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl overflow-y-auto">
          <h3 className="font-semibold mb-4">🎵 Audio</h3>

          {media?.filter((m:any)=>m.type==="audio").map((a:any,i:number)=>(
            <div key={i} className="mb-4">
              <audio controls className="w-full">
                <source src={a.url}/>
              </audio>
            </div>
          ))}
        </div>

      </main>

      {/* MODAL */}
      <AnimatePresence>
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
    </div>
  );
};

// ================= MEDIA =================

const MediaRenderer = ({ item, onClick }: any) => (
  <div onClick={onClick} className="media-item bg-white p-3 rounded-xl shadow-xl cursor-pointer">
    {item.type === "image" && <img src={item.url} className="w-full h-[200px] object-cover rounded"/>}
    {item.type === "video" && <video src={item.url} controls className="w-full h-[200px]"/>}
  </div>
);

// ================= POSITIONS =================

const POS = [
  { top:"15%", left:"15%" },
  { top:"15%", left:"65%" },
  { top:"45%", left:"25%" },
  { top:"45%", left:"75%" },
  { top:"70%", left:"50%" }
];  
// ================= THEMES =================

const ClassicCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative bg-[#fdf6e3] p-6 rounded-3xl">
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {visual.map((item:any,i:number)=>(
        <div key={i} style={{
          position:"absolute",
          ...POS[i % POS.length],
          transform:`rotate(${(i%5-2)*5}deg)`,
          width:"240px"
        }}>
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </div>
      ))}
    </Card>
  );
};

const FloatingCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative bg-gradient-to-br from-indigo-200 to-pink-200">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {visual.map((item:any,i:number)=>(
        <motion.div key={i}
          style={{ position:"absolute", ...POS[i % POS.length], width:"240px" }}
          animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:4 }}
        >
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </motion.div>
      ))}
    </Card>
  );
};

const MinimalCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative bg-gray-100 rounded-3xl overflow-hidden">

      {/* MESSAGE */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {/* MEDIA */}
      {visual.map((item:any,i:number)=>(
        <div key={i}
          style={{
            position:"absolute",
            ...POS[i % POS.length],
            transform:`rotate(${(i%5-2)*4}deg)`,
            width:"260px"
          }}>
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </div>
      ))}
    </Card>
  );
};

const GridCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative rounded-3xl overflow-hidden
    bg-[radial-gradient(circle,#e0e0e0_10%,transparent_10%)] bg-[size:30px_30px]">

     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {visual.map((item:any,i:number)=>(
        <div key={i}
          style={{
            position:"absolute",
            ...POS[i % POS.length],
            transform:`rotate(${(i%5-2)*6}deg)`,
            width:"250px"
          }}>
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </div>
      ))}
    </Card>
  );
};

const StackCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative bg-gradient-to-br from-yellow-100 to-orange-200 rounded-3xl overflow-hidden">

    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {visual.map((item:any,i:number)=>(
        <div key={i}
          style={{
            position:"absolute",
            ...POS[i % POS.length],
            transform:`rotate(${(i%5-2)*8}deg) scale(${1 - i*0.05})`,
            width:"260px",
            zIndex:10-i
          }}>
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </div>
      ))}
    </Card>
  );
};

const GlassCard = ({ message, media=[], setSelectedMedia }: any) => {
  const visual = media.filter((m:any)=>m.type!=="audio").slice(0,6);

  return (
    <Card className="h-[85vh] relative rounded-3xl overflow-hidden
    bg-white/30 backdrop-blur-xl border border-white/40">

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="bg-white px-6 py-3 rounded-lg shadow-md">
    <p className="text-gray-700 font-handwriting text-sm text-center">
      {message}
    </p>
  </div>
</div>

      {visual.map((item:any,i:number)=>(
        <div key={i}
          style={{
            position:"absolute",
            ...POS[i % POS.length],
            transform:`rotate(${(i%5-2)*5}deg)`,
            width:"250px"
          }}>
          <MediaRenderer item={item} onClick={()=>setSelectedMedia(item.url)} />
        </div>
      ))}
    </Card>
  );
};

export default ViewCapsule;