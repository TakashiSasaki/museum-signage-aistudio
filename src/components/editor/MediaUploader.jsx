import React, { useRef, useState } from 'react';

export const MediaUploader = ({
  label,
  accept = 'image/*',
  type = 'image',
  currentUrl,
  defaultUrl,
  onFileSelected,
  onRevertToDefault,
  helpText,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const isCustomMedia = currentUrl && currentUrl !== defaultUrl;

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      // Basic check
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert('動画ファイルを選択してください');
        return;
      }
      setSelectedFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleTriggerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRevert = () => {
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRevertToDefault();
  };

  return (
    <div className="media-uploader-card">
      <div className="media-uploader-header">
        <label className="media-uploader-label">{label}</label>
        {isCustomMedia && (
          <span className="media-custom-badge">カスタム適用中</span>
        )}
      </div>

      {helpText && <p className="media-uploader-help">{helpText}</p>}

      <div
        className={`media-dropzone ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleTriggerClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
        aria-label={`${label} をアップロード`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="media-preview-container">
          {type === 'image' ? (
            <img
              src={currentUrl}
              alt={label}
              className="media-preview-image"
              onError={(e) => {
                e.target.style.opacity = '0.3';
              }}
            />
          ) : (
            <video
              src={currentUrl}
              className="media-preview-video"
              controls
              muted
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        <div className="media-dropzone-cta">
          <div className="dropzone-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <span className="dropzone-text">
            {selectedFileName ? `選択中: ${selectedFileName}` : 'クリックしてファイルを選択 または ドラッグ＆ドロップ'}
          </span>
          <span className="dropzone-subtext">
            {type === 'image' ? '対応形式: JPEG, PNG, WebP, SVG' : '対応形式: MP4, WebM (H.264推奨)'}
          </span>
        </div>
      </div>

      <div className="media-uploader-actions">
        <button
          type="button"
          className="btn-select-file"
          onClick={handleTriggerClick}
        >
          ファイルを選択
        </button>

        {isCustomMedia && (
          <button
            type="button"
            className="btn-revert-default"
            onClick={handleRevert}
            title="出荷時の初期メディアに戻します"
          >
            初期メディアに戻す
          </button>
        )}
      </div>
    </div>
  );
};
