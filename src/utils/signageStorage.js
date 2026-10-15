// signageStorage.js - IndexedDB based persistence for digital signage configuration and media files

const DB_NAME = 'MuseumSignageDB';
const DB_VERSION = 1;
const CONFIG_STORE = 'config';
const MEDIA_STORE = 'media';

export const DEFAULT_SIGNAGE_CONFIG = {
  general: {
    headerTitle: 'NEXUS Signage',
    headerSubtitle: 'コンテンツを選択してください',
    footerTagline: 'Museum of Science & Technology',
    footerCompanyName: 'NEXUS',
    footerUrl: 'https://signage.museum.ehime-u.ac.jp/',
    footerLogo: 'museum-mark.png',
    footerQrTop: '愛媛大学ミュージアム',
    footerQrBottom: 'ポータルサイト',
    footerQrCode: 'qrcode.png',
  },
  exhibitions: {
    timeline1: {
      id: 'timeline1',
      title: '宇宙・航空事業部',
      shortDesc: '次世代衛星・ロケット技術',
      imageDuration: 15,
      scenes: [
        {
          id: 1,
          type: 'image',
          image: 'space.jpg',
          title: '宇宙・航空事業部',
          description:
            '当社の宇宙・航空事業部では、最先端の精密加工技術と新素材開発の知見を融合させ、次世代の衛星構造体やロケットエンジン部品の開発に取り組んでいます。過酷な宇宙環境に耐えうる超軽量・高強度のコンポーネントは、国内外の主要な宇宙プロジェクトで採用されており、人類のフロンティア拡大を技術で支えています。また、培った航空技術を活かし、eVTOL（空飛ぶクルマ）などの次世代都市交通インフラにおける基幹部品の供給を行い、空の移動の民主化と持続可能な空のインフラ構築に貢献しています。未来の空と宇宙を、当社の技術が繋ぎます。',
        },
        {
          id: 2,
          type: 'video',
          video: 'Artifficial-Satellite.mp4',
          title: '宇宙・航空事業部 - Vision',
          description: '広大なフロンティアへ向けた、当社の挑戦。',
        },
      ],
    },
    timeline2: {
      id: 'timeline2',
      title: 'バイオ・ライフサイエンス事業部',
      shortDesc: 'ゲノム編集・創薬支援',
      imageDuration: 15,
      scenes: [
        {
          id: 3,
          type: 'image',
          image: 'bio.jpg',
          title: 'バイオ・ライフサイエンス事業部',
          description:
            '生命の神秘を工学の視点で紐解くバイオ・ライフサイエンス事業部では、ゲノム編集技術や幹細胞工学を応用した創薬支援プラットフォームの開発から、機能性新素材の創出まで幅広く手掛けています。当社の微細加工技術によって実現した高精度なバイオチップは、迅速な診断と効率的な治療計画の策定を可能にし、個別化医療の進展に寄与しています。また、バイオプラスチックや微生物を用いた環境浄化ソリューションの開発を通じて、人々の健康と地球の健全性を同時に守る「持続可能な豊かさ」の実現を目指しています。技術を通じて、生命の可能性を最大限に引き出します。',
        },
        {
          id: 4,
          type: 'video',
          video: 'Bio_Chip_Laser_Scan_Video.mp4',
          title: 'バイオ・ライフサイエンス - Tech',
          description: 'ナノレベルの精密さと、生命への敬意。',
        },
      ],
    },
    timeline3: {
      id: 'timeline3',
      title: 'AI・ロボティクス開発本部',
      shortDesc: '自律型ロボット・産業AI',
      imageDuration: 15,
      scenes: [
        {
          id: 5,
          type: 'image',
          image: 'robot.jpg',
          title: 'AI・ロボティクス開発本部',
          description:
            'AI・ロボティクス開発本部では、ディープラーニングと高度なセンシング技術を統合し、自律的に状況を判断し行動する次世代産業用ロボットの開発を推進しています。人間と協調して働くコボット（協働ロボット）は、複雑な組立工程や物流現場での負荷を劇的に軽減し、生産性の向上と安全性の確保を高いレベルで両立させています。さらに、現場のビッグデータをリアルタイムで解析する産業用AIプラットフォームにより、故障の予兆検知やプロセスの自動最適化を実現。製造業のデジタルツイン化を強力にバックアップし、スマートファクトリーの未来を技術の力で切り拓いていきます。',
        },
        {
          id: 6,
          type: 'video',
          video: 'Robotic_Arm_Assembling_Circuit_Board.mp4',
          title: 'AI・ロボティクス - Innovation',
          description: '知能と物理の融合が、産業の形を変える。',
        },
      ],
    },
    timeline4: {
      id: 'timeline4',
      title: 'グリーンエネルギー事業推進室',
      shortDesc: '再生可能エネルギー技術',
      imageDuration: 15,
      scenes: [
        {
          id: 7,
          type: 'image',
          image: 'energy.jpg',
          title: 'グリーンエネルギー事業推進室',
          description:
            '気候変動問題の解決をミッションに掲げるグリーンエネルギー事業推進室は、再生可能エネルギーの主力電源化を目指し、次世代太陽電池や超大型風力発電機用コンポーネントの研究開発を行っています。特に、エネルギーを高効率で蓄える全固体電池技術や、水素製造・貯蔵システムの構築において、当社の触媒技術と材料工学が決定的な役割を果たしています。スマートグリッドによる電力需給の最適化ソリューションも展開し、カーボンニュートラルな社会の実現に向けたトータルエネルギーマネジメントを提供。クリーンなエネルギーが社会を巡る、循環型の未来を確かな技術力で描いています。',
        },
        {
          id: 8,
          type: 'video',
          video: 'Solar-Panel.mp4',
          title: 'グリーンエネルギー - Sustainable',
          description: '地球と共生する、新しいエネルギーの循環。',
        },
      ],
    },
  },
};

// Deep clone utility for clean defaults
export const getCleanDefaultConfig = () => JSON.parse(JSON.stringify(DEFAULT_SIGNAGE_CONFIG));

// Keep track of created object URLs to clean them up when new ones are made
const activeObjectUrls = new Map();

export const registerBlobUrl = (key, blob) => {
  if (activeObjectUrls.has(key)) {
    try {
      URL.revokeObjectURL(activeObjectUrls.get(key));
    } catch {
      // ignore
    }
  }
  const url = URL.createObjectURL(blob);
  activeObjectUrls.set(key, url);
  return url;
};

// Open IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CONFIG_STORE)) {
        db.createObjectStore(CONFIG_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Load configuration and restore media blob URLs
export async function loadSignageConfig() {
  const db = await openDB();
  if (!db) {
    return getCleanDefaultConfig();
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([CONFIG_STORE, MEDIA_STORE], 'readonly');
      const configStore = tx.objectStore(CONFIG_STORE);
      const mediaStore = tx.objectStore(MEDIA_STORE);

      const configRequest = configStore.get('currentConfig');
      const mediaRequest = mediaStore.getAll();

      let savedConfig = null;
      let mediaList = [];

      configRequest.onsuccess = () => {
        savedConfig = configRequest.result ? configRequest.result.data : null;
      };

      mediaRequest.onsuccess = () => {
        mediaList = mediaRequest.result || [];
      };

      tx.oncomplete = () => {
        const base = savedConfig ? { ...getCleanDefaultConfig(), ...savedConfig } : getCleanDefaultConfig();
        
        // Map any saved media blobs into active Object URLs
        const mediaMap = {};
        for (const item of mediaList) {
          if (item && item.blob) {
            mediaMap[item.key] = registerBlobUrl(item.key, item.blob);
          }
        }

        // Apply media URLs into config structure if exists
        if (mediaMap['general.footerLogo']) {
          base.general.footerLogo = mediaMap['general.footerLogo'];
        }
        if (mediaMap['general.footerQrCode']) {
          base.general.footerQrCode = mediaMap['general.footerQrCode'];
        }

        ['timeline1', 'timeline2', 'timeline3', 'timeline4'].forEach((tKey) => {
          if (base.exhibitions[tKey] && base.exhibitions[tKey].scenes) {
            const scenes = base.exhibitions[tKey].scenes;
            if (scenes[0] && mediaMap[`${tKey}.scene0`]) {
              scenes[0].image = mediaMap[`${tKey}.scene0`];
            }
            if (scenes[1] && mediaMap[`${tKey}.scene1`]) {
              scenes[1].video = mediaMap[`${tKey}.scene1`];
            }
          }
        });

        resolve(base);
      };

      tx.onerror = () => {
        resolve(getCleanDefaultConfig());
      };
    } catch (e) {
      console.warn('Failed to load from IndexedDB, using default config:', e);
      resolve(getCleanDefaultConfig());
    }
  });
}

// Save configuration and optional media files
export async function saveSignageConfig(config, newMediaFiles = {}) {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction([CONFIG_STORE, MEDIA_STORE], 'readwrite');
      const configStore = tx.objectStore(CONFIG_STORE);
      const mediaStore = tx.objectStore(MEDIA_STORE);

      // Clean config (without blob URLs that can't be serialized or might be stale)
      // We will clone config, but keep track of non-blob strings or media keys
      const serializableConfig = JSON.parse(JSON.stringify(config));

      configStore.put({ id: 'currentConfig', data: serializableConfig, updatedAt: Date.now() });

      // Save any newly uploaded media files
      Object.entries(newMediaFiles).forEach(([key, fileOrBlob]) => {
        if (fileOrBlob instanceof Blob) {
          mediaStore.put({
            key,
            blob: fileOrBlob,
            name: fileOrBlob.name || key,
            type: fileOrBlob.type,
            updatedAt: Date.now(),
          });
        }
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (e) {
      reject(e);
    }
  });
}

// Reset everything to default (clears media and config stores)
export async function resetSignageConfig() {
  const db = await openDB();
  if (db) {
    await new Promise((resolve, reject) => {
      try {
        const tx = db.transaction([CONFIG_STORE, MEDIA_STORE], 'readwrite');
        tx.objectStore(CONFIG_STORE).clear();
        tx.objectStore(MEDIA_STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Revoke all active blob URLs
  activeObjectUrls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  });
  activeObjectUrls.clear();

  return getCleanDefaultConfig();
}

// Clear a specific uploaded media key from IndexedDB to revert to original default
export async function deleteUploadedMedia(key) {
  const db = await openDB();
  if (!db) return;

  if (activeObjectUrls.has(key)) {
    try {
      URL.revokeObjectURL(activeObjectUrls.get(key));
      activeObjectUrls.delete(key);
    } catch {
      // ignore
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction([MEDIA_STORE], 'readwrite');
      tx.objectStore(MEDIA_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (e) {
      reject(e);
    }
  });
}
