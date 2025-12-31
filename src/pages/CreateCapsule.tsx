import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Image, Video, FileText, Sparkles, X, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateCapsule = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState<Date>();
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate capsule creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Capsule sealed! ✨",
        description: `Your memory will unlock on ${format(unlockDate!, "PPP")}`,
      });
      navigate("/dashboard");
    }, 1500);
  };

  const isStep1Complete = title.length > 0;
  const isStep2Complete = message.length > 0;
  const isStep3Complete = unlockDate !== undefined;

  const steps = [
    { number: 1, title: "Title", complete: isStep1Complete },
    { number: 2, title: "Memory", complete: isStep2Complete },
    { number: 3, title: "Lock Date", complete: isStep3Complete },
  ];

  return (
    <div className="min-h-screen pb-12">
      <Navbar isLoggedIn userName="Alex" />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Create a <span className="gradient-text">Time Capsule</span>
          </h1>
          <p className="text-muted-foreground">
            Preserve your thoughts, photos, and memories for the future
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          {steps.map((s) => (
            <button
              key={s.number}
              onClick={() => setStep(s.number)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                step === s.number
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : s.complete
                  ? "bg-unlocked/20 text-unlocked"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
                  step === s.number
                    ? "bg-primary-foreground/20"
                    : s.complete
                    ? "bg-unlocked/20"
                    : "bg-foreground/10"
                )}
              >
                {s.complete && step !== s.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  s.number
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
            </button>
          ))}
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Title */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Give your capsule a title
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., Message to Future Me, Our Anniversary..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    This will help you identify your capsule later
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="hero"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Complete}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Message & Media */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Write your message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Dear future me... &#10;&#10;Write something meaningful that your future self will treasure."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>

              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Add photos or videos
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Optional)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Upload area */}
                  <label className="block">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF, MP4 up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {/* Preview images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {images.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="button"
                  variant="hero"
                  onClick={() => setStep(3)}
                  disabled={!isStep2Complete}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Unlock Date */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    When should this capsule unlock?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !unlockDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {unlockDate ? format(unlockDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={unlockDate}
                        onSelect={setUnlockDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Quick date options */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { label: "1 Week", days: 7 },
                      { label: "1 Month", days: 30 },
                      { label: "6 Months", days: 180 },
                      { label: "1 Year", days: 365 },
                      { label: "5 Years", days: 365 * 5 },
                    ].map((option) => (
                      <Button
                        key={option.label}
                        type="button"
                        variant="soft"
                        size="sm"
                        onClick={() =>
                          setUnlockDate(
                            new Date(Date.now() + option.days * 24 * 60 * 60 * 1000)
                          )
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              {unlockDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card variant="unlocked" className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold mb-3">Capsule Preview</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-muted-foreground">Title:</span>{" "}
                          <span className="font-medium">{title}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Unlocks:</span>{" "}
                          <span className="font-medium">{format(unlockDate, "PPP")}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Contents:</span>{" "}
                          <span className="font-medium">
                            Message{images.length > 0 && `, ${images.length} photo(s)`}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={!isStep3Complete || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                    />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Seal My Capsule
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </main>
    </div>
  );
};

export default CreateCapsule;
