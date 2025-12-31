import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Unlock, Calendar, Image, Video, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./CountdownTimer";

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
}

const CapsuleCard = ({ capsule, index = 0 }: CapsuleCardProps) => {
  const { id, title, unlockDate, isUnlocked, hasImage, hasVideo, hasMessage } = capsule;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Link to={`/capsule/${id}`}>
        <Card variant={isUnlocked ? "unlocked" : "locked"} className="cursor-pointer overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 flex-1">{title}</CardTitle>
              <Badge
                variant={isUnlocked ? "default" : "secondary"}
                className={`shrink-0 ${
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
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Content indicators */}
            <div className="flex gap-2">
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

            {/* Unlock date / Countdown */}
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
              {!isUnlocked && <CountdownTimer unlockDate={unlockDate} compact />}
            </div>

            {/* Hover effect indicator */}
            <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-primary font-medium">
                {isUnlocked ? "Open capsule →" : "View details →"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CapsuleCard;
