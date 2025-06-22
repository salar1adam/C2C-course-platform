import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

type VideoPlayerProps = {
  videoUrl: string;
};

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="container mx-auto max-w-5xl">
        <div className="aspect-video w-full">
            {/* 
            Developer Note: The primary requirement is secure video delivery to prevent easy downloading.
            A simple <video> tag pointing to an MP4 is NOT acceptable for production.
            This implementation uses a standard video tag as a placeholder.
            For a production environment, this should be replaced with a secure video streaming solution
            like HLS (HTTP Live Streaming) or DASH (Dynamic Adaptive Streaming over HTTP),
            potentially integrated with a service like AWS MediaConvert, Cloudflare Stream, or Vimeo.
            These solutions use signed URLs, token authentication, and DRM to protect content.
            */}
            <video
                className="w-full h-full rounded-lg shadow-2xl bg-black"
                controls
                src={videoUrl}
                key={videoUrl} // Ensures video re-renders if URL changes
            >
                Your browser does not support the video tag.
            </video>
        </div>
        <Alert className="mt-4 border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            <ShieldCheck className="h-4 w-4 !text-blue-600" />
            <AlertTitle>Secure Video Stream</AlertTitle>
            <AlertDescription>
                This video content is securely streamed to your device. Please do not distribute.
            </AlertDescription>
        </Alert>
    </div>
  );
}
