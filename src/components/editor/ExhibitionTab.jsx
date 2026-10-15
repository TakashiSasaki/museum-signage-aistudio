import React from 'react';
import { MediaUploader } from './MediaUploader';

export const ExhibitionTab = ({
  timelineKey,
  timelineNumber,
  exhibition,
  defaultExhibition,
  onChange,
  onMediaUpload,
  onRevertMedia,
}) => {
  if (!exhibition) return null;

  const scene0 = exhibition.scenes && exhibition.scenes[0] ? exhibition.scenes[0] : {};
  const scene1 = exhibition.scenes && exhibition.scenes[1] ? exhibition.scenes[1] : {};

  const defaultScene0 = defaultExhibition && defaultExhibition.scenes && defaultExhibition.scenes[0] ? defaultExhibition.scenes[0] : {};
  const defaultScene1 = defaultExhibition && defaultExhibition.scenes && defaultExhibition.scenes[1] ? defaultExhibition.scenes[1] : {};

  const handleMetaChange = (field, value) => {
    onChange('meta', { ...exhibition, [field]: value });
  };

  const handleScene0Change = (field, value) => {
    const updatedScenes = [...exhibition.scenes];
    updatedScenes[0] = { ...scene0, [field]: value };
    onChange('scenes', updatedScenes);
  };

  const handleScene1Change = (field, value) => {
    const updatedScenes = [...exhibition.scenes];
    updatedScenes[1] = { ...scene1, [field]: value };
    onChange('scenes', updatedScenes);
  };

  const handleDurationChange = (val) => {
    const parsed = parseInt(val, 10);
    onChange('imageDuration', isNaN(parsed) ? 15 : Math.max(3, Math.min(120, parsed)));
  };

  return (
    <div className="editor-tab-panel">
      <div className="tab-intro">
        <h3 className="tab-title">
          デジタル展示 {timelineNumber}: {exhibition.title || `展示 ${timelineNumber}`}
        </h3>
        <p className="tab-description">
          展示用ホーム画面の選択カード情報、およびタップ時に再生される静止画シーン（シーン1）と動画シーン（シーン2）を編集します。
        </p>
      </div>

      <div className="editor-form-grid">
        {/* Exhibition Card Overview */}
        <div className="form-card">
          <h4 className="form-card-title">1. 展示基本情報（ホームカード表示）</h4>
          <p className="form-card-subtitle">
            サイネージ起動直後の4分割選択画面に表示されるカード見出しと短い紹介文です。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor={`title-${timelineKey}`}>
              展示タイトル
            </label>
            <input
              id={`title-${timelineKey}`}
              type="text"
              className="form-input"
              value={exhibition.title || ''}
              onChange={(e) => handleMetaChange('title', e.target.value)}
              placeholder="例: 宇宙・航空事業部"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`shortDesc-${timelineKey}`}>
              一覧カード用 概要文（短い説明）
            </label>
            <input
              id={`shortDesc-${timelineKey}`}
              type="text"
              className="form-input"
              value={exhibition.shortDesc || ''}
              onChange={(e) => handleMetaChange('shortDesc', e.target.value)}
              placeholder="例: 次世代衛星・ロケット技術"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`duration-${timelineKey}`}>
              静止画スライド表示秒数: <strong>{exhibition.imageDuration || 15} 秒</strong>
            </label>
            <div className="range-slider-wrapper">
              <input
                id={`duration-${timelineKey}`}
                type="range"
                min="5"
                max="60"
                step="1"
                className="form-range"
                value={exhibition.imageDuration || 15}
                onChange={(e) => handleDurationChange(e.target.value)}
              />
              <span className="range-value-label">{exhibition.imageDuration || 15}s</span>
            </div>
          </div>
        </div>

        {/* Scene 1: Image Scene */}
        <div className="form-card">
          <div className="scene-card-badge-row">
            <h4 className="form-card-title">2. シーン 1: 静止画展示（Ken Burns効果）</h4>
            <span className="scene-type-tag tag-image">静止画</span>
          </div>
          <p className="form-card-subtitle">
            展示選択直後に表示される高精細静止画と、長文の解説オーバーレイです。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor={`scene0-title-${timelineKey}`}>
              シーン1 タイトル
            </label>
            <input
              id={`scene0-title-${timelineKey}`}
              type="text"
              className="form-input"
              value={scene0.title || ''}
              onChange={(e) => handleScene0Change('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`scene0-desc-${timelineKey}`}>
              詳細解説文
            </label>
            <textarea
              id={`scene0-desc-${timelineKey}`}
              className="form-textarea"
              rows={4}
              value={scene0.description || ''}
              onChange={(e) => handleScene0Change('description', e.target.value)}
              placeholder="来館者へ向けた展示の詳細な解説を入力してください..."
            />
          </div>

          <MediaUploader
            label="展示用 静止画ファイル"
            accept="image/*"
            type="image"
            currentUrl={scene0.image}
            defaultUrl={defaultScene0.image}
            onFileSelected={(file) => onMediaUpload(`${timelineKey}.scene0`, file)}
            onRevertToDefault={() => onRevertMedia(`${timelineKey}.scene0`)}
            helpText="高解像度画像（4K縦型または横型）を推奨。静止画は自動的に滑らかなKen Burnsパン・ズーム効果で再生されます。"
          />
        </div>

        {/* Scene 2: Video Scene */}
        <div className="form-card">
          <div className="scene-card-badge-row">
            <h4 className="form-card-title">3. シーン 2: 映像展示（動画自動再生）</h4>
            <span className="scene-type-tag tag-video">動画</span>
          </div>
          <p className="form-card-subtitle">
            静止画シーンの次に自動再生されるプロモーション映像と、タイトル・短文解説です。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor={`scene1-title-${timelineKey}`}>
              シーン2 タイトル
            </label>
            <input
              id={`scene1-title-${timelineKey}`}
              type="text"
              className="form-input"
              value={scene1.title || ''}
              onChange={(e) => handleScene1Change('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`scene1-desc-${timelineKey}`}>
              シーン2 説明文（キャッチコピー）
            </label>
            <textarea
              id={`scene1-desc-${timelineKey}`}
              className="form-textarea"
              rows={2}
              value={scene1.description || ''}
              onChange={(e) => handleScene1Change('description', e.target.value)}
              placeholder="映像に添える短いメッセージを入力してください..."
            />
          </div>

          <MediaUploader
            label="展示用 動画ファイル (MP4)"
            accept="video/*"
            type="video"
            currentUrl={scene1.video}
            defaultUrl={defaultScene1.video}
            onFileSelected={(file) => onMediaUpload(`${timelineKey}.scene1`, file)}
            onRevertToDefault={() => onRevertMedia(`${timelineKey}.scene1`)}
            helpText="MP4形式の動画をアップロードできます。動画終了時に自動で次の展示またはホームへ巡回します。"
          />
        </div>
      </div>
    </div>
  );
};
