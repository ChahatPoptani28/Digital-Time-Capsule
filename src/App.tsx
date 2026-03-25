import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import CreateCapsule from "./pages/CreateCapsule";
import ViewCapsule from "./pages/ViewCapsule";
import DesignCapsule from "./pages/DesignCapsule";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* STEP 1: CREATE CAPSULE */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateCapsule />
              </ProtectedRoute>
            }
          />

          {/* STEP 2: DESIGN CAPSULE (NEW PAGE) */}
          <Route
            path="/design"
            element={
              <ProtectedRoute>
                <DesignCapsule />
              </ProtectedRoute>
            }
          />

          {/* VIEW CAPSULE (NO DESIGN EDIT HERE) */}
          <Route
            path="/capsule/:id"
            element={
              <ProtectedRoute>
                <ViewCapsule />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;