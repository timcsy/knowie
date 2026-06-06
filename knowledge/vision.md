# 願景

## 問題陳述
AI coding 工具能記住 what（code），但記不住 why（為什麼這樣設計、踩過什麼坑、什麼原則不可妥協）。現有 agent memory 方案（Letta / Mem0 / Mastra…）走「全自動、平台綁定、混存 what+why」——沒有一個強調「結構化的人策展知識 + 人在環確認 + 視角組織」。

## 核心想法
knowie 是一個**寄生在 markdown 上、給 AI 讀的 why 協議**：把專案的 why 偽裝成一堆 md 檔 + 幾個簡單 skill，讓任何 AI 不必學就會用，且人保有定案主權。

## 現狀
- 三檔（principles / vision / experience）作為知識的 介面，已過十幾個專案驗證、穩定好用。
- 四個 skill：init / next / judge / update。
- 0.5.0 已 merge 三大機制（結構化可讀性、state-file 閱讀稽核、Key Extensions 路由）。
- 知識→行動閉環四段都有對應動作；「執行中遵守」「回流分發」仍待打磨。

## 架構（why 協議層）

```
AI runtime（Claude Code / Letta / Codex…）   ← 讀寫檔 + 執行
        ↓
knowie why 協議（三視角結構 + skill 行為約定）  ← 寄生在「讀寫 markdown」
        ↓
某專案的知識庫實例
```

## 路線圖

### 階段 1：skill 從「窮舉流程」改寫成「核心 + 薄職責」
- [ ] 抽出共享核心 `_core`（根公理 / 三視角 / 不變量 / 判準 / 分工）
- [ ] judge 從臃腫機制蒸餾回「不變量 + 判準」
- [ ] next / init / update 改薄

**成功標準**：每個 skill 引用共享核心 + 只剩自己那段薄指令；judge 大幅變短但保留必要繁瑣。

### 階段 2：把「軟介面」硬化
- [ ] 三視角 / 根本原則 / 因果 / 路由 / draft 都由模板結構承載，不靠 skill 文字
- [ ] judge 作為 compliance test：可驗證的證據要求（逐字引用、孤兒偵測）

**成功標準**：能塞進結構的語義都塞進結構；「有沒有遵守」可被機械驗證。

### 階段 3：補完知識→行動閉環
- [ ] 回流的 分發（別坍縮進 experience；開修訂根本原則通道）
- [ ] 提升 next 的召回品質（檢索器）

（②b 執行縫隙、跨專案層、ROI/失敗模式 → 見 `draft/`）

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 競品 / Letta / Mem0 / agent memory / 協議定位 | `concepts/協議非平台.md` |
| 開放問題 / ROI / 失敗模式 / 跨專案層 / 協議版本 | `draft/` |
