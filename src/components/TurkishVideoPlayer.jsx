/*
 * Turkish Video Player Component
 * Plays a YouTube video every 10 minutes for Turkish players
 */

import React, { useState, useEffect, useRef } from 'react';

const TurkishVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(600); // 10 minutes in seconds
  const [videoEnded, setVideoEnded] = useState(false);
  const [canExit, setCanExit] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Check if user is from Turkey using Cloudflare IP country header
  const isTurkishPlayer = window.ssv?.country === 'tr';

  // video URL
  const videoUrl = 'https://www.youtube.com/watch?v=raWvCYgAMrY&ab_channel=02';

  useEffect(() => {
    if (!isTurkishPlayer) return;

    // timer
    countdownRef.current = setInterval(() => {
      setTimeUntilNext((prev) => {
        if (prev <= 1) {
          setIsPlaying(true);
          setVideoEnded(false);
          setCanExit(false);
          return 600; // Reset to 10 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isTurkishPlayer]);

  useEffect(() => {
    if (!isPlaying) return;

    // Create iframe for YouTube video
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/raWvCYgAMrY?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=raWvCYgAMrY&mute=0&volume=5`;
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999999;
      border: none;
      background: #000;
    `;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    // Add to document
    document.body.appendChild(iframe);
    videoRef.current = iframe;

    // Listen for video end (YouTube doesn't reliably fire this, so we'll use a timer)
    const videoDuration = 60000; // 1 minute in milliseconds
    const videoTimer = setTimeout(() => {
      setVideoEnded(true);
      setCanExit(true);
      setIsPlaying(false);
      if (videoRef.current) {
        document.body.removeChild(videoRef.current);
        videoRef.current = null;
      }
    }, videoDuration);

    // Prevent user from closing the video
    const preventClose = (e) => {
      if (!canExit) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Block various exit methods
    document.addEventListener('keydown', preventClose);
    document.addEventListener('beforeunload', preventClose);
    document.addEventListener('visibilitychange', preventClose);

    // Block right-click context menu
    const blockContextMenu = (e) => {
      if (!canExit) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('contextmenu', blockContextMenu);

    // Block escape key
    const blockEscape = (e) => {
      if (e.key === 'Escape' && !canExit) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('keydown', blockEscape);

    return () => {
      clearTimeout(videoTimer);
      document.removeEventListener('keydown', preventClose);
      document.removeEventListener('beforeunload', preventClose);
      document.removeEventListener('visibilitychange', preventClose);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockEscape);
    };
  }, [isPlaying, canExit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        document.body.removeChild(videoRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (!isTurkishPlayer) {
    return null;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 999998,
      fontFamily: 'monospace'
    }}>
      <div>🇹🇷 Türk Video Zamanlayıcısı</div>
      <div>Sonraki video: {formatTime(timeUntilNext)}</div>
      {isPlaying && (
        <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
          🪳 HAMAMBÖCEĞİ VİDEOSU ÇALIYOR!
        </div>
      )}
    </div>
  );
};

export default TurkishVideoPlayer;
