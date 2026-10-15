import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import {
  DEFAULT_SIGNAGE_CONFIG,
  loadSignageConfig,
  saveSignageConfig,
  resetSignageConfig,
} from './utils/signageStorage';
import { EditorScreen } from './components/editor/EditorScreen';
import './App.css';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const HomeScreen = ({ config, onSelectTimeline }) => {
  const { general = {}, exhibitions = {} } = config || {};
  const timelineIds = ['timeline1', 'timeline2', 'timeline3', 'timeline4'];

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">{general.headerTitle || 'NEXUS Signage'}</h1>
        <p className="home-subtitle">{general.headerSubtitle || 'コンテンツを選択してください'}</p>
      </div>
      <div className="timeline-cards-grid">
        {timelineIds.map((id, index) => {
          const exhibition = exhibitions[id];
          if (!exhibition) return null;
          const firstScene = exhibition.scenes && exhibition.scenes[0] ? exhibition.scenes[0] : {};
          return (
            <motion.div
              key={id}
              className="timeline-card"
              onClick={() => onSelectTimeline(id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            >
              <div
                className="card-background"
                style={{ backgroundImage: `url(${firstScene.image})` }}
              />
              <div className="card-play-icon" />
              <div className="card-overlay">
                <h3 className="card-title">{exhibition.title}</h3>
                <p className="card-description">{exhibition.shortDesc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const TimelineIndicator = ({ total, current }) => (
  <div className="timeline-indicator">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`indicator-dot ${i === current ? 'active' : ''}`} />
    ))}
  </div>
);

const SceneContent = ({ scene, active, onVideoEnd }) => {
  if (scene.type === 'video') {
    return (
      <video
        className="video-background"
        src={scene.video}
        autoPlay
        muted
        playsInline
        key={scene.id || scene.video}
        onEnded={onVideoEnd}
      />
    );
  }

  return (
    <motion.div
      className="ken-burns-image"
      style={{ backgroundImage: `url(${scene.image})` }}
      initial={{ scale: 1, x: 0, y: 0 }}
      animate={active ? { scale: [1.1, 1], x: [10, -10], y: [-10, 10] } : {}}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
  );
};

const ProgressBar = ({ duration, isPaused, onComplete }) => {
  return (
    <div className="progress-bar-container">
      <motion.div
        className="progress-bar"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: isPaused ? Infinity : duration, ease: 'linear' }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
};

// Route helper for History API and Hash fallback
const getInitialRoute = () => {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  if (path === '/display' || hash === '#/display' || hash === '#display') return 'display';
  if (path === '/edit' || hash === '#/edit' || hash === '#edit') return 'edit';
  return 'landing';
};

/* ===== Landing Screen (トップページ) ===== */
const LandingScreen = ({ onEnterExhibition, onEnterEditor }) => {
  return (
    <div className="landing-page">
      <div className="landing-header">
        <span className="landing-badge">EHIME UNIVERSITY MUSEUM</span>
        <h1 className="landing-title">愛媛大学ミュージアム<br />デジタルサイネージ</h1>
      </div>

      <div className="landing-cards-container">
        {/* Exhibition Mode (展示用) */}
        <motion.div
          className="mode-card mode-card-exhibition"
          onClick={onEnterExhibition}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEnterExhibition();
            }
          }}
          aria-label="展示用サイネージを全画面で起動"
        >
          <div>
            <div className="mode-card-top">
              <div className="mode-card-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <span className="mode-card-chip chip-exhibition">展示モード</span>
            </div>
            <div className="mode-card-body">
              <h2 className="mode-card-title">展示用</h2>
              <p className="mode-card-desc">
                スライドショー展示を開始。右上の「全画面」で最大化可能。
              </p>
            </div>
          </div>
          <div className="mode-card-action">
            <span>サイネージを開く</span>
            <span className="action-arrow">→</span>
          </div>
        </motion.div>

        {/* Editor Mode (編集用) */}
        <motion.div
          className="mode-card mode-card-editor"
          onClick={onEnterEditor}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEnterEditor();
            }
          }}
          aria-label="編集・コンテンツ管理画面を開く"
        >
          <div>
            <div className="mode-card-top">
              <div className="mode-card-icon-wrapper" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <span className="mode-card-chip chip-editor">コンテンツ管理</span>
            </div>
            <div className="mode-card-body">
              <h2 className="mode-card-title">編集用</h2>
              <p className="mode-card-desc">
                タイトル・フッターや、4つの展示の静止画・動画・解説文を編集。
              </p>
            </div>
          </div>
          <div className="mode-card-action">
            <span>編集メニューへ</span>
            <span className="action-arrow">→</span>
          </div>
        </motion.div>
      </div>

      <div className="landing-tip-bar">
        <span className="landing-tip-icon">ℹ️</span>
        <span>
          <strong>操作案内:</strong> 展示用モードからは、右上の「終了」または [ESC] キーでいつでも戻れます。
        </span>
      </div>
    </div>
  );
};

function App() {
  // Routing: 'landing' (/) | 'display' (/display) | 'edit' (/edit)
  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  // Dynamic signage configuration loaded from IndexedDB
  const [config, setConfig] = useState(DEFAULT_SIGNAGE_CONFIG);

  // Signage state: null = show timeline selection, 'timeline1'...'timeline4' = show scene playback
  const [currentTimeline, setCurrentTimeline] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  // Load saved configuration on mount
  useEffect(() => {
    loadSignageConfig().then((loaded) => {
      if (loaded) {
        setConfig(loaded);
      }
    });
  }, []);

  // Save configuration and update state
  const handleSaveConfig = useCallback(async (newConfig, pendingMediaFiles) => {
    await saveSignageConfig(newConfig, pendingMediaFiles);
    setConfig(newConfig);
  }, []);

  // Reset to clean default config
  const handleResetToDefault = useCallback(async () => {
    const fresh = await resetSignageConfig();
    setConfig(fresh);
    return fresh;
  }, []);

  // Sync route with browser history
  const navigate = useCallback((route) => {
    setCurrentRoute(route);
    const targetPath = route === 'display' ? '/display' : route === 'edit' ? '/edit' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route }, '', targetPath);
    }
  }, []);

  // Listen to browser popstate (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goHome = useCallback(() => {
    setCurrentTimeline(null);
    setSceneIndex(0);
    setDirection(1);
  }, []);

  // Fullscreen state tracking
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  }, []);

  // Enter Exhibition (Navigates to display without forcing fullscreen)
  const handleEnterExhibition = useCallback(() => {
    goHome();
    navigate('display');
  }, [goHome, navigate]);

  // Exit Exhibition (Exits Fullscreen if active, and returns to Landing page)
  const handleExitExhibition = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
    goHome();
    navigate('landing');
  }, [goHome, navigate]);

  const changeScene = useCallback((newDirection) => {
    if (!currentTimeline || !config.exhibitions || !config.exhibitions[currentTimeline]) return;

    const timelineScenes = config.exhibitions[currentTimeline].scenes || [];
    const newIndex = sceneIndex + newDirection;

    if (newIndex < 0) {
      // At the beginning, go back to timeline selection
      goHome();
    } else if (newIndex >= timelineScenes.length) {
      // At the end, go back to timeline selection
      goHome();
    } else {
      setSceneIndex(newIndex);
      setDirection(newDirection);
    }
  }, [currentTimeline, config.exhibitions, sceneIndex, goHome]);

  const handleNextScene = useCallback(() => changeScene(1), [changeScene]);
  const handlePrevScene = useCallback(() => changeScene(-1), [changeScene]);

  const handleSelectTimeline = useCallback((timelineId) => {
    setCurrentTimeline(timelineId);
    setSceneIndex(0);
    setDirection(1);
  }, []);

  // Keyboard navigation: Arrow keys for scenes, Escape for returning
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (currentRoute === 'display') {
        if (event.key === 'ArrowRight' && currentTimeline) {
          handleNextScene();
        } else if (event.key === 'ArrowLeft' && currentTimeline) {
          handlePrevScene();
        } else if (event.key === 'Escape') {
          if (currentTimeline) {
            // First return to timeline selection
            goHome();
          } else {
            // On timeline selection, return to landing page
            handleExitExhibition();
          }
        }
      } else if (currentRoute === 'edit') {
        if (event.key === 'Escape') {
          navigate('landing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRoute, currentTimeline, handleNextScene, handlePrevScene, goHome, handleExitExhibition, navigate]);

  const bind = useGesture({
    onDrag: ({ down, direction: [xDir], distance, cancel }) => {
      if (!currentTimeline || currentRoute !== 'display') return;
      if (down && distance > window.innerWidth / 4) {
        const direction = xDir > 0 ? -1 : 1;
        changeScene(direction);
        cancel();
      }
    },
  });

  const currentExhibition = currentTimeline && config.exhibitions ? config.exhibitions[currentTimeline] : null;
  const currentScenes = currentExhibition ? currentExhibition.scenes : [];
  const currentScene = currentExhibition && currentScenes[sceneIndex] ? currentScenes[sceneIndex] : null;
  const currentDuration = (currentExhibition && currentExhibition.imageDuration) || 15;

  return (
    <div
      className="App"
      onMouseEnter={() => currentRoute === 'display' && currentTimeline && setIsPaused(true)}
      onMouseLeave={() => currentRoute === 'display' && currentTimeline && setIsPaused(false)}
      onTouchStart={() => currentRoute === 'display' && currentTimeline && setIsPaused(true)}
      onTouchEnd={() => currentRoute === 'display' && currentTimeline && setIsPaused(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="main-content">
        <AnimatePresence mode="wait">
          {currentRoute === 'landing' ? (
            <motion.div
              key="landing-route"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', height: '100%' }}
            >
              <LandingScreen
                onEnterExhibition={handleEnterExhibition}
                onEnterEditor={() => navigate('edit')}
              />
            </motion.div>
          ) : currentRoute === 'edit' ? (
            <motion.div
              key="edit-route"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', height: '100%' }}
            >
              <EditorScreen
                config={config}
                onSaveConfig={handleSaveConfig}
                onResetToDefault={handleResetToDefault}
                onBackToLanding={() => navigate('landing')}
                onLaunchExhibition={handleEnterExhibition}
              />
            </motion.div>
          ) : (
            <motion.div
              key="display-route"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              {/* Corner controls: Fullscreen & Exit buttons */}
              <div className="display-top-controls">
                <button
                  className="fullscreen-toggle-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFullscreen();
                  }}
                  title={isFullscreen ? '全画面表示を解除' : '全画面表示にする'}
                  aria-label={isFullscreen ? '全画面表示を解除' : '全画面表示にする'}
                >
                  <span className="control-icon">
                    {isFullscreen ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    )}
                  </span>
                  <span className="control-text">{isFullscreen ? '全画面解除' : '全画面'}</span>
                </button>

                <button
                  className="exit-exhibition-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExitExhibition();
                  }}
                  title="トップページに戻る (ESC)"
                  aria-label="ランディングページに戻る"
                >
                  <span className="exit-icon">✕</span>
                  <span className="exit-text">終了</span>
                  <span className="exit-shortcut-hint">[ESC]</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!currentTimeline ? (
                  <motion.div
                    key="signage-home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <HomeScreen config={config} onSelectTimeline={handleSelectTimeline} />
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentTimeline + sceneIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 },
                      }}
                      className="scene"
                      {...bind()}
                      style={{ touchAction: 'none' }}
                    >
                      {currentScene && (
                        <>
                          <TimelineIndicator total={currentScenes.length} current={sceneIndex} />
                          <SceneContent scene={currentScene} active={!isPaused} onVideoEnd={handleNextScene} />
                          <div className="overlay">
                            <h1 className="title">{currentScene.title}</h1>
                            <p className="description">{currentScene.description}</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </AnimatePresence>

              {currentScene && (
                <>
                  <button
                    className="back-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goHome();
                    }}
                    aria-label="タイムライン選択に戻る"
                  >
                    ホーム
                  </button>
                  <button
                    className="nav-button prev-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevScene();
                    }}
                    aria-label="Previous Scene"
                  />
                  <button
                    className="nav-button next-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextScene();
                    }}
                    aria-label="Next Scene"
                  />
                  {currentScene.type === 'image' && (
                    <ProgressBar
                      key={currentTimeline + '-' + sceneIndex}
                      duration={currentDuration}
                      isPaused={isPaused}
                      onComplete={() => !isPaused && handleNextScene()}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentRoute === 'display' && (
        <div className="footer-banner">
          <div className="footer-content">
            <div className="footer-logo-section">
              <img 
                src={config.general?.footerLogo || 'museum-mark.png'} 
                alt="Logo" 
                className="footer-logo" 
                onClick={() => {
                  navigate('landing');
                  goHome();
                }}
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  e.target.src = 'museum-mark.png';
                }}
              />
              <div>
                <p className="footer-tagline">
                  {config.general?.footerTagline || 'Museum of Science & Technology'}
                </p>
                <h2 className="footer-company-name">
                  {config.general?.footerCompanyName || 'NEXUS'}
                </h2>
                {config.general?.footerUrl && (
                  <p className="footer-url-text">{config.general.footerUrl}</p>
                )}
              </div>
            </div>
            <div className="footer-qr-section">
              <p className="footer-qr-text">
                {config.general?.footerQrTop || '愛媛大学ミュージアム'}
              </p>
              <img
                src={config.general?.footerQrCode || 'qrcode.png'} 
                alt="QR Code" 
                className="footer-qr-code" 
                onError={(e) => {
                  e.target.src = 'qrcode.png';
                }}
              />
              <p className="footer-qr-text">
                {config.general?.footerQrBottom || 'ポータルサイト'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
