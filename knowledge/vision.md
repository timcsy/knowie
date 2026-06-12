# 願景

## 問題陳述
AI coding 工具能記住 what（code），但記不住 why（為什麼這樣設計、踩過什麼坑、什麼原則不可妥協）。現有 agent memory 方案（Letta / Mem0 / Mastra…）走「全自動、平台綁定、混存 what+why」——沒有一個強調「結構化的人策展知識 + 人在環確認 + 視角組織」。

## 核心想法
knowie 是一個**寄生在 markdown 上、給 AI 讀的 why 協議**：把專案的 why 偽裝成一堆 md 檔 + 幾個簡單 skill，讓任何 AI 不必學就會用，且人保有定案主權。

**最具體的定位（已在用）：knowie 是 SDD 的 why 供給層 ＋ 對帳層。** SDD（Spec Kit / Kiro / …）把 spec→code，但公認的洞是「持久的 why／spec 從哪來、怎麼跨 feature 不漂」。knowie 補這個：

```
knowie why（原則/願景/經驗，為共識而記、對 code 負責）
   │ next 把 why 餵 →
   ▼
SDD spec ─ 生成 → code（what 真相）
   ▲ judge 對帳、capture 回流 ←┘
```

spec 是交棒物；knowie 是**持久** why 記憶，spec 是**每 feature 一次性**的意圖。**SDD 越普及，這個接口越被需要（順風，非競品）**；「code 真相 vs spec 真相」是假對立（驗證方向 vs 生成方向，兩軸）。

**更廣的定位（FUSE 式）**：同理也掛在記憶 agent（Letta / Hermes）/ LLM Wiki 之上，補它們留白的**結構化 *why***（三視角／因果／法典）。knowie 只定義「協議與運作方式」，底層記憶與檢索可插拔（大規模 graph/RAG 外包後端）。最近的真競品是 **ADR-for-AI**（持久 why↔code），但它扁平、無三視角／回流／代謝。緣由見 `draft/競品與生存空間`、`history/003`。
（修正：「人在環」本身不獨特——LLM Wiki/Karpathy 派也強調人策展；獨特的是 *結構化的 why 從開發回流、對 code 負責、會自我代謝*。）

**單位是 endeavor，不是 topic-web。** knowie 組織的是「一個**有 why 的志業**」——任何刻意推進、有方向的事（書/團隊/研究/創作，軟體只是已驗證的一種）都套得上；但通用 topic-web／second-brain（無單一願景）是 LLM Wiki 的地盤（拿掉 endeavor，vision/experience/next/judge 全沒東西可咬）。對應地，knowie 的「軟體層」其實是 **artifact 封裝**（code 只是 artifact 之一，照片/手稿同理「持 why、指向 artifact」）。緣由見 `draft/能否跨領域-endeavor為單位`。

**跨 session／跨廠商的 why 交接層。** 因為 why 是 markdown+git（零平台），不同 session、甚至不同廠商 AI（Codex↔Claude，經 **AGENTS.md** 中立交接點）讀到同一份 why——這是平台型記憶（MiMoCode/Letta，鎖在自家廠商內）**結構上做不到**的，是「協議非平台」最直接的兌現。註：knowie **不交接 context window**（任務級逐字稿要靠離場 capture + git）。緣由見 `draft/跨session跨廠商handover`。

## 現狀
- 三檔（principles / vision / experience）作為知識的介面，已過十幾個專案驗證、穩定好用。
- **六個 skill：init / capture / consolidate / next / judge / migrate**，共用 `_core`（CLI 安裝時注入），全部蒸餾成判準式。（consolidate（固化）＝人主動把成熟 draft 固化出去，capture 的對稱端；capture 編碼→consolidate 固化→next 提取＝記憶形成三階段。）
- **結構對齊 concepts / episodes / history / draft**；templates / README 同步。
- **記憶動態已固化進 skills**：兩條輸入線（Thinking→draft / Doing→回流）、回流分發（lesson→experience、現場→episodes、轉折→history、兌現出列）、分層整理（各層各自的收斂方式）寫進 `_core` / capture / judge。
- **dogfood：knowie 有了自己的 knowledge/**（三檔 + concepts/episodes/history/draft），judge 已跑兩次自我維護；第二次**機械層全乾淨**（61 連結 0 死、無孤兒），抓到的全在**判斷層**（定案狀態、久懸概念、experience 收斂時機）——正好印證判準式 judge 的分工：機械該抓的抓滿，價值在語義判斷。
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

> **出貨/merge 政策**：**可建的功能做完才把 redesign 併回 main**（build-first，不 merge 半套）。**驗證類項目**（拿去真實專案測、next 召回率、軟介面硬化、FUSE 掛載）本質是 **merge 後／持續**的——它們等不到 merge 前完成（階段二甚至需要先有穩定的 main），不擋 merge。
> 釐清：建**已承諾的 roadmap 功能**（過了閘門、有驗收）**不算過度工程**——那是執行承諾；過度工程是「加沒承諾的／鍍金」。所以 build-first 與「別過度工程」不衝突。
> 釐清 2（2026-06-07）：**「可建」＝機制建得出來；驗證永遠是之後的階段，不是「可建」的前提**（可建 ⊉ 可驗）。所以 **`程序自習得` 是可建功能**（機制 pre-merge 建，只有「真實專案驗 domain skill」那條是 post-merge）——不被 re-route 成驗證類。先建完 skill 部分再去驗。

### ✅ 已完成（2026-06，兌現出列）
- **（2026-06-06）** skill 改寫成「`_core` 共享核心 + 判準式薄職責」（init/capture/next/judge/update）；CLI 注入 `_core`；結構對齊 concepts/episodes/history/draft；templates/README 同步。（教訓已回流 experience）
- **（2026-06-07）記憶動態固化**：episodes 進結構；兩條輸入線、回流分發、分層整理寫進 skills（`_core`/capture/judge）。從半成品變成「機制完整、可拿去真實測」。（人定案＝使用者「固化」指令；過程曾跳過 roadmap 閘門，被 dogfood 抓到，見 `history/002`）

### 進行中 / 待做

**拿去真實專案測**（里程碑，分兩階）— dogfood 驗得了結構與機制，驗不了 domain 層。但 **固化 ≠ 外推**：工具自身還沒穩（churn 未收斂）前外推會散播不穩定，所以**先內省、後外推**。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)。
- **階段一（現在）·經驗者內省自評**：
  - [ ] 作者當 experiencer 評「好不好用」（人因／順不順——靠經驗想得清的先用內省）
- **階段二（churn 收斂、設計穩定後）·真實專案外推**：
  - [ ] 至少一個真實專案端到端用 knowie
  - [ ] 領域知識真的長起來（concepts/episodes 有東西沉下去）
  - [ ] 動手時 next 召回命中（不用人提醒就找到相關 why）
  - [ ] **ROI**：knowie 真讓專案更好（決策更準／共識更清），不是精緻的儀式或拖延（這維只有真實使用驗得到）

**軟介面硬化（剩餘）** — judge 的複習偵測（review-signal 推進一步）已寫進指令。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)。
- [ ] 真實使用中，同主題反覆真的觸發「推進一階」
- [ ] 規模到了再硬化（主題 tag + 偵測協議，相似度可插拔）

**next 召回率** — 三視角 brief 已做。設計脈絡 ←→ [閉環縫隙](draft/2026-06-05-閉環縫隙.md)。
- [ ] 真實使用中召回命中（漏掉相關 why 是主要失敗模式）

**程序記憶自習得（可建機制完成）** — 讓 LLM 把反覆做的事蒸餾成 skill（capture 的程序版）：meta skill（維護知識庫）+ **domain skill**（專案領域的重複工作，更有價值）。skill 是知識（code=data）→ 重用記憶動態，不造引擎。設計脈絡 ←→ [記憶系統框架](draft/2026-06-06-記憶系統框架.md)、[競品與生存空間](draft/2026-06-06-競品與生存空間.md)。
- [x] capture 察覺操作重複、記「候選 skill」進 `draft/`（連這次怎麼做）— A+B
- [x] `knowledge/skills/`（小腦）結構 +（人確認）固化機制；採 **agentskills.io 格式、不自造引擎** — A+B
- [x] skill 化更嚴人確認（執行級）；記 **why-behind-skill** — capture 程序版
- [x] 安裝到工具位置——**AI 固化時直接裝**到專案 skill 位置（B）。（CLI 批次安裝 installDomainSkills 一度建、又砍：純 no-op + 專案 scope 用不到；跨 checkout/泛化才需要 → 真要時再接）
- [x] 觸發接進三 skill（next 預防＋消費 / capture 記錄 / judge §5 backstop＋抓過時 skill）
- [ ] **進化（outcome-based）**：用了結果爛 → 自動標記、人改寫——**驗證類**（要真實 skill 執行+結果才驗得到；過時/未用偵測已在 judge §5）
- [ ] 在一個真實專案長出至少一個 domain skill（**驗證類，merge 後**）

**健康儀表板 → 併入 judge（不另做 CLI，2026-06-07 定）** — judge 本來就用 grep/ls 算機械指標（孤兒/死連結/計數，§3），已滿足「機械算、不靠 AI 自報」；語義/時序指標（冪等/趨平/churn）也是 judge 的。另做 `knowie health` CLI＝重複邏輯 + 把「分析知識內容」放進 CLI＝平台化（違反協議非平台）。**所以不做 CLI，judge 就是健康儀表板。**

**版本偵測 + 遷移提示**（實作完，待真實舊專案驗）— 用 `.knowie.json` 的 **`structureVersion`**（與 tool `version` 脫鉤，只在結構真的改時才升）讓 `/knowie-migrate` 認出舊結構、提示手動遷移（不做向後相容，但**不靜默 breaking**）。設計脈絡 ←→ [往外長](draft/2026-06-05-往外長.md)。
- [x] update（skill）讀 structureVersion + 比對當前正典訊號、認出舊結構
- [x] 偵測到舊結構 → detect/propose/confirm 手動遷移（不自動改）
- [x] 明示 breaking、不靜默（CLI `structureBehind` 警告 + 修掉「CLI 自動升 version＝靜默 breaking」的 bug）
- [x] **git 時光機**：re-home 有歧義時，用 `git log`/`git show` 還原當時的 knowledge/code/spec；舊 base 的 git log ＝ 可蒸餾成 `history/` 的因果軌跡；留 commit 指針補「how 腿」（四護欄：脈絡非 import what／有界非考古／優雅降級／人仍確認）。設計脈絡 ←→ [往外長](draft/2026-06-05-往外長.md)
- [ ] 真實舊專案（research/design/history era）遷移驗證（驗證類，merge 後）

**FUSE 掛載驗證**（北極星，仍未證）— adapter 從 `[]()` 結構衍生 graph、把 knowie 的 why 層掛上 LLM Wiki / Obsidian / 向量後端；軟介面硬化到「可被多方實作」。設計脈絡 ←→ [檢索機制-graph還是path](draft/2026-06-07-檢索機制-graph還是path.md)。
- [ ] 一個 adapter 把 knowie 結構餵進一個後端（如 Obsidian / LLM Wiki），graph/backlink 由後端衍生
- [ ] 驗證「掛上去比純後端更好」（多了 why-邊）
- [ ] 軟介面硬化到外部能照協議實作（可形式化的部分）

（執行縫隙②b、跨專案層、ROI/失敗模式、FUSE 掛載 → 仍在 `draft/`；根公理已定案見 `history/004`；認知失調處理已結晶 `concepts/讓認錯變便宜`）

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 競品 / Letta / Mem0 / agent memory / 協議定位 | `concepts/協議非平台.md` |
| 記憶動態 / 回流 / 兩條輸入線 / 分層整理 | `_core` / capture / judge（已固化）；緣由見 `draft/記憶動態` |
| 開放問題 / ROI / 失敗模式 / 跨專案層 / 協議版本 | `draft/` |
