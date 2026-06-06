# 願景

## 問題陳述
AI coding 工具能記住 what（code），但記不住 why（為什麼這樣設計、踩過什麼坑、什麼原則不可妥協）。現有 agent memory 方案（Letta / Mem0 / Mastra…）走「全自動、平台綁定、混存 what+why」——沒有一個強調「結構化的人策展知識 + 人在環確認 + 視角組織」。

## 核心想法
knowie 是一個**寄生在 markdown 上、給 AI 讀的 why 協議**：把專案的 why 偽裝成一堆 md 檔 + 幾個簡單 skill，讓任何 AI 不必學就會用，且人保有定案主權。

## 現狀
- 三檔（principles / vision / experience）作為知識的介面，已過十幾個專案驗證、穩定好用。
- **五個 skill：init / capture / next / judge / update**，共用 `_core`（CLI 安裝時注入），全部蒸餾成判準式。
- **結構對齊 concepts / history / draft**；templates / README 同步。
- **dogfood：knowie 有了自己的 knowledge/**（三檔 + 子目錄 + draft），judge 試跑過一次自我維護。
- 知識→行動閉環四段都有對應動作；「執行中遵守」「回流分發」仍待打磨（設計見 `draft/`）。

## 架構（why 協議層）

```
AI runtime（Claude Code / Letta / Codex…）   ← 讀寫檔 + 執行
        ↓
knowie why 協議（三視角結構 + skill 行為約定）  ← 寄生在「讀寫 markdown」
        ↓
某專案的知識庫實例
```

## 路線圖

### ✅ 已完成（2026-06，兌現出列）
- skill 改寫成「`_core` 共享核心 + 判準式薄職責」（init/capture/next/judge/update）；CLI 注入 `_core`；結構對齊 concepts/history/draft；templates/README 同步。（教訓已回流 experience）

### 進行中 / 待做
- **軟介面硬化**：結構承載語義（templates 大部分已做）；judge 作為 compliance test（孤兒/死連結偵測已做；**複習偵測待硬化**，見 `draft/記憶動態`）。
- **補完知識→行動閉環**：capture 已補（寫入）；回流分發（experience ↔ episodes）設計見 `draft/記憶動態`；next 召回率待做。

（②b 執行縫隙、跨專案層、ROI/失敗模式、設計型提案 → 見 `draft/`）

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 競品 / Letta / Mem0 / agent memory / 協議定位 | `concepts/協議非平台.md` |
| 開放問題 / ROI / 失敗模式 / 跨專案層 / 協議版本 | `draft/` |
