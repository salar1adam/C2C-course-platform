
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
    </div>
  );
}
