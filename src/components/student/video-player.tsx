
import { Video } from 'lucide-react';
import { WistiaPlayer } from './wistia-player';

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
    return null;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return null;
}

function getGoogleDriveEmbedUrl(url: string): string | null {
  if (!url || !url.includes('drive.google.com')) {
    return null;
  }

  try {
    const urlObject = new URL(url);
    const pathParts = urlObject.pathname.split('/'); 
    const fileIdIndex = pathParts.indexOf('d');

    if (fileIdIndex !== -1 && pathParts.length > fileIdIndex + 1) {
      const fileId = pathParts[fileIdIndex + 1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  } catch (error) {
    return null;
  }

  return null;
}

function getWistiaId(url: string): string | null {
  if (!url) return null;
  // A simple regex to check for a typical 10-character Wistia ID.
  // It also ensures it's not a full URL by checking for common protocols or slashes.
  const wistiaIdRegex = /^[a-z0-9]{10}$/i;
  if (!url.includes('/') && !url.includes(':') && wistiaIdRegex.test(url)) {
    return url;
  }
  return null;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="container mx-auto max-w-5xl">
        <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg shadow-inner">
          <div className="text-center text-muted-foreground">
            <Video className="mx-auto h-12 w-12" />
            <p className="mt-2 text-lg font-semibold">No Video Available</p>
            <p>This lesson's content has not been uploaded yet.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const wistiaId = getWistiaId(videoUrl);
  if (wistiaId) {
    return (
      <div className="container mx-auto max-w-5xl">
        <div className="aspect-video w-full">
            <WistiaPlayer videoId={wistiaId} />
        </div>
      </div>
    );
  }

  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const googleDriveEmbedUrl = getGoogleDriveEmbedUrl(videoUrl);
  
  const embedUrl = youTubeEmbedUrl || googleDriveEmbedUrl;

  return (
    <div className="container mx-auto max-w-5xl">
        <div className="aspect-video w-full">
            {embedUrl ? (
                <iframe
                    className="w-full h-full rounded-lg shadow-2xl bg-black"
                    src={embedUrl}
                    title="Video Player"
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
                    key={videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    </div>
  );
}
