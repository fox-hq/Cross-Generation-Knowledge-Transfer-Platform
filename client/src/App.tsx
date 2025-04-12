
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "./components/ui/toaster";
import MainLayout from "./components/layout/main-layout";
import { Suspense, lazy } from "react";
import { LoadingPage } from "./components/ui/loading";
import { ProtectedRoute } from "./lib/protected-route";

const HomePage = lazy(() => import("./pages/home-page"));
const VideosPage = lazy(() => import("./pages/videos-page"));
const ValidateWorkPage = lazy(() => import("./pages/validate-work-page"));
const KnowledgeAIPage = lazy(() => import("./pages/knowledge-ai-page"));
const RetiredProfessionalsPage = lazy(() => import("./pages/retired-professionals-page"));
const AuthPage = lazy(() => import("./pages/auth-page"));
const MarketplacePage = lazy(() => import("./pages/marketplace-page"));
const MentorshipPage = lazy(() => import("./pages/mentorship-page"));
const CommunityPage = lazy(() => import("./pages/community-page"));
const CourseDetail = lazy(() => import("./pages/course-detail"));
const TranscriptionPage = lazy(() => import("./pages/transcription-page"));
const Checkout = lazy(() => import("./pages/checkout"));
const NotFound = lazy(() => import("./pages/not-found"));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Suspense fallback={<LoadingPage />}>
            <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/videos" component={VideosPage} />
        <Route path="/knowledge-ai" component={KnowledgeAIPage} />
        <Route path="/retired-professionals" component={RetiredProfessionalsPage} />
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/marketplace" component={MarketplacePage} />
            <ProtectedRoute path="/mentorship" component={MentorshipPage} />
            <ProtectedRoute path="/community" component={CommunityPage} />
            <ProtectedRoute path="/validate-work" component={ValidateWorkPage} />
            <Route path="/course/:id" component={CourseDetail} />
            <Route path="/transcribe" component={TranscriptionPage} />
            <Route path="/checkout" component={Checkout} />
            <Route component={NotFound} />
          </Switch>
          </Suspense>
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
