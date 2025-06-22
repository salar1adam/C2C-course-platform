import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

type VideoPlayerProps = {
  videoUrl: string;
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  let videoId: string | null = null;
  
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname.includes('youtube.com') && urlObject.searchParams.has('v')) {
      videoId = urlObject.searchParams.get('v');
    } else if (urlObject.hostname.includes('youtu.be')) {
      videoId = urlObject.pathname.substring(1).split('/')[0];
    }
  } catch (error) {
    // Not a valid URL, so it's not a YouTube link.
    return null;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return null;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="container mx-auto max-w-5xl">
        <div className="aspect-video w-full">
            {youTubeEmbedUrl ? (
                <iframe
                    className="w-full h-full rounded-lg shadow-2xl bg-black"
                    src={youTubeEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    key={videoUrl}
                ></iframe>
            ) : (
                <video
                    className="w-full h-full rounded-lg shadow-2xl bg-black"
                    controls
                    src={videoUrl}
                    key={videoUrl} // Ensures video re-renders if URL changes
                >
                    Your browser does not support the video tag.
                </video>
            )}
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
