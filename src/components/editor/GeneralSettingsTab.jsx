import React from 'react';
import { MediaUploader } from './MediaUploader';

export const GeneralSettingsTab = ({
  general,
  defaultGeneral,
  onChange,
  onMediaUpload,
  onRevertMedia,
}) => {
  return (
    <div className="editor-tab-panel">
      <div className="editor-form-grid">
        {/* Header Settings Section */}
        <div className="form-card">
          <div className="card-header-badge-row">
            <div className="card-title-lockup">
              <span className="card-number-badge">01</span>
              <h4 className="form-card-title">トップ画面ヘッダー</h4>
            </div>
          </div>
          <p className="form-card-subtitle">
            コンテンツ選択画面の上部に表示される大見出しと案内テキストです。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="headerTitle">
              メインタイトル（上部）
            </label>
            <input
              id="headerTitle"
              type="text"
              className="form-input"
              value={general.headerTitle || ''}
              onChange={(e) => onChange('headerTitle', e.target.value)}
              placeholder="例: NEXUS Signage, 愛媛大学ミュージアム"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="headerSubtitle">
              サブタイトル（上部案内文）
            </label>
            <input
              id="headerSubtitle"
              type="text"
              className="form-input"
              value={general.headerSubtitle || ''}
              onChange={(e) => onChange('headerSubtitle', e.target.value)}
              placeholder="例: コンテンツを選択してください"
            />
          </div>
        </div>

        {/* Footer Brand & Texts Section */}
        <div className="form-card">
          <div className="card-header-badge-row">
            <div className="card-title-lockup">
              <span className="card-number-badge">02</span>
              <h4 className="form-card-title">フッターブランドテキスト</h4>
            </div>
          </div>
          <p className="form-card-subtitle">
            画面最下部左側に並ぶタグラインおよびメイン施設名です。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="footerTagline">
              タグライン文字列（英語・小見出し）
            </label>
            <input
              id="footerTagline"
              type="text"
              className="form-input"
              value={general.footerTagline || ''}
              onChange={(e) => onChange('footerTagline', e.target.value)}
              placeholder="例: Museum of Science & Technology"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="footerCompanyName">
              メイン施設名・ブランド名（大文字）
            </label>
            <input
              id="footerCompanyName"
              type="text"
              className="form-input"
              value={general.footerCompanyName || ''}
              onChange={(e) => onChange('footerCompanyName', e.target.value)}
              placeholder="例: NEXUS, EHIME UNIV MUSEUM"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="footerUrl">
              施設・サイネージURL設定
            </label>
            <input
              id="footerUrl"
              type="text"
              className="form-input"
              value={general.footerUrl || ''}
              onChange={(e) => onChange('footerUrl', e.target.value)}
              placeholder="例: https://signage.museum.ehime-u.ac.jp/"
            />
          </div>
        </div>

        {/* Footer Logo Media Uploader */}
        <div className="form-card">
          <div className="card-header-badge-row">
            <div className="card-title-lockup">
              <span className="card-number-badge">03</span>
              <h4 className="form-card-title">フッターロゴ・アイコン</h4>
            </div>
          </div>
          <p className="form-card-subtitle">
            フッター左端に配置されているマーク画像（初期値: museum-mark.png）を差し替えます。
          </p>
          <MediaUploader
            label="ロゴアイコン画像"
            accept="image/*"
            type="image"
            currentUrl={general.footerLogo}
            defaultUrl={defaultGeneral.footerLogo}
            onFileSelected={(file) => onMediaUpload('general.footerLogo', file)}
            onRevertToDefault={() => onRevertMedia('general.footerLogo')}
            helpText="正方形または透過PNG画像（512x512px推奨）が美しく配置されます。"
          />
        </div>
      </div>
    </div>
  );
};
