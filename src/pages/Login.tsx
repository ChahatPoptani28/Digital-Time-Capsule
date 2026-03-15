import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Clock, Eye, EyeOff, AlertCircle } from "lucide-react";
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
import { loginUser } from "@/api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for pending verification email on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    setPendingVerificationEmail(storedEmail);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      console.log("Login response:", res.data);
      const token = res.data.token;
      const userName = res.data.userName;
      
      if (!token) {
        throw new Error("Token not received from backend");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      toast({
        title: "Login successful 🎉",
        description: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || "Login failed";
      
      // Check if the error is due to unverified account
      if (errorMessage.toLowerCase().includes("not verified") || 
          errorMessage.toLowerCase().includes("verify") ||
          errorMessage.toLowerCase().includes("email")) {
        // Set pending verification email and show the alert
        setPendingVerificationEmail(email);
        localStorage.setItem("pendingVerificationEmail", email);
        setError("");
        toast({
          title: "Email not verified ⚠️",
          description: "Please verify your email to continue",
        });
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
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
        </Link>

        <Card variant="glass" className="border-0 shadow-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-heading">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base">
              Your memories are safe with us 💜
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Pending Verification Alert */}
            {pendingVerificationEmail && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900">
                      Email not verified yet
                    </p>
                    <p className="text-sm text-amber-800 mt-1">
                      Account: <span className="font-medium">{pendingVerificationEmail}</span>
                    </p>
                    <p className="text-xs text-amber-700 mt-2">
                      Check your inbox for the verification code to complete your account setup.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        navigate("/verify-otp", {
                          state: { email: pendingVerificationEmail },
                        });
                      }}
                    >
                      Verify Email Now
                    </Button>
                    <button
                      type="button"
                      onClick={() => setPendingVerificationEmail(null)}
                      className="text-xs text-amber-600 hover:text-amber-700 mt-2 w-full text-center"
                    >
                      Try a different email
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
