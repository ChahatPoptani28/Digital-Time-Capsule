import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
// framer-motion removed: design UI is now grid + per-image reaction/caption
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import API from "@/api/axios";
import { themes } from "../constants/themes";
const EMOJI_MIME = "application/x-timecapsule-emoji";


const emojiPalette = [
  "❤️", "✨", "🔥", "🎉", "🌸", "💌", "🥹", "🎵", "📸", "🌈",
  "⭐", "🦋", "🌙", "💫", "🎀", "🍀", "☀️", "🌊", "💜", "🎈",
  "💎", "🌺", "🎭", "🎨", "🌻", "🦄", "🎪", "🎸", "🎯", "🏆",
  "🎁", "🌹", "🍕", "🍰", "🧁", "⚡", "🌟", "🎬", "🎲", "🎯",
  "🦋", "🐢", "🦢", "🦚", "🦜", "🕊️", "🦅", "🦁", "🐯", "🐻",
  "🎺", "🎻", "🥁", "🎤", "🎧", "📚", "📖", "✏️", "🖌️", "🖍️",
];

const stickerTextColors = [
  "#ffffff", "#111827", "#e11d48", "#7c3aed", "#0ea5e9", "#22c55e", "#f97316", "#facc15",
  "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6",
  "#d946ef", "#3b82f6", "#84cc16", "#f87171", "#a855f7", "#4f46e5", "#0d9488", "#ea580c",
];

function newStickerId() {
  return globalThis.crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type Sticker =
  | {
      id: string;
      kind: "emoji";
      emoji: string;
      x: number;
      y: number;
      rotation: number;
      scale: number;
    }
  | {
      id: string;
      kind: "text";
      text: string;
      color: string;
      x: number;
      y: number;
      rotation: number;
      scale: number;
    }
  | {
      id: string;
      kind: "image";
      imageUrl: string;
      x: number;
      y: number;
      rotation: number;
      scale: number;
    };

const DesignCapsule = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const previewSurfaceRef = useRef<HTMLDivElement>(null);

  const [themeIndex, setThemeIndex] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [recentEmoji, setRecentEmoji] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropFlash, setDropFlash] = useState<{ x: number; y: number; id: number } | null>(null);
  const [stickerTool, setStickerTool] = useState<"emoji" | "text" | "image">("emoji");
  const [textValue, setTextValue] = useState("");
  const [textColor, setTextColor] = useState<string>("#111827");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [imageCaptions, setImageCaptions] = useState<Record<number, string>>({});
  const [imageReactions, setImageReactions] = useState<Record<number, string>>({});
  const [imageCaptionColors, setImageCaptionColors] = useState<Record<number, string>>({});

  const { title, message, media, unlockDate } = state || {};
  const mediaList = Array.isArray(media) ? media : [];
  const visualMedia = mediaList.filter((m: { type?: string }) => m.type !== "audio");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const bumpRecent = useCallback((emoji: string) => {
    setRecentEmoji((prev) => [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 6));
  }, []);

  const clampSticker = useCallback((x: number, y: number, scale: number) => {
    const el = previewSurfaceRef.current;
    const pad = 8;
    const size = 40 * scale;
    if (!el) return { x, y };
    const w = el.scrollWidth;
    const h = el.scrollHeight;
    return {
      x: Math.max(pad, Math.min(x, Math.max(pad, w - size))),
      y: Math.max(pad, Math.min(y, Math.max(pad, h - size))),
    };
  }, []);

  const addEmojiAt = useCallback(
    (emoji: string, x: number, y: number) => {
      if (!emojiPalette.includes(emoji)) return;
      const id = newStickerId();
      setStickers((prev) => {
        const { x: cx, y: cy } = clampSticker(x, y, 1);
        return [
          ...prev,
          {
            id,
            kind: "emoji",
            emoji,
            x: cx,
            y: cy,
            rotation: (Math.random() * 16 - 8) | 0,
            scale: 1,
          },
        ];
      });
      bumpRecent(emoji);
      setSelectedId(id);
      setDropFlash({ x, y, id: Date.now() });
    },
    [bumpRecent, clampSticker]
  );

  const addEmojiCentered = (emoji: string) => {
    if (!emojiPalette.includes(emoji)) return;
    const el = previewSurfaceRef.current;
    if (el) {
      const x = el.scrollLeft + el.clientWidth * 0.5 - 18;
      const y = el.scrollTop + el.clientHeight * 0.38;
      addEmojiAt(emoji, x, y);
    }
  };

  const addTextAt = (text: string, color: string, x: number, y: number) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = newStickerId();
    setStickers((prev) => {
      const { x: cx, y: cy } = clampSticker(x, y, 1);
      return [
        ...prev,
        {
          id,
          kind: "text",
          text: trimmed,
          color,
          x: cx,
          y: cy,
          rotation: (Math.random() * 16 - 8) | 0,
          scale: 1,
        },
      ];
    });
    setSelectedId(id);
  };

  const addImageAt = (imageUrl: string, x: number, y: number) => {
    const id = newStickerId();
    setStickers((prev) => {
      const { x: cx, y: cy } = clampSticker(x, y, 1);
      return [
        ...prev,
        {
          id,
          kind: "image",
          imageUrl,
          x: cx,
          y: cy,
          rotation: (Math.random() * 16 - 8) | 0,
          scale: 1,
        },
      ];
    });
    setSelectedId(id);
  };

  const addTextCentered = () => {
    const el = previewSurfaceRef.current;
    if (!el) return;
    const text = textValue.trim();
    if (!text) return;
    const x = el.scrollLeft + el.clientWidth * 0.5 - 80;
    const y = el.scrollTop + el.clientHeight * 0.38;
    addTextAt(text, textColor, x, y);
  };

  const addImageCentered = (imageUrl: string) => {
    const el = previewSurfaceRef.current;
    if (!el) return;
    const x = el.scrollLeft + el.clientWidth * 0.5 - 60;
    const y = el.scrollTop + el.clientHeight * 0.38;
    addImageAt(imageUrl, x, y);
  };

  const commitStickerDrag = (id: string, offsetX: number, offsetY: number) => {
    setStickers((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const cur = next[idx];
      const { x, y } = clampSticker(cur.x + offsetX, cur.y + offsetY, cur.scale);
      next[idx] = { ...cur, x, y };
      return next;
    });
  };

  const rotateSticker = (id: string) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rotation: (s.rotation + 22.5) % 360 } : s))
    );
  };

  const nudgeScale = (id: string, delta: number) => {
    setStickers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const scale = Math.min(2, Math.max(0.5, s.scale + delta));
        const { x, y } = clampSticker(s.x, s.y, scale);
        return { ...s, scale, x, y };
      })
    );
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  };

  useEffect(() => {
    if (!dropFlash) return;
    const t = window.setTimeout(() => setDropFlash(null), 600);
    return () => clearTimeout(t);
  }, [dropFlash]);

  // Keep the caption input synced with the selected tile
  useEffect(() => {
    if (selectedMediaIndex === null) return;
    setTextValue(imageCaptions[selectedMediaIndex] ?? "");
    setTextColor(imageCaptionColors[selectedMediaIndex] ?? "#111827");
  }, [selectedMediaIndex, imageCaptions, imageCaptionColors]);

 const handleSave = async () => {
  try {
    const formData = new FormData();

    // basic fields
    formData.append("title", title);
    formData.append("message", message);
    if (!unlockDate) {
      alert("Unlock date missing");
      return;
    }

    const safeDate = new Date(unlockDate);
    if (isNaN(safeDate.getTime())) {
      alert("Invalid unlock date");
      return;
    }

    formData.append("unlockDate", safeDate.toISOString());
    formData.append("theme", themes[themeIndex].id);
    formData.append("theme", selectedThemeId);
    // ✅ IMPORTANT: send actual files
  const validMedia = mediaList.filter((item) => {
  if (!item.file) return false;

  const type = item.file.type;

  return type.startsWith("image/") || type.startsWith("video/");
});

// 🔥 ONLY VALID FILES
validMedia.forEach((item) => {
  formData.append("media", item.file);
});
    // ✅ captions + reactions
    formData.append("imageCaptions", JSON.stringify(imageCaptions));
    formData.append("imageReactions", JSON.stringify(imageReactions));
    formData.append("imageCaptionColors", JSON.stringify(imageCaptionColors));

    // send request
    console.log("MEDIA LIST:", mediaList);
    console.log("FILES BEING SENT:", mediaList.map(m => m.file));
    console.log("VALID FILES:", validMedia.map(f => f.file.type));
    await API.post("/capsules", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

  const onEmojiDragStart = (e: React.DragEvent, emoji: string) => {
    e.dataTransfer.setData(EMOJI_MIME, emoji);
    e.dataTransfer.setData("text/plain", emoji);
    e.dataTransfer.effectAllowed = "copy";
  };

  const readDroppedEmoji = (e: React.DragEvent): string | null => {
    const fromMime = e.dataTransfer.getData(EMOJI_MIME);
    if (fromMime && emojiPalette.includes(fromMime)) return fromMime;
    const plain = e.dataTransfer.getData("text/plain").trim();
    if (plain && emojiPalette.includes(plain)) return plain;
    return null;
  };

  const onPreviewDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onPreviewDrop = (e: React.DragEvent) => {
    const emoji = readDroppedEmoji(e);
    const surface = previewSurfaceRef.current;
    if (!emoji || !surface) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = surface.getBoundingClientRect();
    const x = e.clientX - rect.left + surface.scrollLeft;
    const y = e.clientY - rect.top + surface.scrollTop;
    addEmojiAt(emoji, x, y);
  };

  const onImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Keep it reasonable so the page doesn't become heavy.
    if (file.size > 2_000_000) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      if (!url) return;
      addImageCentered(url);
      // allow re-selecting the same file
      if (e.target) e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!state) return <div>No Data</div>;

  const userName = localStorage.getItem("userName")?.split(" ")[0];
  const theme = themes[themeIndex];
  const selectedThemeId = theme.id;
  const isDarkFrame =
    theme.id === "midnight" ||
    theme.id === "midnight2" ||
    theme.id === "neon" ||
    theme.id === "coffee" ||
    theme.id === "starfield" ||
    theme.id === "retro" ||
    theme.id === "charcoal" ||
    theme.id === "galaxy";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn userName={userName} handleLogout={handleLogout} />

      <div className="flex flex-1 min-h-0 w-full">
        <aside
          className={`w-[7.4rem] sm:w-[9rem] shrink-0 border-r border-border/60 flex flex-col items-stretch gap-2 py-3 px-2 ${
            isDarkFrame ? "bg-slate-900/80" : "bg-card/40 backdrop-blur-sm"
          }`}
        >
          <p
            className={`text-[9px] uppercase tracking-wider text-center leading-tight px-0.5 font-medium ${
              isDarkFrame ? "text-violet-200/90" : "text-muted-foreground"
            }`}
          >
            Reactions & Captions
          </p>

          <div
            className={`flex items-center justify-center gap-1 rounded-lg p-1 ${
              isDarkFrame ? "bg-white/5" : "bg-black/5"
            }`}
          >
            <button
              type="button"
              onClick={() => setStickerTool("emoji")}
              className={`text-[11px] px-2 py-1 rounded-md transition ${
                stickerTool === "emoji"
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-primary/10"
              }`}
            >
              React
            </button>
            <button
              type="button"
              onClick={() => setStickerTool("text")}
              className={`text-[11px] px-2 py-1 rounded-md transition ${
                stickerTool === "text"
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-primary/10"
              }`}
            >
              Caption
            </button>
          </div>

          {selectedMediaIndex === null ? (
            <p
              className={`text-[8px] text-center leading-tight mt-2 ${
                isDarkFrame ? "text-slate-400" : "text-muted-foreground"
              }`}
            >
              Click a photo tile first
            </p>
          ) : (
            <>
              {stickerTool === "emoji" && (
                <>
                  <div className="flex flex-wrap justify-center gap-1 flex-1 min-h-0 overflow-y-auto max-h-[500px] mt-1">
                    {emojiPalette.map((e, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setImageReactions((prev) => ({ ...prev, [selectedMediaIndex]: e }));
                          setRecentEmoji((prev) => [e, ...prev.filter((x) => x !== e)].slice(0, 6));
                        }}
                        title={`React with ${e}`}
                        className={`text-xl leading-none p-1 rounded-lg transition active:scale-95 ${
                          isDarkFrame ? "hover:bg-white/10" : "hover:bg-primary/10"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant={isDarkFrame ? "secondary" : "outline"}
                    className="mt-auto h-7 text-[10px]"
                    onClick={() => setImageReactions((prev) => ({ ...prev, [selectedMediaIndex]: "" }))}
                  >
                    Clear reaction
                  </Button>
                </>
              )}

              {stickerTool === "text" && (
                <>
                  <div className="mt-1 flex flex-col gap-2">
                    <textarea
                      value={textValue}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTextValue(v);
                        setImageCaptions((prev) => ({ ...prev, [selectedMediaIndex]: v }));
                      }}
                      placeholder="Write a caption…"
                      rows={2}
                      className={`text-xs px-2 py-1 rounded-md w-full outline-none border resize-none ${
                        isDarkFrame
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-white border-black/10 text-black"
                      }`}
                    />

                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {stickerTextColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setTextColor(c);
                            setImageCaptionColors((prev) => ({ ...prev, [selectedMediaIndex]: c }));
                          }}
                          className="w-5 h-5 rounded-full ring-1 ring-black/10"
                          style={{
                            backgroundColor: c,
                            boxShadow:
                              textColor === c
                                ? "0 0 0 2px rgba(124,58,237,0.6)"
                                : undefined,
                          }}
                          aria-label={`Caption color ${c}`}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant={isDarkFrame ? "secondary" : "outline"}
                      className="mt-auto h-7 text-[10px]"
                      onClick={() => {
                        setTextValue("");
                        setImageCaptions((prev) => ({ ...prev, [selectedMediaIndex]: "" }));
                      }}
                    >
                      Clear caption
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </aside>

        <div className="flex-1 flex flex-col items-center justify-center min-w-0 p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:gap-3 shrink-0 w-full max-w-4xl justify-center flex-wrap">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="rounded-full shrink-0"
              onClick={() => setThemeIndex((prev) => (prev - 1 + themes.length) % themes.length)}
            >
              ◀
            </Button>
            <span
              className={`font-semibold text-center text-sm sm:text-base max-w-[10rem] sm:max-w-[12rem] truncate ${
                isDarkFrame ? "text-white" : ""
              }`}
              title={theme.name}
            >
              {theme.name}
            </span>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="rounded-full shrink-0"
              onClick={() => setThemeIndex((prev) => (prev + 1) % themes.length)}
            >
              ▶
            </Button>
          </div>

          <Card
            className={`w-full max-w-4xl min-h-[min(80vh,640px)] h-[min(80vh,640px)] relative overflow-hidden rounded-3xl shadow-2xl flex flex-col border-2 ${theme.class}`}
          >
            <div className="flex-1 min-h-0 flex flex-col pt-8 pb-12 px-3 sm:px-4">
              <div
                className={`flex-1 min-h-[200px] rounded-2xl border-2 relative overflow-y-auto ${
                  isDarkFrame ? "border-white/15 bg-white/5" : "border-primary/20 bg-black/[0.03]"
                }`}
              >
                <div className="relative h-full p-3 sm:p-4">
                  {visualMedia.length === 0 ? (
                    <div
                      className={`flex flex-col items-center justify-center h-full rounded-xl border border-dashed ${
                        isDarkFrame
                          ? "border-white/20 text-slate-300"
                          : "border-muted-foreground/25 text-muted-foreground"
                      }`}
                    >
                      <span className="text-4xl mb-2 opacity-60">🖼️</span>
                      <p className="text-sm text-center px-4">No photos/videos. Add images/videos in step 1.</p>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-3 sm:gap-4 w-full ${
                        visualMedia.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"
                      }`}
                    >
                      {visualMedia.map((item: { type: string; url: string }, i: number) => {
                        const isSelected = selectedMediaIndex === i;
                        const reaction = imageReactions[i] ?? "";
                        const caption = imageCaptions[i] ?? "";
                        const captionColor = imageCaptionColors[i] ?? "#ffffff";

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedMediaIndex(i)}
                            className={`relative rounded-xl overflow-hidden shadow-lg border bg-white/5 ${
                              isDarkFrame ? "border-white/10" : "border-black/5"
                            } ${isSelected ? "ring-2 ring-primary/60" : "ring-0"}`}
                          >
                            {item.type === "image" && (
                              <img src={item.url} alt="" draggable={false} className="w-full h-full object-cover select-none" />
                            )}
                            {item.type === "video" && (
                              <video src={item.url} draggable={false} className="w-full h-full object-cover bg-black/20" />
                            )}

                            {(reaction || caption) && (
                              <div className="absolute inset-0 pointer-events-none">
                                {reaction && (
                                  <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-lg text-white">
                                    {reaction}
                                  </div>
                                )}
                                {caption && (
                                  <div
                                    className="absolute bottom-0 left-0 right-0 bg-black/45 backdrop-blur-sm px-2 py-1 text-xs text-left line-clamp-3"
                                    style={{ color: captionColor }}
                                  >
                                    {caption}
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`absolute left-3 sm:left-4 bottom-3 sm:bottom-4 max-w-[min(100%,280px)] z-40 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg border pointer-events-none ${
                isDarkFrame ? "bg-black/40 border-white/10 text-slate-100" : "bg-white/85 border-black/5"
              }`}
            >
              <p className="text-sm font-medium line-clamp-5">{message}</p>
            </div>
          </Card>

          {/* description intentionally removed per request */}
        </div>

        <aside className="w-[200px] sm:w-[240px] shrink-0 border-l border-border/60 bg-card/30 backdrop-blur-sm p-3 sm:p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Audio</h3>

          {mediaList.filter((m: { type?: string }) => m.type === "audio").length === 0 ? (
            <p className="text-xs text-muted-foreground">No audio added</p>
          ) : (
            mediaList
              .filter((m: { type?: string }) => m.type === "audio")
              .map((a: { url: string }, i: number) => <audio key={i} controls src={a.url} className="w-full" />)
          )}

          <Button type="button" onClick={handleSave} className="mt-auto">
            Save Capsule
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default DesignCapsule;
