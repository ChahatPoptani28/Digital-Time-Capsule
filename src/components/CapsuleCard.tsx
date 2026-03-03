import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {Lock,
  Unlock,
  Calendar,
  Image,
  Video,
  FileText,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./CountdownTimer";
import API from "@/api/axios";
import { useToast } from "@/hooks/use-toast";

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
import { useState } from "react";

export interface Capsule {
  id: string;
  title: string;
  unlockDate: Date;
  isUnlocked: boolean;
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
  const { id, title, unlockDate, isUnlocked, hasImage, hasVideo, hasMessage } =
    capsule;

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
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

          <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-primary font-medium">
              {isUnlocked ? "Open capsule →" : "View details →"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CapsuleCard;