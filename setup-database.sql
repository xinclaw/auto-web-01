-- ============================================
-- xinding-hub-bot 資料庫設定
-- ============================================

-- 建立 product_keywords 資料表
CREATE TABLE IF NOT EXISTS product_keywords (
    id BIGSERIAL PRIMARY KEY,
    keyword TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT,
    description TEXT,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 開啟 RLS (Row Level Security)
ALTER TABLE product_keywords ENABLE ROW LEVEL SECURITY;

-- 建立 policy：所有人都可以讀取
CREATE POLICY "Allow read for all" ON product_keywords
    FOR SELECT USING (true);

-- 建立 policy：所有人可以新增
CREATE POLICY "Allow insert for all" ON product_keywords
    FOR INSERT WITH CHECK (true);

-- 建立 policy：所有人可以更新
CREATE POLICY "Allow update for all" ON product_keywords
    FOR UPDATE USING (true);

-- 建立 function：自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 建立 trigger：當更新時自動更新 updated_at
DROP TRIGGER IF EXISTS update_product_keywords_updated_at ON product_keywords;
CREATE TRIGGER update_product_keywords_updated_at
    BEFORE UPDATE ON product_keywords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_product_keywords_category ON product_keywords(category);
CREATE INDEX IF NOT EXISTS idx_product_keywords_keyword ON product_keywords(keyword);

-- ============================================
-- 測試資料（可以刪除）
-- ============================================
INSERT INTO product_keywords (keyword, category, title, description) VALUES
('ALTIS 碳纖維 後照鏡', 'car', 'TOYOTA 豐田 ALTIS 12代 碳纖維 後視鏡蓋 後視鏡殼 防刮 保護', '測試說明1'),
('BMW 220i TPU', 'car', '寶馬 BMW 220i U06 Luxury 透明膜 TPU 門把手 保護膜 貼膜', '測試說明2');
