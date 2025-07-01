import React from "react";

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
  return (
    <div className="w-full max-w-md">
      <audio controls className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};