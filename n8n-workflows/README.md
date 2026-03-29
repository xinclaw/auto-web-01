# 自動化網頁01 - n8n Workflows

## 設定指南

### Step 1: 在 Supabase 建立資料庫

1. 前往 [Supabase](https://supabase.com/dashboard)
2. 選擇專案 `ub-bot`（或 `xinding-hub-bot`）
3. 左側選單點 **「SQL Editor」**
4. 點 **「New Query」**
5. 貼上 `setup-database.sql` 的內容
6. 點 **「Run」** 執行

### Step 2: 設定 n8n Workflow

#### 標題生成工作流 (`title-workflow-minimax.json`)

1. 匯入 JSON 檔案到 n8n
2. 編輯 **HTTP Request** 節點
3. 在 **Authorization** header 中，把 `YOUR_MINIMAX_API_KEY` 取代成真正的 MiniMax API Key
4. 啟動 workflow，複製 Webhook URL

#### 詳情頁生成工作流 (`detail-workflow-minimax.json`)

1. 同上，設定 MiniMax API Key
2. 啟動 workflow，複製 Webhook URL

### Step 3: 更新前端設定

編輯 `dashboard.html` 或 `js/app.js`（如果存在），找到：

```javascript
const CONFIG = {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
    n8nWebhookTitle: 'YOUR_TITLE_WEBHOOK_URL',
    n8nWebhookDetail: 'YOUR_DETAIL_WEBHOOK_URL'
};
```

取代為：
- **supabaseUrl**: `https://mrckamcwtaimbpfqfu.supabase.co`
- **supabaseKey**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bXJja2FtY3d0YWltYnBmcWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODM5NTksImV4cCI6MjA4OTg1OTk1OX0.IYMaYQHo5IFKFPTGoP-fs0xCJLbA2bLmdn8HSk99Ow4`

## API Keys

### Supabase
- **Project URL**: `https://mrckamcwtaimbpfqfu.supabase.co`
- **Project Ref**: `mrckamcwtaimbpfqfu`
- **anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bXJja2FtY3d0YWltYnBmcWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODM5NTksImV4cCI6MjA4OTg1OTk1OX0.IYMaYQHo5IFKFPTGoP-fs0xCJLbA2bLmdn8HSk99Ow4`

### MiniMax
- 需要自行設定 API Key

## 資料表結構

### product_keywords

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| keyword | TEXT | 關鍵詞 |
| category | TEXT | 類別（car/寵物/飾品/五金） |
| title | TEXT | 標題 |
| description | TEXT | 描述 |
| detail | TEXT | 詳情 |
| created_at | TIMESTAMP | 建立時間 |
| updated_at | TIMESTAMP | 更新時間 |

## Webhook Endpoints

- **標題生成**: `POST /generate-title`
  - 輸入: `{ "keyword": "...", "category": "..." }`
  - 輸出: `{ "ok": true, "title": "...", "rationale": "..." }`

- **詳情頁生成**: `POST /generate-detail`
  - 輸入: `{ "keyword": "...", "category": "...", "title": "..." }`
  - 輸出: `{ "ok": true, "features": [...], "specs": {}, "scenarios": "...", "notes": "..." }`
