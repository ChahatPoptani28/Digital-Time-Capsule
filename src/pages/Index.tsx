import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hourglass, Heart, Lock, Sparkles, Calendar, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import AnimatedHourglass from "@/components/AnimatedHourglass";

const Index = () => {
  const features = [
    {
      icon: Gift,
      title: "Create a Capsule",
      description: "Write a letter, upload photos, or record a video message for your future self or loved ones.",
      color: "from-primary to-primary-glow",
    },
    {
      icon: Lock,
      title: "Lock Until the Future",
      description: "Choose when your capsule unlocks — tomorrow, next year, or decades from now.",
      color: "from-accent-mint to-unlocked",
    },
    {
      icon: Sparkles,
      title: "Relive the Memory",
      description: "When the time comes, unlock your capsule and experience the magic of your past self.",
      color: " from-gold to-gold-glow",
    },
  ];

  const floatingElements = [
    { icon: Hourglass, delay: 0, x: "10%", y: "20%" },
    { icon: Heart, delay: 0.5, x: "85%", y: "15%" },
    { icon: Calendar, delay: 1, x: "75%", y: "70%" },
    { icon: Sparkles, delay: 1.5, x: "15%", y: "75%" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient - matching How It Works style */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/50 to-accent/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 via-transparent to-gold/30" />

        {/* Floating elements */}
        {floatingElements.map((el, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: el.delay, duration: 0.5 }}
            className="absolute hidden md:block"
            style={{ left: el.x, top: el.y }}
          >
            <div className="animate-float">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 backdrop-blur-sm flex items-center justify-center border border-primary/10">
                <el.icon className="w-8 h-8 text-primary/60" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Main content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <AnimatedHourglass size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Preserve your precious moments</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
            >
              Preserve Today's{" "}
              <span className="gradient-text">Memories</span>
              <br />
              for Tomorrow
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Create time-locked digital capsules filled with messages, photos, and videos. 
              Unlock them in the future and relive the magic of your most cherished moments.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Your Capsule
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </motion.div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-muted-foreground italic"
            >
              "Memories are timeless treasures of the heart"
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              How It <span className="gradient-gold">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to preserve your memories for the future
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card variant="glass" className="h-full hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    {/* Step number
                    <div className="text-6xl font-heading font-bold text-primary/10 mb-4">
                      {""}
                    </div> */}
                    
                    {/* Icon gift  */}
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-gold/5 to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Create your first time capsule today and surprise your future self with memories from this moment.
            </p>
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <AnimatedHourglass size={16} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold gradient-text">Time Capsule</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Digital Time Capsule. Made with 💜 for memories.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
