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
      <div className="tab-intro">
        <h3 className="tab-title">展示画面 全体設定（ヘッダー・フッター・ロゴ）</h3>
        <p className="tab-description">
          展示用サイネージ（/display）の最上部に常時表示されるタイトルや、画面下部に配置されている施設フッター情報を編集します。
        </p>
      </div>

      <div className="editor-form-grid">
        {/* Header Settings Section */}
        <div className="form-card">
          <h4 className="form-card-title">1. 上部ヘッダー表示</h4>
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
          <h4 className="form-card-title">2. フッターブランドテキスト</h4>
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

          <div className="form-group">
            <label className="form-label">
              URL表示領域（テキスト表示）
            </label>
            <div className="url-display-textarea" aria-label="URLテキスト表示">
              {general.footerUrl || 'https://signage.museum.ehime-u.ac.jp/'}
            </div>
            <span className="form-hint-text">
              ※ リンクではなくプレーンテキストとして表示されます。
            </span>
          </div>
        </div>

        {/* Footer Logo Media Uploader */}
        <div className="form-card">
          <h4 className="form-card-title">3. フッターロゴ・アイコン</h4>
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

        {/* Footer QR Section */}
        <div className="form-card">
          <h4 className="form-card-title">4. フッターQRコード設定</h4>
          <p className="form-card-subtitle">
            フッター右端のQRコード周辺のラベルテキストおよびQR画像をカスタマイズします。
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="footerQrTop">
              QR上部テキスト
            </label>
            <input
              id="footerQrTop"
              type="text"
              className="form-input"
              value={general.footerQrTop || ''}
              onChange={(e) => onChange('footerQrTop', e.target.value)}
              placeholder="例: 愛媛大学ミュージアム"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="footerQrBottom">
              QR下部テキスト
            </label>
            <input
              id="footerQrBottom"
              type="text"
              className="form-input"
              value={general.footerQrBottom || ''}
              onChange={(e) => onChange('footerQrBottom', e.target.value)}
              placeholder="例: ポータルサイト"
            />
          </div>

          <MediaUploader
            label="QRコード画像"
            accept="image/*"
            type="image"
            currentUrl={general.footerQrCode}
            defaultUrl={defaultGeneral.footerQrCode}
            onFileSelected={(file) => onMediaUpload('general.footerQrCode', file)}
            onRevertToDefault={() => onRevertMedia('general.footerQrCode')}
            helpText="正方形のQRコード画像をアップロードできます。"
          />
        </div>
      </div>
    </div>
  );
};
