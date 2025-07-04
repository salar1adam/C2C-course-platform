'use client';

import Script from 'next/script';
import React from 'react';

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
  const swatchUrl = `https://fast.wistia.com/embed/medias/${videoId}/swatch`;
  const videoScriptUrl = `https://fast.wistia.com/embed/${videoId}.js`;

  // This is a bit of a hack to inject the dynamic style for the loading swatch.
  // Using a <style> tag directly in JSX is not ideal, but it's the most straightforward way
  // to implement Wistia's recommendation.
  const styleContent = `
    wistia-player[media-id='${videoId}']:not(:defined) {
      background: center / contain no-repeat url('${swatchUrl}');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%; /* Default to 16:9 aspect ratio for loading */
    }
  `;

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
