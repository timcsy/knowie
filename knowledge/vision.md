# 願景

## 問題陳述
AI coding 工具能記住 what（code），但記不住 why（為什麼這樣設計、踩過什麼坑、什麼原則不可妥協）。現有 agent memory 方案（Letta / Mem0 / Mastra…）走「全自動、平台綁定、混存 what+why」——沒有一個強調「結構化的人策展知識 + 人在環確認 + 視角組織」。

## 核心想法
knowie 是一個**寄生在 markdown 上、給 AI 讀的 why 協議**：把專案的 why 偽裝成一堆 md 檔 + 幾個簡單 skill，讓任何 AI 不必學就會用，且人保有定案主權。

**定位（FUSE 式）**：不與記憶 agent（Letta / Hermes）或 LLM Wiki 競爭，而是**掛在它們之上、補它們留白的那塊——結構化的 *why*（三視角／因果／法典）**。knowie 只定義「協議與運作方式」，底層記憶與檢索可插拔（大規模 graph/RAG 外包後端，adapter 從 `[]()` 結構衍生 graph）；協議被多方實作正是它的成功（像 FUSE 被各 OS 支援），不是被吸收。緣由見 `draft/競品與生存空間`、`history/003`。
（修正：「人在環」本身不獨特——LLM Wiki/Karpathy 派也強調人策展；獨特的是 *結構化的 why*。）

## 現狀
- 三檔（principles / vision / experience）作為知識的介面，已過十幾個專案驗證、穩定好用。
- **五個 skill：init / capture / next / judge / update**，共用 `_core`（CLI 安裝時注入），全部蒸餾成判準式。
- **結構對齊 concepts / episodes / history / draft**；templates / README 同步。
- **記憶動態已固化進 skills**：兩條輸入線（Thinking→draft / Doing→回流）、回流分發（lesson→experience、現場→episodes、轉折→history、兌現出列）、分層整理（各層各自的收斂方式）寫進 `_core` / capture / judge。
- **dogfood：knowie 有了自己的 knowledge/**（三檔 + 子目錄 + draft），judge 試跑過一次自我維護。
- **連結慣例定案 `[]()`**（延伸原則 8 + `history/003`）：9 處 `[[ ]]` 已遷；graph/backlink 衍生不扛，judge 加 backlink 衍生職責。
- 知識→行動閉環四段都有對應動作；尚待真實專案驗證 domain 層（dogfood 摸不到的部分）。

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
- **記憶動態固化**：episodes 進結構；兩條輸入線、回流分發、分層整理寫進 skills（`_core`/capture/judge）。從半成品變成「機制完整、可拿去真實測」。（人定案＝使用者「固化」指令；過程曾跳過 roadmap 閘門，被 dogfood 抓到，見 `history/002`）

### 進行中 / 待做

**拿去真實專案測**（下一個里程碑）— dogfood 驗得了結構與機制，驗不了 domain 層。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)、[怎麼知道knowie好不好](draft/2026-06-05-怎麼知道knowie好不好.md)。
- [ ] 至少一個真實專案端到端用 knowie
- [ ] 領域知識真的長起來（concepts/episodes 有東西沉下去）
- [ ] 動手時 next 召回命中（不用人提醒就找到相關 why）

**軟介面硬化（剩餘）** — judge 的複習偵測（review-signal 推進一步）已寫進指令。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)。
- [ ] 真實使用中，同主題反覆真的觸發「推進一階」
- [ ] 規模到了再硬化（主題 tag + 偵測協議，相似度可插拔）

**next 召回率** — 三視角 brief 已做。設計脈絡 ←→ [閉環縫隙](draft/2026-06-05-閉環縫隙.md)。
- [ ] 真實使用中召回命中（漏掉相關 why 是主要失敗模式）

**程序記憶自習得** — 讓 LLM 把反覆做的事蒸餾成 skill（capture 的程序版）：meta skill（維護知識庫）+ **domain skill**（專案領域的重複工作，長出領域能力庫，更有價值）。設計脈絡 ←→ [記憶系統框架](draft/2026-06-06-記憶系統框架.md)、[競品與生存空間](draft/2026-06-06-競品與生存空間.md)。
- [ ] capture 能察覺操作重複、記「候選 skill」進 draft（連這次怎麼做）
- [ ] 反覆/成熟 → 固化成 skill，採 **agentskills.io 格式、不自造引擎**
- [ ] skill 化走人確認（比知識定案更慎）
- [ ] 在一個真實專案長出至少一個 domain skill

**健康儀表板** — 把散落各處的指標收斂成一個可看的儀表板（「知道 knowie 好不好」的工具）。設計脈絡 ←→ [怎麼知道knowie好不好](draft/2026-06-05-怎麼知道knowie好不好.md)。
- [ ] 收齊指標（根本原則改動率／概念數趨平／冪等性〔再跑近 no-op〕／孤兒·死連結）
- [ ] 一個指令輸出可看的健康報告
- [ ] 指標可機械算，不靠 AI 自報

**版本偵測 + 遷移提示** — `.knowie.json` 的 `version` 讓 update 認出舊結構、提示手動遷移（不做向後相容，但**不靜默 breaking**）。設計脈絡 ←→ [往外長](draft/2026-06-05-往外長.md)。
- [ ] update 讀 version、認出舊結構
- [ ] 偵測到舊結構 → 印出手動遷移步驟（不自動改）
- [ ] 明示 breaking、不靜默

**FUSE 掛載驗證**（北極星，仍未證）— adapter 從 `[]()` 結構衍生 graph、把 knowie 的 why 層掛上 LLM Wiki / Obsidian / 向量後端；軟介面硬化到「可被多方實作」。設計脈絡 ←→ [檢索機制-graph還是path](draft/2026-06-07-檢索機制-graph還是path.md)。
- [ ] 一個 adapter 把 knowie 結構餵進一個後端（如 Obsidian / LLM Wiki），graph/backlink 由後端衍生
- [ ] 驗證「掛上去比純後端更好」（多了 why-邊）
- [ ] 軟介面硬化到外部能照協議實作（可形式化的部分）

（執行縫隙②b、跨專案層、ROI/失敗模式、認知失調處理、FUSE 掛載 → 仍在 `draft/`；根公理已定案，見 `history/004` + 現場 `episodes/2026-06-07-根公理收斂為共識而記`）

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 競品 / Letta / Mem0 / agent memory / 協議定位 | `concepts/協議非平台.md` |
| 記憶動態 / 回流 / 兩條輸入線 / 分層整理 | `_core` / capture / judge（已固化）；緣由見 `draft/記憶動態` |
| 開放問題 / ROI / 失敗模式 / 跨專案層 / 協議版本 | `draft/` |
