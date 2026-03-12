import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Image,
  Video,
  FileText,
  Trash2,
  Pencil,
  Calendar,
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  /* ================= FORMAT DATE FOR datetime-local ================= */

 const formatDate = (date: Date | string) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

  if (!editTitle.trim()) {
    toast({
      title: "Title required",
      description: "Capsule title cannot be empty.",
      variant: "destructive",
    });
    return;
  }

  if (!editMessage.trim()) {
    toast({
      title: "Description required",
      description: "Capsule description cannot be empty.",
      variant: "destructive",
    });
    return;
  }

  if (editDate && new Date(editDate) <= new Date()) {
    toast({
      title: "Invalid date",
      description: "Unlock date must be in the future.",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsUpdating(true);

    await API.put(`/capsules/${id}`, {
      title: editTitle,
      message: editMessage,
      unlockDate: editDate
        ? new Date(editDate).toISOString()
        : undefined,
    });

    toast({
      title: "Capsule updated",
      description: "Memory updated successfully.",
    });

    setEditOpen(false);
    onDelete?.();

  } catch (err: any) {

    let backendMessage = "Something went wrong";

    if (err.response?.data?.message) {
      backendMessage = err.response.data.message;
    }

    if (backendMessage.includes("Path `title` is required")) {
      backendMessage = "Capsule title is required.";
    }

    if (backendMessage.includes("Path `message` is required")) {
      backendMessage = "Capsule description is required.";
    }

    toast({
      title: "Update failed",
      description: backendMessage,
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
              <CardTitle className="flex-1">
                {title.length < 18 ? title : title.slice(0,18)+"..."}
              </CardTitle>

              <div className="flex items-center gap-3">
         {/* EDIT BUTTON */}
            {!isUnlocked && (
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setEditTitle(title);
                  setEditMessage(message || "");
                  setEditDate(formatDate(unlockDate));
                  setIsUpdating(false);
                  setEditOpen(true);
                }}
                className="text-primary hover:opacity-80 transition"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}

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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl px-4 py-3 border bg-transparent hover:bg-transparent shadow-none text-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
                      !editDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editDate ? format(new Date(editDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[9999]"
                  align="start"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarComponent
                    mode="single"
                    selected={editDate ? new Date(editDate) : undefined}
                    onSelect={(date) => {
                      if (date) setEditDate(formatDate(date));
                    }}
                    disabled={(date) => date <= new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  disabled={isUpdating ||
                            !editTitle.trim() ||
                            !editMessage.trim()
                  }
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