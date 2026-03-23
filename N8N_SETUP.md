# N8N + MiniMax API 設定指南

## 概述

本專案使用 **HTTP Request** 方式串接 MiniMax API，因為 n8n 官方目前沒有 MiniMax 節點。

---

## MiniMax API 資訊

### API Endpoint
```
https://api.minimax.chat/v1/text/chatcompletion_v2
```

### 需要設定的 Header
```
Content-Type: application/json
Authorization: Bearer YOUR_MINIMAX_API_KEY
```

### Request Body 格式
```json
{
  "model": "MiniMax-Text-01",
  "messages": [
    {
      "role": "user",
      "content": "你的 prompt"
    }
  ],
  "temperature": 0.7
}
```

---

## N8N Workflow 設定步驟

### 1. 安裝 HTTP Request 節點（如果還沒有的話）

N8N 內建 HTTP Request 節點，不需要額外安裝。

### 2. 建立新的 Workflow

```
1. 開啟 n8n
2. 新增 Workflow
3. 加入 HTTP Request 節點
4. 設定如下：
```

### 3. HTTP Request 節點設定

**基本設定：**
- **Method:** POST
- **URL:** `https://api.minimax.chat/v1/text/chatcompletion_v2`

**Header:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `YOUR_MINIMAX_API_KEY` |

**Body 內容模式：選擇「JSON」**

**Body:**
```json
{
  "model": "MiniMax-Text-01",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "temperature": 0.7
}
```

**輸出處理：**

在下一個 Code 節點解析回傳：
```javascript
// 假設 MiniMax 回傳格式如下
const response = $input.first().json;

// 取出回覆文字
const reply = response.choices[0].message.content;

return [{ json: { result: reply } }];
```

---

## 修改現有 Workflow

### 將 Gemini 節點替換為 HTTP Request

1. **刪除** `Message a model`（Gemini）節點
2. **新增** `HTTP Request` 節點
3. **新增** `Code` 節點處理回傳

### 新增 HTTP Request 節點

```
URL: https://api.minimax.chat/v1/text/chatcompletion_v2

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_MINIMAX_API_KEY

Body (JSON):
{
  "model": "MiniMax-Text-01",
  "messages": [
    {
      "role": "user", 
      "content": "{{ $json.prompt }}"
    }
  ],
  "temperature": 0.7
}
```

### 新增處理回傳的 Code 節點

```javascript
// 解析 MiniMax API 回應
const response = $input.first().json;

let result = {
    ok: true,
    title: "",
    rationale: ""
};

try {
    // MiniMax 回傳格式
    const content = response.choices[0].message.content;
    
    // 嘗試解析為 JSON
    const parsed = JSON.parse(content);
    result.title = parsed.title;
    result.rationale = parsed.rationale;
} catch (e) {
    result.ok = false;
    result.error = "解析失敗";
}

return [{ json: result }];
```

---

## 測試方式

1. 在 n8n 中點擊「Test Workflow」
2. 手動輸入測試資料：
   ```json
   {
     "keyword": "ALTIS 碳纖維 後照鏡",
     "category": "car"
   }
   ```
3. 確認有正確回傳

---

## 常見問題

### Q: 收到 401 Unauthorized
**A:** 檢查 API Key 是否正確，確認有「Bearer 」前綴

### Q: 收到 400 Bad Request
**A:** 檢查 JSON 格式是否正確，確認 model 名稱

### Q: 連線逾時
**A:** 增加 Timeout 時間，或檢查網路連線

---

## 費用說明

MiniMax API 按用量收費，請參考官網定價。

---

## 下一步

1. 確認你有 MiniMax API Key
2. 按照以上步驟設定 n8n
3. 把 Webhook URL 填入 `js/app.js` 的 `CONFIG.n8nWebhook`
