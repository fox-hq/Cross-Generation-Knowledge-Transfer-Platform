import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ExplorePage from "@/pages/explore-page";
import CourseDetail from "@/pages/course-detail";
import MentorshipPage from "@/pages/mentorship-page";
import CommunityPage from "@/pages/community-page";
import MarketplacePage from "@/pages/marketplace-page";
import TranscriptionPage from "@/pages/transcription-page";
import Checkout from "@/pages/checkout";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import MainLayout from "@/components/layout/main-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/course/:id" component={CourseDetail} />
      <ProtectedRoute path="/mentorship" component={MentorshipPage} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <ProtectedRoute path="/marketplace" component={MarketplacePage} />
      <ProtectedRoute path="/transcribe" component={TranscriptionPage} />
      <ProtectedRoute path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
