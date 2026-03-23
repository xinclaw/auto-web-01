# 智集電商 - 內部工具系統

## 📁 專案結構

```
自動化網頁01/
├── index.html          # 登入頁面
├── dashboard.html       # 主工作台（含左側導航）
├── css/
│   └── style.css        # 樣式表
├── js/
│   └── app.js           # 前端邏輯
├── keywords-0103.json  # n8n Workflow 匯出檔
├── N8N_SETUP.md         # N8N + MiniMax 設定指南
└── README.md            # 本檔案
```

---

## 🚀 快速開始

### 1. 開啟頁面

直接在瀏覽器開啟 `index.html` 或 `dashboard.html`

### 2. 部署到線上

**推薦使用 Netlify（最簡單）：**
1. 前往 [netlify.com](https://netlify.com)
2. 註冊/登入
3. 拖曳整個 `自動化網頁01` 資料夾到頁面
4. 拿到網址，完成！

---

## 🔧 設定步驟

### Step 1: 設定 n8n Workflow

1. 打開 n8n
2. 匯入 `keywords-0103.json`
3. 參考 `N8N_SETUP.md` 將 Gemini 替換為 MiniMax HTTP Request
4. 啟動 Workflow，複製 Webhook URL

### Step 2: 更新前端設定

編輯 `js/app.js`，找到：
```javascript
const CONFIG = {
    n8nWebhook: 'YOUR_N8N_WEBHOOK_URL_HERE',
    // ...
};
```

替換為你的 Webhook URL。

---

## 📦 主要功能

| 功能 | 說明 | 狀態 |
|------|------|------|
| 標題撰寫 | 根據關鍵詞生成電商標題 | ✅ 已整合 |
| 詳情內頁 | 生成商品詳情頁文案 | 🔧 整合中 |
| 車型辨識 | 圖片上傳 → AI 辨識車型 | 🔧 整合中 |
| 訂單管理 | 管理訂單資料 | 🔧 開發中 |
| 登入系統 | Supabase Auth | 🔧 開發中 |

---

## 🔗 相關服務

| 服務 | 用途 | 連結 |
|------|------|------|
| Supabase | 資料庫 + 登入系統 | supabase.com |
| n8n | 自動化 workflow | n8n.io |
| MiniMax | AI 模型 | minimax.chat |
| Netlify | 前端托管 | netlify.com |

---

## 📝 開發說明

### 前端技術
- 純 HTML + CSS + JavaScript（無框架）
- 串接 Supabase Client SDK
- Fetch API 呼叫 n8n Webhook

### 後端流程
```
前端輸入 → HTTP Request → n8n Webhook → MiniMax API → 回傳結果
```

---

## ❓ 問題排除

### Q: 頁面顯示異常
**A:** 確認所有檔案路徑正確，css/ 和 js/ 資料夾要與 html 同層級

### Q: 無法呼叫 n8n
**A:** 確認 n8n Workflow 已啟動，Webhook URL 正確

### Q: MiniMax 回應錯誤
**A:** 檢查 API Key 是否有效，查看 n8n console 錯誤訊息

---

## 📞 聯繫

如有問題，請聯繫系統管理者。
