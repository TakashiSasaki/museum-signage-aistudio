import React, { useState } from 'react';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { ExhibitionTab } from './ExhibitionTab';
import { DEFAULT_SIGNAGE_CONFIG } from '../../utils/signageStorage';

export const EditorScreen = ({
  config,
  onSaveConfig,
  onResetToDefault,
  onBackToLanding,
  onLaunchExhibition,
}) => {
  // Tabs: 'general' | 'timeline1' | 'timeline2' | 'timeline3' | 'timeline4'
  const [activeTab, setActiveTab] = useState('general');

  // Working copy of config in state
  const [workingConfig, setWorkingConfig] = useState(config);
  // Staging area for new uploaded media Blobs/Files: { 'timeline1.scene0': File, ... }
  const [pendingMediaFiles, setPendingMediaFiles] = useState({});

  // UI state
  const [toastMessage, setToastMessage] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // General settings change handler
  const handleGeneralChange = (field, value) => {
    setWorkingConfig((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Exhibition change handler
  const handleExhibitionChange = (timelineKey, changeType, value) => {
    setWorkingConfig((prev) => {
      const currentExhibition = prev.exhibitions[timelineKey] || {};
      let updatedExhibition = { ...currentExhibition };

      if (changeType === 'meta') {
        updatedExhibition = { ...updatedExhibition, ...value };
      } else if (changeType === 'scenes') {
        updatedExhibition.scenes = value;
      } else if (changeType === 'imageDuration') {
        updatedExhibition.imageDuration = value;
      }

      return {
        ...prev,
        exhibitions: {
          ...prev.exhibitions,
          [timelineKey]: updatedExhibition,
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  // Handle media file upload
  const handleMediaUpload = (mediaKey, file) => {
    const objectUrl = URL.createObjectURL(file);

    // Keep track of file in pendingMediaFiles to save to IndexedDB
    setPendingMediaFiles((prev) => ({
      ...prev,
      [mediaKey]: file,
    }));

    // Update workingConfig with preview ObjectURL
    setWorkingConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (mediaKey === 'general.footerLogo') {
        next.general.footerLogo = objectUrl;
      } else if (mediaKey === 'general.footerQrCode') {
        next.general.footerQrCode = objectUrl;
      } else {
        const [tKey, sceneKey] = mediaKey.split('.');
        const sceneIdx = sceneKey === 'scene0' ? 0 : 1;
        if (next.exhibitions[tKey] && next.exhibitions[tKey].scenes[sceneIdx]) {
          if (sceneIdx === 0) {
            next.exhibitions[tKey].scenes[0].image = objectUrl;
          } else {
            next.exhibitions[tKey].scenes[1].video = objectUrl;
          }
        }
      }
      return next;
    });

    setHasUnsavedChanges(true);
    showToast(`ファイルを読み込みました（保存ボタンで確定）`);
  };

  // Handle revert media to default
  const handleRevertMedia = (mediaKey) => {
    // Remove from pending files
    setPendingMediaFiles((prev) => {
      const copy = { ...prev };
      delete copy[mediaKey];
      return copy;
    });

    setWorkingConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (mediaKey === 'general.footerLogo') {
        next.general.footerLogo = DEFAULT_SIGNAGE_CONFIG.general.footerLogo;
      } else if (mediaKey === 'general.footerQrCode') {
        next.general.footerQrCode = DEFAULT_SIGNAGE_CONFIG.general.footerQrCode;
      } else {
        const [tKey, sceneKey] = mediaKey.split('.');
        const sceneIdx = sceneKey === 'scene0' ? 0 : 1;
        if (next.exhibitions[tKey] && next.exhibitions[tKey].scenes[sceneIdx]) {
          const defaultScene = DEFAULT_SIGNAGE_CONFIG.exhibitions[tKey].scenes[sceneIdx];
          if (sceneIdx === 0) {
            next.exhibitions[tKey].scenes[0].image = defaultScene.image;
          } else {
            next.exhibitions[tKey].scenes[1].video = defaultScene.video;
          }
        }
      }
      return next;
    });

    setHasUnsavedChanges(true);
    showToast('初期メディアへ復元しました');
  };

  // Save handler
  const handleSave = async () => {
    try {
      await onSaveConfig(workingConfig, pendingMediaFiles);
      setPendingMediaFiles({});
      setHasUnsavedChanges(false);
      showToast('編集内容をブラウザに保存しました');
    } catch (e) {
      console.error(e);
      showToast('保存中にエラーが発生しました');
    }
  };

  // Reset all to default handler
  const handleConfirmReset = async () => {
    try {
      const freshConfig = await onResetToDefault();
      setWorkingConfig(freshConfig);
      setPendingMediaFiles({});
      setHasUnsavedChanges(false);
      setIsResetConfirmOpen(false);
      showToast('初期状態（工場出荷時）にリセットしました');
    } catch (e) {
      console.error(e);
      showToast('リセット中にエラーが発生しました');
    }
  };

  const tabs = [
    { id: 'general', label: 'トップ', title: 'トップ設定（ヘッダー・フッター）' },
    { id: 'timeline1', label: '展示１', title: '展示１' },
    { id: 'timeline2', label: '展示２', title: '展示２' },
    { id: 'timeline3', label: '展示３', title: '展示３' },
    { id: 'timeline4', label: '展示４', title: '展示４' },
  ];

  return (
    <div className="editor-page">
      {/* Top Navigation Bar */}
      <header className="editor-top-nav">
        <div className="editor-top-left">
          <button
            className="editor-back-button"
            onClick={onBackToLanding}
            aria-label="戻る"
          >
            <span>←</span>
            <span>戻る</span>
          </button>
          <div className="editor-brand-lockup">
            <h2 className="editor-heading">サイネージ コンテンツ管理</h2>
            <span className="editor-badge">編集モード</span>
          </div>
        </div>

        <div className="editor-top-right">
          {hasUnsavedChanges ? (
            <span className="unsaved-indicator">● 未保存の変更があります</span>
          ) : (
            <span className="saved-indicator">✓ 最新の設定が保存済み</span>
          )}
          <button
            type="button"
            className="editor-btn-reset-nav"
            onClick={() => setIsResetConfirmOpen(true)}
            title="すべての設定を出荷時初期状態に戻します"
          >
            初期化
          </button>
          <button
            className="editor-btn-launch-nav"
            onClick={onLaunchExhibition}
            title="展示画面を全画面で起動"
          >
            サイネージ起動 →
          </button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="editor-tabs-bar">
        <div className="editor-tabs-scroller">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`editor-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.title}
              aria-label={tab.title}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content Area */}
      <main className="editor-main-container">
        {activeTab === 'general' ? (
          <GeneralSettingsTab
            general={workingConfig.general}
            defaultGeneral={DEFAULT_SIGNAGE_CONFIG.general}
            onChange={handleGeneralChange}
            onMediaUpload={handleMediaUpload}
            onRevertMedia={handleRevertMedia}
          />
        ) : (
          <ExhibitionTab
            timelineKey={activeTab}
            timelineNumber={activeTab.replace('timeline', '')}
            exhibition={workingConfig.exhibitions[activeTab]}
            defaultExhibition={DEFAULT_SIGNAGE_CONFIG.exhibitions[activeTab]}
            onChange={(type, val) => handleExhibitionChange(activeTab, type, val)}
            onMediaUpload={handleMediaUpload}
            onRevertMedia={handleRevertMedia}
          />
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="editor-action-bar-sticky">
        <div className="action-bar-inner">
          <div className="action-bar-left">
            <button
              type="button"
              className="btn-danger-reset"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              初期設定にリセット
            </button>
          </div>

          <div className="action-bar-right">
            <button
              type="button"
              className={`btn-save-primary ${hasUnsavedChanges ? 'has-changes' : ''}`}
              onClick={handleSave}
            >
              変更を保存する
            </button>
            <button
              type="button"
              className="btn-launch-primary"
              onClick={async () => {
                if (hasUnsavedChanges) {
                  await handleSave();
                }
                onLaunchExhibition();
              }}
            >
              <span>展示用サイネージをテスト起動</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsResetConfirmOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="modal-title">初期設定へのリセット確認</h3>
            <p className="modal-body">
              編集したすべてのテキスト設定およびアップロードされた画像・動画メディアが消去され、初期出荷時の展示状態に戻ります。
              <br />
              この操作を実行してもよろしいですか？
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="modal-btn-confirm-danger"
                onClick={handleConfirmReset}
              >
                初期設定に戻す
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="editor-toast" role="status">
          <span className="toast-icon">ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
