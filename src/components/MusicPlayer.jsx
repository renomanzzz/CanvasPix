import React, { useState, useEffect, useRef } from 'react';
import { t } from 'ttag';

const MusicPlayer = () => {
  const [musicPlayer, setMusicPlayer] = useState({
    isPlaying: localStorage.getItem('musicPlaying') === 'true',
    volume: parseFloat(localStorage.getItem('musicVolume')) || 0.5,
    currentTrack: parseInt(localStorage.getItem('currentTrack')) || 0,
    isExpanded: localStorage.getItem('musicPlayerExpanded') === 'true',
    isVisible: localStorage.getItem('musicPlayerVisible') === 'true'
  });
  const audioRef = useRef(null);

  const playlist = [
    {
      title: "Track 1",
      url: "/music/track1.mp3"
    },
    {
      title: "Track 2",
      url: "/music/track2.mp3"
    },
    {
      title: "Track 3",
      url: "/music/track3.mp3"
    }
  ];

  useEffect(() => {
    // Load music player state from localStorage
    const savedState = {
      isPlaying: localStorage.getItem('musicPlaying') === 'true',
      volume: parseFloat(localStorage.getItem('musicVolume')) || 0.5,
      currentTrack: parseInt(localStorage.getItem('currentTrack')) || 0,
      isExpanded: localStorage.getItem('musicPlayerExpanded') === 'true',
      isVisible: localStorage.getItem('musicPlayerVisible') === 'true'
    };
    setMusicPlayer(savedState);

    // Create audio element
    const audio = new Audio(playlist[savedState.currentTrack].url);
    audio.volume = savedState.volume;
    audio.loop = true;
    audioRef.current = audio;

    if (savedState.isPlaying) {
      audio.play().catch(err => console.log('Auto-play prevented:', err));
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlayer.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Play prevented:', err));
      }
      const newState = { ...musicPlayer, isPlaying: !musicPlayer.isPlaying };
      setMusicPlayer(newState);
      localStorage.setItem('musicPlaying', newState.isPlaying);
    }
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      const newState = { ...musicPlayer, volume: newVolume };
      setMusicPlayer(newState);
      localStorage.setItem('musicVolume', newVolume);
    }
  };

  const changeTrack = (index) => {
    if (audioRef.current) {
      audioRef.current.src = playlist[index].url;
      if (musicPlayer.isPlaying) {
        audioRef.current.play().catch(err => console.log('Play prevented:', err));
      }
      const newState = { ...musicPlayer, currentTrack: index };
      setMusicPlayer(newState);
      localStorage.setItem('currentTrack', index);
    }
  };

  const toggleExpand = () => {
    const newState = { ...musicPlayer, isExpanded: !musicPlayer.isExpanded };
    setMusicPlayer(newState);
    localStorage.setItem('musicPlayerExpanded', newState.isExpanded);
  };

  const toggleVisibility = () => {
    const newState = { ...musicPlayer, isVisible: !musicPlayer.isVisible };
    setMusicPlayer(newState);
    localStorage.setItem('musicPlayerVisible', newState.isVisible);
  };

  return (
    <>
      <button
        onClick={toggleVisibility}
        style={{
          position: 'fixed',
          top: '57px',
          right: '15px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: 'none',
          color: '#fff',
          padding: '8px',
          borderRadius: '30%',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '16px',
          width: '37px',
          height: '37px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🎵
      </button>
      {musicPlayer.isVisible && (
        <div style={{
          position: 'fixed',
          top: '15px',
          right: '55px',
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '10px',
          borderRadius: '8px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: musicPlayer.isExpanded ? '200px' : 'auto',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleMusic}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {musicPlayer.isPlaying ? '⏸️' : '▶️'}
            </button>
            {musicPlayer.isExpanded && (
              <span style={{ 
                color: '#fff', 
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px'
              }}>
                {playlist[musicPlayer.currentTrack].title}
              </span>
            )}
            <button
              onClick={toggleExpand}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: 'auto',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {musicPlayer.isExpanded ? '▼' : '▲'}
            </button>
          </div>
          {musicPlayer.isExpanded && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fff', fontSize: '12px' }}>🔈</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicPlayer.volume}
                  onChange={changeVolume}
                  style={{ 
                    width: '80px',
                    height: '4px',
                    WebkitAppearance: 'none',
                    background: '#4a90e2',
                    borderRadius: '2px',
                    outline: 'none'
                  }}
                />
                <span style={{ color: '#fff', fontSize: '12px' }}>🔊</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {playlist.map((track, index) => (
                  <button
                    key={index}
                    onClick={() => changeTrack(index)}
                    style={{
                      background: musicPlayer.currentTrack === index ? '#4a90e2' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (musicPlayer.currentTrack !== index) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (musicPlayer.currentTrack !== index) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(MusicPlayer); 