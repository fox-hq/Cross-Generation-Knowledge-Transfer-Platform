
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "./components/ui/toaster";
import MainLayout from "./components/layout/main-layout";
import HomePage from "./pages/home-page";
import VideosPage from "./pages/videos-page.tsx";
import KnowledgeAIPage from "./pages/knowledge-ai-page.tsx";
import RetiredProfessionalsPage from "./pages/retired-professionals-page.tsx";
import AuthPage from "./pages/auth-page";
import MarketplacePage from "./pages/marketplace-page";
import MentorshipPage from "./pages/mentorship-page";
import CommunityPage from "./pages/community-page";
import CourseDetail from "./pages/course-detail";
import TranscriptionPage from "./pages/transcription-page";
import Checkout from "./pages/checkout";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/videos" component={VideosPage} />
        <Route path="/knowledge-ai" component={KnowledgeAIPage} />
        <Route path="/retired-professionals" component={RetiredProfessionalsPage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/marketplace" component={MarketplacePage} />
            <Route path="/mentorship" component={MentorshipPage} />
            <Route path="/community" component={CommunityPage} />
            <Route path="/course/:id" component={CourseDetail} />
            <Route path="/transcribe" component={TranscriptionPage} />
            <Route path="/checkout" component={Checkout} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
