import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Calendar,
  Image,
  Video,
  FileText,
  Trash2,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./CountdownTimer";
import API from "@/api/axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Capsule {
  id: string;
  title: string;
  message?: string;
  unlockDate: Date;
  isUnlocked: boolean;
  media?: {
    type: string;
    url: string;
  }[];
  hasImage?: boolean;
  hasVideo?: boolean;
  hasMessage?: boolean;
  createdAt: Date;
}

interface CapsuleCardProps {
  capsule: Capsule;
  index?: number;
  onDelete?: () => void;
}

const CapsuleCard = ({ capsule, index = 0, onDelete }: CapsuleCardProps) => {
  const {
    id,
    title,
    message,
    unlockDate,
    isUnlocked,
    hasImage,
    hasVideo,
    hasMessage,
  } = capsule;

  const navigate = useNavigate();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editMessage, setEditMessage] = useState(message || "");
  const [editDate, setEditDate] = useState("");
  const [editMedia, setEditMedia] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /* ================= FORMAT DATE FOR datetime-local ================= */

  const formatDateTimeLocal = (date: Date | string) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await API.delete(`/capsules/${id}`);

      toast({
        title: "Capsule deleted",
        description: "Memory removed successfully.",
      });

      onDelete?.();
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("message", editMessage);
      formData.append("unlockDate", editDate);

      if (editMedia.length > 0) {
        editMedia.forEach((file) => {
          formData.append("media", file);
        });
      }

      await API.put(`/capsules/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Capsule updated",
        description: "Memory updated successfully.",
      });

      setEditOpen(false);
      onDelete?.();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          variant={isUnlocked ? "unlocked" : "locked"}
          className="cursor-pointer overflow-hidden"
          onClick={() => navigate(`/capsule/${id}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 flex-1">
                {title}
              </CardTitle>

              <div className="flex items-center gap-3">
                {/* EDIT BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setEditTitle(title);
                    setEditMessage(message || "");
                    setEditDate(formatDateTimeLocal(unlockDate));

                    setEditOpen(true);
                  }}
                  className="text-primary hover:opacity-80 transition"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                {/* DELETE BUTTON */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={!isUnlocked}
                      onClick={(e) => e.stopPropagation()}
                      className={`transition ${
                        isUnlocked
                          ? "text-destructive hover:opacity-80"
                          : "text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogTitle className="text-destructive">
                      ⚠ Delete Capsule?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="pt-2">
                      This memory will be permanently removed.
                      <br />
                      <span className="font-medium text-destructive">
                        This action cannot be undone.
                      </span>
                    </AlertDialogDescription>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        Keep my memory
                      </AlertDialogCancel>

                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Badge
                  variant={isUnlocked ? "default" : "secondary"}
                  className={`${
                    isUnlocked
                      ? "bg-unlocked/20 text-unlocked border-unlocked/30"
                      : "bg-locked/20 text-locked border-locked/30"
                  }`}
                >
                  {isUnlocked ? (
                    <Unlock className="w-3 h-3 mr-1" />
                  ) : (
                    <Lock className="w-3 h-3 mr-1" />
                  )}
                  {isUnlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {hasMessage && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  <FileText className="w-3 h-3" />
                  <span>Message</span>
                </div>
              )}
              {hasImage && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  <Image className="w-3 h-3" />
                  <span>Photo</span>
                </div>
              )}
              {hasVideo && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  <Video className="w-3 h-3" />
                  <span>Video</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(unlockDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {!isUnlocked && (
                <CountdownTimer unlockDate={unlockDate} compact />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div
          onClick={() => setEditOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 w-full max-w-lg p-8 rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Edit Capsule ✏️
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 h-28"
              />

              <input
                type="datetime-local"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              {/* ================= MEDIA SECTION ================= */}


<div className="space-y-4">

  <h3 className="text-sm font-semibold">
    Current Media
  </h3>

  {capsule.media && capsule.media.length > 0 ? (
    <div className="grid grid-cols-3 gap-3">
      {capsule.media.map((item, index) => (
        <div
          key={index}
          className="relative rounded-xl overflow-hidden border"
        >
          {item.type === "image" && (
            <img
              src={item.url}
              className="w-full h-24 object-cover"
            />
          )}

          {item.type === "video" && (
            <video
              src={item.url}
              className="w-full h-24 object-cover"
            />
          )}

          {item.type === "audio" && (
            <div className="flex items-center justify-center h-24 bg-muted text-sm">
              🎵 Audio
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-xs text-muted-foreground">
      No media attached
    </p>
  )}

  {/* Drag & Drop Zone */}

  <div
    onDragOver={(e) => {
      e.preventDefault();
      setIsDragging(true);
    }}
    onDragLeave={() => setIsDragging(false)}
    onDrop={(e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      setEditMedia(files);
    }}
    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
      isDragging
        ? "border-primary bg-primary/10"
        : "border-muted"
    }`}
    onClick={() =>
      document.getElementById("editMediaInput")?.click()
    }
  >
    <p className="text-sm font-medium">
      Drag & Drop media here
    </p>
    <p className="text-xs text-muted-foreground">
      or click to upload
    </p>

    <input
      id="editMediaInput"
      type="file"
      multiple
      hidden
      onChange={(e) =>
        setEditMedia(
          e.target.files ? Array.from(e.target.files) : []
        )
      }
    />
  </div>

  {/* Selected Files Preview */}

  {editMedia.length > 0 && (
    <div className="grid grid-cols-3 gap-3">
      {editMedia.map((file, index) => (
        <div
          key={index}
          className="relative rounded-xl overflow-hidden border"
        >
          {file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(file)}
              className="w-full h-24 object-cover"
            />
          )}

          {file.type.startsWith("video/") && (
            <video
              src={URL.createObjectURL(file)}
              className="w-full h-24 object-cover"
            />
          )}

          {file.type.startsWith("audio/") && (
            <div className="flex items-center justify-center h-24 bg-muted text-sm">
              🎵 Audio
            </div>
          )}

          <button
            onClick={() =>
              setEditMedia((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
            className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  <p className="text-xs text-muted-foreground">
    Uploading new files will replace existing media.
  </p>

</div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  disabled={isUpdating}
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-xl bg-primary text-white disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CapsuleCard;