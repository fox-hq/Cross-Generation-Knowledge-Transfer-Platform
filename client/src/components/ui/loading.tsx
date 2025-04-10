import { Loader2 } from "lucide-react";

export function Loading() {
  return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Loading />
    </div>
  );
}
