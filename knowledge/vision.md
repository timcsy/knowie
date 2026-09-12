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
- **（2026-07-23）拿去真實專案測·階段二外推驗證通過（n=2）**：兩個真實非示範專案（ArduinoCAD／電路 CAD、LearnNews／新聞分診）端到端用 knowie——domain 知識長起來、next 召回命中、ROI 為正（作者 experiencer 自評）。跨過「先內省→後外推」門檻。樣本小、非大規模已驗，見 `history/010`。

### 進行中 / 待做

**拿去真實專案測**（里程碑，分兩階）— ✅ **階段二（2026-07-23）通過，見 `history/010`**（樣本 n=2、非大規模）。dogfood 驗得了結構與機制，驗不了 domain 層。但 **固化 ≠ 外推**：工具自身還沒穩（churn 未收斂）前外推會散播不穩定，所以**先內省、後外推**。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)。
- **階段一（現在）·經驗者內省自評**：
  - [x] 作者當 experiencer 評「好不好用」（人因／順不順——靠經驗想得清的先用內省）
- **階段二（churn 收斂、設計穩定後）·真實專案外推**：
  - [x] 至少一個真實專案端到端用 knowie（達成：ArduinoCAD＋LearnNews 兩個）
  - [x] 領域知識真的長起來（concepts/episodes 有東西沉下去）— ArduinoCAD 明確；LearnNews 在長、concepts 尚未沉澱
  - [x] 動手時 next 召回命中（不用人提醒就找到相關 why）
  - [x] **ROI**：knowie 真讓專案更好（決策更準／共識更清），不是精緻的儀式或拖延（這維只有真實使用驗得到）

**軟介面硬化（剩餘）** — judge 的複習偵測（review-signal 推進一步）已寫進指令。設計脈絡 ←→ [記憶動態](draft/2026-06-06-記憶動態.md)。
- [ ] 真實使用中，同主題反覆真的觸發「推進一階」
- [ ] 規模到了再硬化（主題 tag + 偵測協議，相似度可插拔）

**next 召回率** — 三視角 brief 已做。設計脈絡 ←→ [閉環縫隙](draft/2026-06-05-閉環縫隙.md)。
- [x] 真實使用中召回命中（漏掉相關 why 是主要失敗模式）— 2026-07-23 兩專案自評命中，見 `history/010`（n=2）

**程序記憶自習得（可建機制完成）** — 讓 LLM 把反覆做的事蒸餾成 skill（capture 的程序版）：meta skill（維護知識庫）+ **domain skill**（專案領域的重複工作，更有價值）。skill 是知識（code=data）→ 重用記憶動態，不造引擎。設計脈絡 ←→ [記憶系統框架](draft/2026-06-06-記憶系統框架.md)、[競品與生存空間](draft/2026-06-06-競品與生存空間.md)。
- [x] capture 察覺操作重複、記「候選 skill」進 `draft/`（連這次怎麼做）— A+B
- [x] `knowledge/skills/`（小腦）結構 +（人確認）固化機制；採 **agentskills.io 格式、不自造引擎** — A+B
- [x] skill 化更嚴人確認（執行級）；記 **why-behind-skill** — capture 程序版
- [x] 安裝到工具位置——**AI 固化時直接裝**到專案 skill 位置（B）。（CLI 批次安裝 installDomainSkills 一度建、又砍：純 no-op + 專案 scope 用不到；跨 checkout/泛化才需要 → 真要時再接）
- [x] 觸發接進三 skill（next 預防＋消費 / capture 記錄 / judge §5 backstop＋抓過時 skill）
- [x] **跨工具散佈（內部 symlink 投影）機制完成**（2026-06-12）——`knowledge/skills/` 為唯一源 → **AI 內部** per-skill symlink 投影到 `.claude/skills` + `.agents/skills`（capture 程序版固化時投影 + judge §5 re-ensure/heal；可逆故自動、**非 CLI**）；registry 加 `skillsDir`；handshake 補指 `skills/`；Windows 退化 copy。對標 agentskills.io + `.agents/skills/` 慣例。轉移見 [history/016](history/016-跨工具散佈-單一源加枚舉投影.md)
  - [ ] symlink/Windows + 真實 Codex/Gemini 讀到並用到 domain skill（**驗證類，merge 後**）
- [ ] **進化（outcome-based）**：用了結果爛 → 自動標記、人改寫——**驗證類**（要真實 skill 執行+結果才驗得到；過時/未用偵測已在 judge §5）
- [x] **在一個真實專案長出至少一個 domain skill**（2026-08-14 確認：**5/5 專案兌現**——semorphe 12、VizGPT 7、ArduinoCAD 2、wewayfinders 2、KnowField 1）。兌現在 2026-07～08 就發生了，直到本次審計才被發現——**證據在別的 repo，judge 掃不到** → 見下方「驗證證據回收」。現場 → [episode](episodes/2026-08-14-五專案外推審計.md)

**健康儀表板 → 併入 judge（不另做 CLI，2026-06-07 定）** — judge 本來就用 grep/ls 算機械指標（孤兒/死連結/計數，§3），已滿足「機械算、不靠 AI 自報」；語義/時序指標（冪等/趨平/churn）也是 judge 的。另做 `knowie health` CLI＝重複邏輯 + 把「分析知識內容」放進 CLI＝平台化（違反協議非平台）。**所以不做 CLI，judge 就是健康儀表板。**

**CLI/MCP 編排委派到共用核心** — `init`/`update` 在 CLI（`commands/*.js`）和 MCP（`mcp-server.js` handler）各實作整套編排 → 必漂（已驗：update 漏 README/language、init 語言寫法分歧）。抽非互動核心讓兩端委派（CLI 包互動層、MCP 直呼核心），消掉重複而非逐個對齊。是 [分發非傾倒](concepts/分發非傾倒.md) 的對偶（唯一真實來源）。設計脈絡 ←→ [CLI-MCP編排委派](draft/2026-06-12-CLI-MCP編排委派.md)。
- [ ] 抽 `runInit`/`runUpdate` 純核心（不含 prompt/console，回 structured result）
- [ ] CLI = 互動層決定 opts → 呼核心 → 印人話；MCP = 參數組 opts → 呼核心 → 串 report
- [ ] 統一 config 寫入語意（顯式傳入的 language 才覆蓋）+ structureVersion 落後警告移進核心 result，兩端都報

**版本偵測 + 遷移提示**（實作完，待真實舊專案驗）— 用 `.knowie.json` 的 **`structureVersion`**（與 tool `version` 脫鉤，只在結構真的改時才升）讓 `/knowie-migrate` 認出舊結構、提示手動遷移（不做向後相容，但**不靜默 breaking**）。轉移見 [history/015](history/015-版本號脫鉤-結構版與工具版.md)。
- [x] update（skill）讀 structureVersion + 比對當前正典訊號、認出舊結構
- [x] 偵測到舊結構 → detect/propose/confirm 手動遷移（不自動改）
- [x] 明示 breaking、不靜默（CLI `structureBehind` 警告 + 修掉「CLI 自動升 version＝靜默 breaking」的 bug）。轉移見 [history/015](history/015-版本號脫鉤-結構版與工具版.md)
- [x] **git 時光機**：re-home 有歧義時，用 `git log`/`git show` 還原當時的 knowledge/code/spec；舊 base 的 git log ＝ 可蒸餾成 `history/` 的因果軌跡；留 commit 指針補「how 腿」（四護欄：脈絡非 import what／有界非考古／優雅降級／人仍確認）。轉移見 [history/009](history/009-migrate運作模型從snapshot判斷到時間軸replay.md)
- [ ] **時間軸 replay 重構（in-flight，0.6.3→0.6.8）**：把 migrate 從「看終局一次判斷」改成「順 git 往前播、逐片疊、遮罩未來、跑真代謝」；含 first-parent 切片 + adoption 相位邊界 + 兩種聲音 why。battle 真跑已驗「決策轉移只從往前播長出來」，但亂史/cascade/推錯 why 等常態破口待真實驗。設計脈絡 ←→ [時間軸replay](draft/2026-06-12-migrate時間軸replay.md)（幅射到 [預期問題](draft/2026-06-12-migrate預期問題.md)／[架構視角](draft/2026-06-12-migrate架構視角-ES-CQRS-DDD.md)／[遮罩harness](draft/2026-06-12-遮罩harness設計.md)）
- [ ] 真實舊專案（research/design/history era）遷移驗證（驗證類，merge 後）

**驗證證據回收（外部 repo）** — knowie 有一整批驗證類 roadmap 項，證據**天生在使用者的 repo 裡**（domain skill、next 召回、軟介面硬化、FUSE），而 judge 只掃 `knowledge/`（那是對的，why-lane 不掃 what）→ 結果是**系統性低估自己**：5/5 專案長出 domain skill，knowie 記成未達成。這是 [協議非平台](concepts/協議非平台.md) 的代價面。設計脈絡 ←→ [驗證證據在外部repo](draft/2026-08-14-驗證證據在外部repo.md)。
- [ ] 驗證類 roadmap 項支援 `證據：<路徑或 repo>` 一行指標；judge 掃到路徑存在且非空 → **提出「可能已兌現，去確認」**（不自動勾，人定案）
- [ ] `skills/` 分兩類：domain（綁 endeavor）vs endeavor-independent（`over-justify`／`commit-feature`／`visual-diff` 這類）；後者 `SKILL.md` frontmatter 可選 `origin: <repo>@<commit>`，judge §5 掃到就報「上游可能變了」
- [ ] 不做同步機制／registry（會走回平台化）——只報，不搬
- [x] 修 `.agents/skills/` 從未被建立——**根因不是措辭，是沒有枚舉來源**：投影是 AI 做的，而 `registry.js` 的 `skillsDir` 是 CLI 的資料，skill markdown 讀不到；`.knowie.json` 只記 tool id。所以 AI 只投影它自己讀的那個目錄。修法：`init`/`update`（CLI + MCP 四處，共用 `getSkillDirs()`）把解析後的清單寫進 `.knowie.json` → `skillDirs`，capture/judge 改成**枚舉它**。registry 仍是唯一來源，config 只承載它的投影。
- [x] 投影 symlink 一律**相對路徑**（VizGPT 實測是絕對路徑，換 checkout 就全斷）；judge §5 掃到絕對路徑直接修回（可逆 → 自動）
- [x] 補上 016 的另一半（0.7.6）：**CLI 自舉也枚舉 `skillDirs`**——實體進 `.agents/skills/`、其餘 per-skill 相對 symlink；`getSkillDirs()` 設**地板** `.agents` + `.claude`，不靠偵測。起點是使用者在 Codex 回報「`init --yes` 沒建 `.agents/skills/`」，查下去發現六個 skill 全在一個沒註冊的工具目錄裡。轉移見 [history/018](history/018-skill自舉-agents為家與地板目錄.md)
- [x] 順手修：`init --yes` 的 `selectedIds` 沒去重，既有 `AGENTS.md` 會讓 `agents-md` 在 config 裡出現兩次（MCP 那條有 `new Set`、CLI 沒有——又一個 CLI/MCP 漂移）

**知識條目的形狀（模板 + `_core`）** — ✅ 0.7.3 完成。experience 模板加「不適用的時候／相關」、concept 命名採斷言式、教訓寫判準不寫做法、強調預算，四項進 `_core` + 雙語模板。回頭套用到 knowie 自己：跑 `update` 收齊 managed files、砍掉 `concepts/README` 那張已漂的索引表（每個概念檔本來就自帶一句話，索引是複述）、孤兒 draft 接進 principles 路由；**沒做**既有內容的強調瘦身——那個數字後來被證明分不開好壞，追它就是追一個非鑑別指標。命名那條的轉移見 [history/013](history/013-概念命名從名詞式到斷言式.md)；現場與量測見 [episode](episodes/2026-08-14-五專案外推審計.md)。

**judge 再機械一階** — ✅ 0.7.3 完成。**四條**採用（舊欄位寫成進度／vision 勾選比／整層孤兒率／教訓缺來源，加檔名禁空白；孤兒率那條 2026-08-18 補上**指法前置檢查**——KnowField 回流證明 `[[ ]]`／反引號路徑會讓孤兒率系統性假高；七庫實測 0.0/1.4/2.3/2.5% 與 11.8/13.4/22.4% 之間有乾淨缺口，所以這條**掙得起門檻**，而強調密度掙不起），**兩條否決**（檔名轉移詞、強調密度）→ 墓碑見 [history/012](history/012-否決兩條機械檢查-檔名詞彙與強調密度.md)。六庫 fixture 驗收零誤報。現場與量測見 [episode](episodes/2026-08-14-五專案外推審計.md)。

**FUSE 掛載驗證**（北極星，仍未證）— adapter 從 `[]()` 結構衍生 graph、把 knowie 的 why 層掛上 LLM Wiki / Obsidian / 向量後端；軟介面硬化到「可被多方實作」。設計脈絡 ←→ [檢索機制-graph還是path](draft/2026-06-07-檢索機制-graph還是path.md)。
- [ ] 一個 adapter 把 knowie 結構餵進一個後端（如 Obsidian / LLM Wiki），graph/backlink 由後端衍生
- [ ] 驗證「掛上去比純後端更好」（多了 why-邊）
- [ ] 軟介面硬化到外部能照協議實作（可形式化的部分）

（執行縫隙②b、跨專案層、ROI/失敗模式、FUSE 掛載 → 仍在 `draft/`；根公理已定案見 `history/004`；認知失調處理已結晶 `concepts/讓認錯變便宜`）

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 競品 / Letta / Mem0 / agent memory / 協議定位 | [concepts/協議非平台](concepts/協議非平台.md) |
| graph engineering / context graph / execution graph / 節點契約 / 錨點凍結 / loop 的下一層 | [draft/2026-09-12-graph-engineering定位與六條接口](draft/2026-09-12-graph-engineering定位與六條接口.md) |
| 下一層是什麼 / 控制面 / 艦隊治理 / 平台捕獲 / 鷹架通縮 / 存證 | [draft/2026-09-12-graph之後是治理與存證](draft/2026-09-12-graph之後是治理與存證.md) |
| 記憶動態 / 回流 / 兩條輸入線 / 分層整理 | `_core` / capture / judge（已固化）；緣由見 [draft/2026-06-06-記憶動態](draft/2026-06-06-記憶動態.md) |
| 開放問題 / ROI / 失敗模式 / 協議版本 | `draft/` |
| 外部驗證 / 證據在別的 repo / domain skill 兌現 / 跨專案 skill / skill origin | [draft/2026-08-14-驗證證據在外部repo](draft/2026-08-14-驗證證據在外部repo.md) |
| managed 檔覆蓋 / update 洗掉本地慣例 / README 客製 / 慣例回不來 / 邊界之外 | [draft/2026-08-14-managed檔覆蓋衝突](draft/2026-08-14-managed檔覆蓋衝突.md) |
| 跨專案複利 / 冷啟動 / 判準庫 / meta-endeavor / 召回率上界 / 母概念候選「邊界之外」 | [draft/2026-08-14-跨專案判準複利與冷啟動](draft/2026-08-14-跨專案判準複利與冷啟動.md) |
| 知識條目形狀 / concept 命名 / 四段式升版 / 不適用的時候 / 強調預算 | [history/013-概念命名從名詞式到斷言式](history/013-概念命名從名詞式到斷言式.md) |
| judge 機械檢查 / vision 勾選比 / 整層孤兒 / 被否決的兩條 | [history/012-否決兩條機械檢查-檔名詞彙與強調密度](history/012-否決兩條機械檢查-檔名詞彙與強調密度.md) |
