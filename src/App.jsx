import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import './App.css';

const timelines = {
  timeline1: [
    {
      id: 1,
      type: 'image',
      image: 'space.jpg',
      title: '宇宙・航空事業部',
      description: '当社の宇宙・航空事業部では、最先端の精密加工技術と新素材開発の知見を融合させ、次世代の衛星構造体やロケットエンジン部品の開発に取り組んでいます。過酷な宇宙環境に耐えうる超軽量・高強度のコンポーネントは、国内外の主要な宇宙プロジェクトで採用されており、人類のフロンティア拡大を技術で支えています。また、培った航空技術を活かし、eVTOL（空飛ぶクルマ）などの次世代都市交通インフラにおける基幹部品の供給を行い、空の移動の民主化と持続可能な空のインフラ構築に貢献しています。未来の空と宇宙を、当社の技術が繋ぎます。'
    },
    {
      id: 2,
      type: 'video',
      video: 'Artifficial-Satellite.mp4',
      title: '宇宙・航空事業部 - Vision',
      description: '広大なフロンティアへ向けた、当社の挑戦。'
    }
  ],
  timeline2: [
    {
      id: 3,
      type: 'image',
      image: 'bio.jpg',
      title: 'バイオ・ライフサイエンス事業部',
      description: '生命の神秘を工学の視点で紐解くバイオ・ライフサイエンス事業部では、ゲノム編集技術や幹細胞工学を応用した創薬支援プラットフォームの開発から、機能性新素材の創出まで幅広く手掛けています。当社の微細加工技術によって実現した高精度なバイオチップは、迅速な診断と効率的な治療計画の策定を可能にし、個別化医療の進展に寄与しています。また、バイオプラスチックや微生物を用いた環境浄化ソリューションの開発を通じて、人々の健康と地球の健全性を同時に守る「持続可能な豊かさ」の実現を目指しています。技術を通じて、生命の可能性を最大限に引き出します。'
    },
    {
      id: 4,
      type: 'video',
      video: 'Bio_Chip_Laser_Scan_Video.mp4',
      title: 'バイオ・ライフサイエンス - Tech',
      description: 'ナノレベルの精密さと、生命への敬意。'
    }
  ],
  timeline3: [
    {
      id: 5,
      type: 'image',
      image: 'robot.jpg',
      title: 'AI・ロボティクス開発本部',
      description: 'AI・ロボティクス開発本部では、ディープラーニングと高度なセンシング技術を統合し、自律的に状況を判断し行動する次世代産業用ロボットの開発を推進しています。人間と協調して働くコボット（協働ロボット）は、複雑な組立工程や物流現場での負荷を劇的に軽減し、生産性の向上と安全性の確保を高いレベルで両立させています。さらに、現場のビッグデータをリアルタイムで解析する産業用AIプラットフォームにより、故障の予兆検知やプロセスの自動最適化を実現。製造業のデジタルツイン化を強力にバックアップし、スマートファクトリーの未来を技術の力で切り拓いていきます。'
    },
    {
      id: 6,
      type: 'video',
      video: 'Robotic_Arm_Assembling_Circuit_Board.mp4',
      title: 'AI・ロボティクス - Innovation',
      description: '知能と物理の融合が、産業の形を変える。'
    }
  ],
  timeline4: [
    {
      id: 7,
      type: 'image',
      image: 'energy.jpg',
      title: 'グリーンエネルギー事業推進室',
      description: '気候変動問題の解決をミッションに掲げるグリーンエネルギー事業推進室は、再生可能エネルギーの主力電源化を目指し、次世代太陽電池や超大型風力発電機用コンポーネントの研究開発を行っています。特に、エネルギーを高効率で蓄える全固体電池技術や、水素製造・貯蔵システムの構築において、当社の触媒技術と材料工学が決定的な役割を果たしています。スマートグリッドによる電力需給の最適化ソリューションも展開し、カーボンニュートラルな社会の実現に向けたトータルエネルギーマネジメントを提供。クリーンなエネルギーが社会を巡る、循環型の未来を確かな技術力で描いています。'
    },
    {
      id: 8,
      type: 'video',
      video: 'Solar-Panel.mp4',
      title: 'グリーンエネルギー - Sustainable',
      description: '地球と共生する、新しいエネルギーの循環。'
    }
  ],
};

// Timeline metadata for the home screen cards
const timelineMeta = {
  timeline1: { title: '宇宙・航空事業部', shortDesc: '次世代衛星・ロケット技術' },
  timeline2: { title: 'バイオ・ライフサイエンス事業部', shortDesc: 'ゲノム編集・創薬支援' },
  timeline3: { title: 'AI・ロボティクス開発本部', shortDesc: '自律型ロボット・産業AI' },
  timeline4: { title: 'グリーンエネルギー事業推進室', shortDesc: '再生可能エネルギー技術' },
};

const DURATION = 15; // Image scene duration

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

const HomeScreen = ({ onSelectTimeline }) => {
  const timelineIds = Object.keys(timelines);

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">NEXUS Signage</h1>
        <p className="home-subtitle">コンテンツを選択してください</p>
      </div>
      <div className="timeline-cards-grid">
        {timelineIds.map((id, index) => {
          const firstScene = timelines[id][0];
          const meta = timelineMeta[id];
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
                <h3 className="card-title">{meta.title}</h3>
                <p className="card-description">{meta.shortDesc}</p>
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
        key={scene.id}
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
        <p className="landing-subtitle">
          地球と生命の46億年の歩み、最先端の科学技術と宇宙への挑戦を伝えるマルチメディア展示システムです。用途に応じてモードを選択してください。
        </p>
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <span className="mode-card-chip chip-exhibition">全画面展示モード</span>
            </div>
            <div className="mode-card-body">
              <h2 className="mode-card-title">展示用</h2>
              <p className="mode-card-desc">
                来館者向けのスライドショー・タイムライン展示を全画面表示で開始します。タッチ操作とジェスチャーによる自由な回覧が可能です。
              </p>
            </div>
          </div>
          <div className="mode-card-action">
            <span>全画面でサイネージを開始</span>
            <span className="action-arrow">→</span>
          </div>
        </motion.div>

        {/* Editor Mode (編集用) */}
        <motion.div
          className="mode-card mode-card-editor"
          onClick={onEnterEditor}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <span className="mode-card-chip chip-editor">コンテンツ管理</span>
            </div>
            <div className="mode-card-body">
              <h2 className="mode-card-title">編集用</h2>
              <p className="mode-card-desc">
                展示タイムラインの解説テキスト編集や、静止画・動画メディアのアップロード・差し替えを行います。（機能準備中）
              </p>
            </div>
          </div>
          <div className="mode-card-action">
            <span>管理・編集メニューへ進む</span>
            <span className="action-arrow">→</span>
          </div>
        </motion.div>
      </div>

      <div className="landing-tip-bar">
        <span className="landing-tip-icon">ℹ️</span>
        <span>
          <strong>操作案内:</strong> 展示用モードからは、画面右上の「終了」ボタンまたはキーボードの [ESC] キーでいつでもこのトップページに戻ることができます。
        </span>
      </div>
    </div>
  );
};

/* ===== Editor Screen (編集用準備画面) ===== */
const EditorScreen = ({ onBackToLanding, onLaunchExhibition }) => {
  return (
    <div className="editor-page">
      <div className="editor-top-nav">
        <button
          className="editor-back-button"
          onClick={onBackToLanding}
          aria-label="トップページに戻る"
        >
          <span>←</span>
          <span>ポータルに戻る</span>
        </button>
        <span style={{ opacity: 0.6, fontSize: '0.9rem', fontFamily: 'sans-serif' }}>
          パス: /edit
        </span>
      </div>

      <div className="editor-main-container">
        <div className="editor-notice-card">
          <div className="editor-notice-icon">⚙️</div>
          <div className="editor-notice-content">
            <h3>「編集用」機能の提供準備中</h3>
            <p>
              動画や静止画のアップロード、各タイムラインの解説テキストやタイトルの指定・編集機能を順次実装予定です。
              現在は展示用サイネージ（/display）の動作が優先公開されています。
            </p>
          </div>
        </div>

        <div className="editor-sections-grid">
          <div className="editor-preview-card">
            <div className="editor-preview-header">
              <h4 className="editor-preview-title">1. メディアアップローダー</h4>
              <span className="editor-status-tag">開発予定</span>
            </div>
            <p className="editor-preview-desc">
              スライドショー用静止画（.jpg, .png）および高精細映像（.mp4）の直接アップロード・プレビュー機能。
            </p>
            <div className="editor-mock-slot">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>メディアファイルをドラッグ＆ドロップ</span>
            </div>
          </div>

          <div className="editor-preview-card">
            <div className="editor-preview-header">
              <h4 className="editor-preview-title">2. 解説テキスト・表示時間指定</h4>
              <span className="editor-status-tag">開発予定</span>
            </div>
            <p className="editor-preview-desc">
              シーンごとのタイトル、長文解説、再生秒数（デフォルト15秒）のインライン編集・保存。
            </p>
            <div className="editor-mock-slot">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>タイトル・解説文の指定フォーム</span>
            </div>
          </div>
        </div>

        <div className="editor-actions-strip">
          <button
            className="editor-launch-btn"
            onClick={onLaunchExhibition}
          >
            <span>展示用サイネージ（全画面）をテスト起動</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Routing: 'landing' (/) | 'display' (/display) | 'edit' (/edit)
  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  // Signage state: null = show timeline selection, 'timeline1'...'timeline4' = show scene playback
  const [currentTimeline, setCurrentTimeline] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

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

  // Enter Exhibition (Requests Fullscreen if available)
  const handleEnterExhibition = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (err) {
      // Fullscreen might be blocked by browser iframe permissions; continue gracefully
      console.warn('Fullscreen request bypassed:', err);
    }
    goHome();
    navigate('display');
  }, [goHome, navigate]);

  // Exit Exhibition (Exits Fullscreen and returns to Landing page)
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
    if (!currentTimeline) return;

    const timeline = timelines[currentTimeline];
    const newIndex = sceneIndex + newDirection;

    if (newIndex < 0) {
      // At the beginning, go back to timeline selection
      goHome();
    } else if (newIndex >= timeline.length) {
      // At the end, go back to timeline selection
      goHome();
    } else {
      setSceneIndex(newIndex);
      setDirection(newDirection);
    }
  }, [currentTimeline, sceneIndex, goHome]);

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

  const currentScene = currentTimeline ? timelines[currentTimeline][sceneIndex] : null;

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
              {/* Corner exit button to return to Landing page */}
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
                    <HomeScreen onSelectTimeline={handleSelectTimeline} />
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
                          <TimelineIndicator total={timelines[currentTimeline].length} current={sceneIndex} />
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
                      duration={DURATION}
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

      <div className="footer-banner">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img 
              src="museum-mark.png" 
              alt="NEXUS Logo" 
              className="footer-logo" 
              onClick={() => {
                navigate('landing');
                goHome();
              }}
              style={{ cursor: 'pointer' }}
            />
            <div>
              <p className="footer-tagline">Museum of Science & Technology</p>
              <h2 className="footer-company-name">NEXUS</h2>
            </div>
          </div>
          <div className="footer-qr-section">
            <p className="footer-qr-text">愛媛大学ミュージアム</p>
            <img src="qrcode.png" alt="QR Code" className="footer-qr-code" />
            <p className="footer-qr-text">ポータルサイト</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

