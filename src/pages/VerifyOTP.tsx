import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Mail, CheckCircle2, RotateCw } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { verifyOTP, resendOTP } from "@/api/auth";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get email from state or localStorage (to allow resuming verification)
  const emailFromState = location.state?.email;
  const [email, setEmail] = useState<string | null>(emailFromState || localStorage.getItem("pendingVerificationEmail"));

  // Redirect to register if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // Warn user before leaving page (prevents accidental navigation away)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isVerified) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isVerified]);

  // Initialize resend timer on page load (30 seconds before user can request resend)
  useEffect(() => {
    setResendTimer(30);
  }, []);

  // Handle resend OTP timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    const newOtp = [...otp];

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Limit to single character per box
    if (value.length > 1) {
      newOtp[index] = value.slice(-1);
    } else {
      newOtp[index] = value;
    }

    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter a complete 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      // Verify OTP
      await verifyOTP({
        email,
        otp: otpString,
      });

      setIsVerified(true);

      // Clear pending verification email from localStorage on success
      localStorage.removeItem("pendingVerificationEmail");

      toast({
        title: "OTP Verified! 🎉",
        description: "Your account has been activated. Logging you in...",
      });

      // Auto-login after verification
      setTimeout(() => {
        navigate("/login", {
          state: { email },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "OTP verification failed");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      await resendOTP({ email });

      toast({
        title: "OTP Resent 📧",
        description: "Check your email for the new code",
      });

      // Start 30-second timer
      setResendTimer(30);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/5" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-10 right-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-10 left-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow"
          >
            <Clock className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <span className="font-heading font-bold text-2xl gradient-text">
            Time Capsule
          </span>
        </div>

        <Card variant="glass" className="border-0 shadow-card">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isVerified ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-4 flex justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>

            <CardTitle className="text-2xl font-heading">
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-base">
              {isVerified
                ? "Your account is now active. Redirecting to login..."
                : "Enter the 6-digit code sent to your email"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isVerified ? (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {/* Email Display */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>

                {/* OTP Input Boxes */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all
                          ${
                            digit
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card/50"
                          }
                          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                  >
                    <p className="text-sm text-destructive text-center">{error}</p>
                  </motion.div>
                )}

                {/* Verify Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || otp.some((digit) => !digit)}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>

                {/* Resend OTP */}
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  {resendTimer > 0 ? (
                    <p className="text-sm font-semibold text-primary">
                      Resend in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading || resendTimer > 0}
                      className="text-sm font-semibold text-primary hover:underline disabled:text-muted-foreground transition-colors flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" />
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Save & Exit Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    // Store email for later resumption
                    localStorage.setItem("pendingVerificationEmail", email || "");
                    toast({
                      title: "Email Saved 💾",
                      description: "You can resume verification anytime from the login page",
                    });
                    navigate("/login");
                  }}
                >
                  Save & Exit
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <p className="text-lg font-semibold text-green-600">
                    Account activated successfully! ✅
                  </p>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <button
            onClick={() => {
              localStorage.setItem("pendingVerificationEmail", email || "");
              navigate("/login");
            }}
            className="text-primary font-semibold hover:underline"
          >
            Continue later from login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
