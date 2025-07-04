'use client';

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

type WistiaPlayerProps = {
  videoId: string;
};

// Wistia uses a custom element, so we need to declare the type for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
      };
    }
  }
}

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const swatchUrl = `https://fast.wistia.com/embed/medias/${videoId}/swatch`;
  const videoScriptUrl = `https://fast.wistia.com/embed/${videoId}.js`;

  const styleContent = `
    wistia-player[media-id='${videoId}']:not(:defined) {
      background: center / contain no-repeat url('${swatchUrl}');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%; /* Default to 16:9 aspect ratio for loading */
    }
  `;

  if (!isMounted) {
    // Render a static placeholder on the server to prevent hydration mismatch.
    // This div will be replaced on the client once the component mounts.
    return (
      <div
        style={{
          paddingTop: '56.25%',
          background: `center / contain no-repeat url('${swatchUrl}')`,
          filter: 'blur(5px)',
        }}
      />
    );
  }

  return (
    <>
      <style>{styleContent}</style>
      <Script src={videoScriptUrl} strategy="lazyOnload" key={videoId} />
      <div className="w-full h-full [&>wistia-player]:w-full [&>wistia-player]:h-full">
        <wistia-player media-id={videoId}></wistia-player>
      </div>
    </>
  );
}
