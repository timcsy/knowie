# 讓 AI 真正懂你的專案 — 用 Knowie 從零開發一款有世界觀的遊戲（完整實操教學）

> AI 幫你寫 code 很快。但它總是搞不懂你要做的是「什麼樣的遊戲」。這篇文章用一個完整的遊戲開發案例，帶你一步一步體驗 Knowie 如何改變你和 AI 協作的方式。

---

## 我們要做什麼？

假設你有一個新想法：**用網頁做一款有完整世界觀的冒險遊戲**。

你腦袋裡已經有一些很明確的想法：
- 世界觀是「後魔法時代」—— 魔法已經從世界上消失了，但古代遺跡裡還殘留著魔法碎片
- 風格偏向「看起來簡單但故事很深」的路線
- 你希望玩家的每個選擇都有意義，不是無腦點點點
- 你想用 TypeScript 來開發，在瀏覽器上跑
- 這是你的 side project，一個人做，希望三個月內有個能玩的 demo

你打開 AI 工具，興沖沖地說：「幫我建一個冒險遊戲的專案。」

AI 生出了一堆 3D 模型的程式碼、一個你完全不認識的遊戲引擎、一套你沒要求的複雜架構。

你：「⋯⋯不是這樣。」

**問題不在 AI 不夠強。問題是它不知道你腦袋裡的東西。**

這篇文章會帶你用 Knowie 把腦袋裡的想法結構化，讓 AI 在整個開發過程中都跟你在同一頁。而且當你準備好要把想法細化成規格的時候，Knowie 還能自然銜接 [SpecKit](https://github.com/github/spec-kit) 這類 SDD（Spec-Driven Development）工具 —— 讓「為什麼做」到「做什麼」到「怎麼做」形成一條完整的鏈。

---

## 前置準備

你需要：
- **Node.js 18 以上**（終端機輸入 `node -v` 確認）
- **一個 AI 工具**（以下任一皆可）：
  - Claude Code（支援 slash commands，體驗最完整）
  - GitHub Copilot（在 VS Code 中使用）
  - Gemini CLI
- **一個空的專案目錄**

```bash
mkdir runefall && cd runefall
git init
```

我們的遊戲叫 **Runefall**（符文隕落）。開始吧。

---

## Step 1：安裝 Knowie

在你的**終端機**裡執行：

```bash
npx knowie init
```

> **（此處放截圖：終端機顯示 knowie init 的互動畫面，列出偵測到的 AI 工具）**

Knowie 會問你要連接哪些 AI 工具。它會自動偵測你電腦上裝了什麼。假設你裝了 Claude Code 和 GitHub Copilot，畫面大概像這樣：

```
Detected AI tools:
  ✔ Claude Code (CLAUDE.md)
  ✔ GitHub Copilot (.github/copilot-instructions.md)
  ✔ AGENTS.md

Proceed? (Y/n)
```

按 Enter 確認。Knowie 會：
1. 建立 `knowledge/` 目錄、三份模板文件與子目錄
2. 在 `CLAUDE.md` 和 `.github/copilot-instructions.md` 裡注入知識文件的引用
3. 安裝六個 skill 到 `.claude/skills/`（init / capture / consolidate / next / judge / migrate）
4. 產生 `.knowie.json`

> **小提示：** 如果你是在 AI 聊天裡請 AI 幫你跑，用 `npx knowie init --yes` 可以跳過所有互動。

完成後，你的專案結構會像這樣：

```
runefall/
├── knowledge/
│   ├── principles.md      ← 模板，有引導註解
│   ├── vision.md
│   ├── experience.md
│   ├── concepts/          ← 母概念（語意記憶）
│   ├── episodes/          ← 值得回憶的現場（情節記憶）
│   ├── skills/            ← 學到的領域 skill（程序記憶／小腦）
│   ├── history/           ← 因果軌跡（決策、否決選項）
│   ├── draft/             ← 還沒定案的想法（短期記憶）
│   └── .knowie.json       ← Knowie 的設定檔
├── CLAUDE.md              ← 被注入了 knowledge/ 引用
├── AGENTS.md              ← 被注入了 knowledge/ 引用
└── .github/
    └── copilot-instructions.md  ← 被注入了 knowledge/ 引用
```

> **（此處放截圖：VS Code 側邊欄顯示新產生的 knowledge/ 目錄結構）**

---

## Step 2：用 AI 引導填寫知識文件

打開你的 AI 工具。如果是 **Claude Code**，直接輸入：

```
/knowie-init
```

> **（此處放截圖：Claude Code 中輸入 /knowie-init 後的畫面）**

如果是 **GitHub Copilot** 或 **Gemini**，它們會在你開新對話時自動讀取 `knowledge/` 裡的檔案（因為 Knowie 已經在設定檔裡注入了引用）。你可以直接對 AI 說：

```
請幫我填寫 knowledge/ 裡的三份知識文件。
先從 principles.md 開始，問我幾個問題來了解我的專案理念。
```

效果一樣。差別只在 Claude Code 有內建 skill 的完整引導流程。

### 2a：填寫 principles.md — 你堅持什麼？

AI 會用漸進式提問引導你。以下是一段對話範例：

> **AI：** 你的專案最核心、不可妥協的原則是什麼？可以從任何面向開始。
>
> **你：** 故事優先。所有功能都要為故事服務。如果一個功能很酷但跟故事無關，我不要。
>
> **AI：** 很好。技術上有什麼堅持嗎？
>
> **你：** 要能在瀏覽器上直接跑，不想裝什麼專業遊戲引擎。用 TypeScript 開發。而且我是一個人做，架構要盡量簡單，不要過度設計。
>
> **AI：** 遊戲體驗上呢？有什麼底線？
>
> **你：** 玩家的每個選擇都應該有意義。對話選項不是裝飾，要真的影響後面的劇情。還有，世界觀要自洽 —— 不能為了好玩就打破自己設定的規則。

AI 會把你的回答整理成結構化的 `principles.md`：

```markdown
# 原則

## 核心理念
- 故事優先：每個功能都必須為故事服務。
  如果一個功能無法強化敘事，那它就不該存在。

## 技術原則
- 瀏覽器原生：使用 TypeScript，不用大型遊戲引擎
- 一人開發的簡潔性：不過度設計，保持扁平、易讀的架構
- 最少依賴 — 每引入一個套件都必須有充分理由

## 設計原則
- 有意義的選擇：玩家的對話和行動會真正影響世界
- 世界觀自洽：設定的一致性不可妥協，
  絕不為了方便而打破自己建立的規則
```

> **（此處放截圖：principles.md 填寫完的樣子）**

### 2b：填寫 vision.md — 你要去哪？

接下來 AI 會問你關於方向和路線的問題：

> **AI：** 這個專案你想做到什麼程度？
>
> **你：** 三個月做出一個能玩的 demo。就是一段完整的序章體驗 —— 主角醒來、探索一個場景、遇到一個角色、做幾個選擇、結束。如果反應不錯再繼續做下去。
>
> **AI：** 三個月裡大概怎麼分配？
>
> **你：** 第一個月做基本的場景切換和角色操作。第二個月做對話功能（要能分支）和選擇記錄系統。第三個月把序章的內容做出來，然後測試。

產出的 `vision.md`：

```markdown
# 願景

## 問題描述
我想做一款以故事驅動的瀏覽器遊戲，玩家的選擇要真正有影響 ——
不只是視覺小說，而是一個可以探索的世界。

## 北極星
一段簡短、精緻的體驗，讓玩家記住的是故事和選擇，而不是時數。

## 路線圖

### M1：基礎建設（第一個月）
- [ ] 場景系統：在不同區域之間移動
- [ ] 角色操作與基本互動
- [ ] 暫用美術素材的流程

### M2：核心系統（第二個月）
- [ ] 對話系統，支援分支選擇
- [ ] 世界狀態追蹤（選擇 → 後果）
- [ ] 角色互動框架

### M3：序章 Demo（第三個月）
- [ ] 序章內容：甦醒 → 探索 → 遇見某人 → 結局
- [ ] 序章的美術與音效
- [ ] 測試與打磨

## Demo 成功標準
- 新玩家可以在 15-20 分鐘內完成序章
- 至少有一個選擇明顯改變了後面的結果
- 玩家感覺自己的決定是有意義的
```

> **（此處放截圖：vision.md 填寫完的樣子）**

### 2c：填寫 experience.md — 你踩過什麼坑？

如果你是全新專案，這份文件可能還沒什麼內容。沒關係 —— 先寫你過去已經知道的事：

> **AI：** 你之前有做過類似的東西嗎？有踩過什麼坑？
>
> **你：** 我之前試過做一個小型的網頁遊戲，踩了一個大坑 —— 一開始沒想好怎麼管理不同場景之間的切換，寫到後面整個亂掉。另外，我之前自己從零做了一套對話格式（用 JSON），結果超複雜，做了三天，到處是 bug。後來發現根本有現成的格式可以用。
>
> **你：** 對了，還有一個 —— 有些套件的 TypeScript 型別定義跟它實際的行為會對不上，我之前花了很多時間才發現不是我寫錯，而是套件的型別寫錯。

產出的 `experience.md`：

```markdown
# 經驗

## 場景管理大災難
- **原本以為：** 需要的時候再加新場景就好
- **實際發生：** 沒有明確的場景切換模式，兩週後程式碼變成一團亂
- **解決方式：** 改用集中式場景管理器，有明確的進入/離開流程
- **教訓：** 在寫第一個場景之前就要規劃好場景管理架構，不是等到第五個才想

## 自製對話格式的兔子洞
- **原本以為：** 自己做一套 JSON 格式會更有彈性
- **實際發生：** 花了三天寫解析器，到處是 bug，而且別人也看不懂這個格式
- **解決方式：** 改用社群既有的成熟格式
- **教訓：** 動手之前先查有沒有現成的格式可用。
  「自己做」不代表「更有彈性」—— 而是「更多 bug 加上零文件」

## TypeScript 型別定義不一致
- **原本以為：** npm 套件的 TypeScript 型別應該跟實際行為一致
- **實際發生：** 有些套件的型別定義是錯的或過時的
- **解決方式：** 學會直接看原始碼，而不是只看型別
- **教訓：** 型別編譯不過的時候，先去看 JS 原始碼 ——
  可能是型別寫錯，不是你的 code 寫錯
```

> **（此處放截圖：experience.md 填寫完的樣子）**

---

## Step 3：見證差異 — 有 Knowie vs 沒有 Knowie

知識文件都填好了。現在來看看實際開發時的差異。

### 場景 A：「幫我做對話功能」

**沒有 Knowie 的 AI：**
> 我來幫你寫一個 JSON 格式的對話引擎，用巢狀結構存放每個選項⋯⋯

（你之前踩過這個坑，花了三天做出一堆 bug。但 AI 不知道。）

**有 Knowie 的 AI：**
> 你的 experience.md 記錄過自己做 JSON 對話格式的慘痛教訓。建議直接用社群既有的對話格式。
>
> 考慮到 principles 裡的 minimal dependencies 原則，我建議先找一個輕量的套件，確認它的大小和維護狀態再決定要不要引入。如果都不理想，再考慮自己做一個最小版本。

AI 不只給了建議，還**主動避開了你踩過的坑**。這就是 experience.md 的威力。

### 場景 B：「幫我加一個成就系統」

**沒有 Knowie 的 AI：**
> 好的！我幫你加一個成就系統，包括成就列表、解鎖動畫、進度追蹤⋯⋯

**有 Knowie 的 AI：**
> 在做之前想先確認 —— 你的 principles 說「every feature must serve the story」。成就系統是為了推動故事，還是獨立於故事之外的機制？
>
> 如果是為了故事（比如「探索過所有遺跡碎片」解鎖隱藏劇情），那很合理。如果只是額外的收集要素，可能跟你的核心理念衝突。你想怎麼做？

AI **會反問你**，而不是無腦執行。因為它讀到了你的原則。

### 場景 C：「接下來做什麼比較好？」

**沒有 Knowie 的 AI：**
> 你可以加一個存檔系統、或是多人連線功能⋯⋯（給一堆泛泛的建議）

**有 Knowie 的 AI：**
> 根據你的 vision，M2 還有「世界狀態追蹤」和「角色互動框架」沒做。
>
> 建議先做世界狀態追蹤，因為你的 principles 說「choices affect the world」，而且對話系統做完了，現在正好需要一個地方記錄玩家的選擇。
>
> 你的 experience 提醒我們要先想好架構再動手，所以建議先用一個最小原型確認技術方案。

AI 的建議**有依據**，而不是隨便猜。

> **（此處放截圖：實際在 AI 聊天中的對話，展示 AI 引用 knowledge/ 內容給建議的畫面）**

---

## Step 4：用 /knowie-judge 做健康檢查

開發了一陣子之後，你的知識文件可能開始跟實際狀況脫節。

比如：你最後發現社群的對話套件在瀏覽器上跑不順，還是自己寫了一個輕量版。但你的 experience.md 還寫著「不要自己做對話格式」。

這時候在 Claude Code 裡輸入：

```
/knowie-judge
```

> **（此處放截圖：/knowie-judge 的輸出，顯示各種檢查狀態）**

你會看到類似這樣的輸出：

```
🟢 Principles — 內部一致
🟢 Vision — 路線圖邏輯通順
🟡 Experience — 自洽性有問題

   experience.md 寫著「永遠先找現成格式，不要自己做」，
   但專案裡目前用的是自己寫的對話解析器 (src/dialogue/parser.ts)。

   → 建議：更新 experience.md，記錄為什麼最後還是自己寫了。
     當時現成套件的什麼問題讓你放棄的？把這個寫下來，
     AI 以後才不會一直建議你用那些套件。

🟢 Principles ↔ Vision — 一致
🟡 Experience → Vision

   Vision M2 還寫著對話方案「待定」，
   但你其實已經決定了（自己寫的解析器已經存在）。

   → 建議：更新 vision.md，反映這個決定。

🟢 整體 — 建議執行一個動作：更新 experience.md
   和 vision.md，反映對話系統的決定。

要我幫你修這些問題嗎？
```

**judge 幫你抓出了你自己都忘了更新的矛盾。** 你可以直接請 AI 幫你修。

### 局部檢查

你也可以只查特定面向：

```
/knowie-judge experience           ← 只檢查經驗相關的
/knowie-judge principles vision    ← 只看原則和願景之間
/knowie-judge 剛做完對話功能        ← 這件事影響了什麼？
```

比如輸入 `/knowie-judge 剛做完對話功能`，AI 會分析：

```
對話功能完成後的影響分析：

🟢 Vision M2 「Dialogue system with branching choices」— 可以打勾了
🟡 Experience — 建議新增一則：開發過程中學到了什麼？
   自己寫的輕量版和之前踩坑的那次有什麼不同？
🟢 Principles — 對話功能符合「故事優先」和「最少依賴」
```

---

## Step 5：用 /knowie-next 規劃下一步

對話功能做完了，接下來呢？在 Claude Code 裡輸入：

```
/knowie-next
```

AI 會綜合你的三份文件，給出建議：

```
根據你的 vision，M2 還有一個未完成項目：
- World state tracking（選擇 → 後果）

建議現在做這個，因為：
1. 你的 principles 說「choices affect the world」—— 這是核心承諾
2. 對話系統剛做好，選擇發生在對話裡，現在正好需要記錄它們
3. 你的 experience 提醒我們先想好架構再動手

具體建議：先做一個最小原型 —— 一個對話選擇改變後面場景的某個東西
（例如門開了 / 角色態度不同），確認技術方案可行後再擴展。
```

> **（此處放截圖：/knowie-next 的輸出畫面）**

如果你有裝 SpecKit 等 SDD 工具，`/knowie-next` 還會在最後多一行提示：

```
偵測到你有安裝 SpecKit。
你可以用 /speckit.specify 把這個功能細化成完整的規格文件。
```

這就帶到了下一個步驟。

---

## Step 6：用 SpecKit 把想法變成規格（選配）

> **這一步是選配的。** 如果你不用 SDD 工具，可以直接跳到 Step 7 開始寫 code。但如果你的功能有一定複雜度（像「世界狀態追蹤」這種需要想清楚資料結構和行為的東西），先寫規格再實作會省很多來回修改的時間。

### Knowie 和 SpecKit 的關係

先釐清一件事 —— Knowie 和 SpecKit 做的是不同層次的事：

```
Knowie（為什麼） → SpecKit（做什麼） → Code（怎麼做）
```

- **Knowie** 管的是你的原則、方向、經驗 —— 「為什麼做這個」「為什麼用這個方式」
- **SpecKit** 管的是具體的規格 —— 「這個功能的行為是什麼」「輸入輸出長什麼樣」

沒有 Knowie 的 SpecKit，規格是在真空中寫的 —— 每份 spec 各寫各的，沒有共同的原則串起來。沒有 SpecKit 的 Knowie，你知道為什麼做，但從想法到實作之間缺少一個把需求釐清的步驟。

兩者搭配，AI 在寫規格的時候就會參考你的知識文件，確保規格跟你的原則一致。

### 安裝 SpecKit

依 [SpecKit 官方說明](https://github.com/github/spec-kit) 安裝它，並先在 AI 裡跑一次 `/speckit.constitution` 建立它的憲章（constitution）文件——這是 SpecKit 自己的第一步。

接著再跑一次 Knowie 的更新，讓它偵測到新裝的工具並注入引用：

```bash
npx knowie update
```

Knowie 會在 SpecKit 的 `.specify/memory/constitution.md`（剛才 `/speckit.constitution` 建立的那份）裡注入你的 `knowledge/` 引用。這樣 SpecKit 在寫規格的時候，就能讀到你的原則、願景和經驗。

> **順序提醒：** SpecKit 的 constitution 要先存在，Knowie 才注入得進去。所以是「裝 SpecKit → `/speckit.constitution` → `npx knowie update`」。

### 實際操作：把「世界狀態追蹤」變成規格

在 Claude Code 裡輸入：

```
/speckit.specify
```

SpecKit 會引導你細化剛才 `/knowie-next` 規劃的功能。因為它能讀到你的知識文件，對話會很不一樣：

> **AI：** 根據你的 knowledge/principles.md，玩家的選擇必須真正影響世界。你希望世界狀態追蹤系統記錄哪些類型的變化？
>
> **你：** 主要是對話選擇的結果。比如玩家對某個角色說了不友善的話，後面再遇到那個角色時態度會不同。
>
> **AI：** 了解。根據你的 experience.md「先想好架構再動手」的教訓，我建議先定義清楚狀態的資料結構。我來幫你寫 spec⋯⋯

最後 SpecKit 會產出一份規格文件，包含這個功能的行為定義、邊界條件、測試案例。AI 在實作的時候就會照著這份 spec 來寫，而不是自己猜。

> **（此處放截圖：SpecKit 產出的規格文件）**

### 完整的流程串起來

```
/knowie-next         → 決定做什麼（基於原則、願景、經驗）
    ↓
/speckit.specify     → 細化成規格（讀取 knowledge/ 確保一致）
    ↓
AI 實作              → 照規格寫 code（同時參考 knowledge/）
    ↓
/knowie-judge        → 確認知識文件是否需要更新
```

每一步 AI 都能讀到你的知識文件。從規劃、到規格、到實作、到檢查，整條鏈是連貫的。

---

## Step 7：開發循環 — knowledge/ 是活的

到這裡你已經體驗了完整的流程。日常開發中，你的循環會長這樣：

```
    ┌──────────────────────────────────────────────┐
    │                                              │
    ▼                                              │
  /knowie-next（規劃下一步）                        │
    │                                              │
    ├── 需要細化？→ /speckit.specify（寫規格）      │
    │                                              │
    ▼                                              │
  寫 code（AI 參考 knowledge/ + spec 給準確建議）   │
    │                                              │
    ├── 踩坑了？→ 更新 experience.md ──────────────┤
    │                                              │
    ├── 方向變了？→ 更新 vision.md ────────────────┤
    │                                              │
    └── 想確認一致性？→ /knowie-judge ─────────────┘
```

**knowledge/ 不是寫一次就丟的文件。它是跟著你的專案一起成長的活文件。**

序章的結局改了三次？記在 experience.md。
決定從像素風改成手繪風？更新 vision.md。
發現「故事優先」其實需要一個更具體的子原則？更新 principles.md。

> 不想自己想「這該記去哪」？**`/knowie-capture`** 會把一段討論／想法**自動分發**到對的地方（原則、願景、經驗、概念、`draft/`…）。當 `draft/` 裡的想法醞釀成熟、你想主動把它固化出去，用 **`/knowie-consolidate`**。

> **這個循環不綁任何工具。** 上面用 SpecKit 當例子，但「一輪工作」可以是任何東西——一份 spec、一次自主 agent loop、或只是 plan mode 想一遍。Knowie 的接法都一樣：**做之前餵「為什麼」進去（`/knowie-next`）、做之後把改了什麼收回來（`/knowie-capture`、`/knowie-judge`）**。它從不自己跑那段工作，只在前後兩端接——所以你換引擎、換工具，知識庫照樣用。

每次更新，你的 AI 就更懂你一點。

---

## 不同 AI 工具的體驗差異

| 功能 | Claude Code | GitHub Copilot | Gemini CLI |
|------|------------|----------------|------------|
| 自動讀 knowledge/ | ✅ 透過 CLAUDE.md | ✅ 透過 copilot-instructions.md | ✅ 透過 GEMINI.md |
| Slash commands (/knowie-judge) | ✅ 原生支援 | ❌ 需手動描述 | ❌ 需手動描述 |
| MCP 支援 | ✅ `npx knowie setup-mcp` | ❌ | ❌ |

**如果你用的是 Copilot 或 Gemini**，沒有 slash commands 也完全沒問題。你只需要在聊天裡直接說你想做什麼：

```
請幫我檢查 knowledge/ 裡的三份文件是否有互相矛盾的地方，
特別是 principles 和 experience 之間。
```

Knowie 安裝時已經把引用注入到對應的設定檔了。AI 會自動讀到 knowledge/ 的內容。Slash commands 只是更方便的捷徑，不是必要條件。

---

## 常見問題

### Q: 我的專案已經開發一半了，現在才加 Knowie 來得及嗎？

當然。Knowie 不碰你的程式碼 —— 它只建立 `knowledge/` 目錄和設定檔引用。而且你不需要一次把三份文件寫完，先寫一份 `principles.md` 就有效果了。

如果專案已經很深、不想從空白頁開始，可以用 `/knowie-migrate`（beta）—— 它會從你的 **git 歷史**把專案的「為什麼」重建出來，順著一個一個 commit 重播。它會提議、你審核，你原本的筆記也會安全保留在 `knowledge.old/`。

### Q: knowledge/ 的文件要 commit 進 git 嗎？

要。讓團隊成員（和未來的你）都能受益。

### Q: 三份文件會不會越寫越長？

建議控制在每份 100-200 行以內。它們是「索引」，不是「百科全書」。反覆出現的母概念放 `concepts/`、決策與否決選項放 `history/`、還沒定案的想法放 `draft/`。核心文件只放精煉的結論。

### Q: 我用的 AI 工具不在支援列表上？

knowledge/ 就是純 Markdown 文件。任何能讀檔案的 AI 工具都可以手動指向它。Knowie 自動偵測涵蓋 25+ 工具，但即使你的沒被涵蓋到，手動加一行引用就好。

### Q: 移除 Knowie 容易嗎？

非常容易。刪掉 `knowledge/` 目錄，然後在 AI 工具的設定檔裡移除被 `<!-- Knowie: Project Knowledge -->` 和 `<!-- /Knowie -->` 包起來的區塊就好。

### Q: 一定要搭配 SpecKit 嗎？

不用。SpecKit 那一步是選配的。Knowie 本身獨立運作，不依賴任何 SDD 工具。但如果你在做比較複雜的功能，先寫規格再實作確實能減少來回修改。Knowie 也支援其他 SDD 工具（OpenSpec、Kiro Specs），不只 SpecKit。

### Q: 這篇用遊戲當例子，但我做的是 Web App / CLI 工具 / API⋯⋯

完全通用。不管你做什麼專案，核心邏輯都一樣 —— 把你的原則、方向、經驗寫下來，讓 AI 讀到。遊戲有世界觀要維持一致，API 有架構原則要維持一致，道理是一樣的。

---

## 結語

這篇教學用一個遊戲開發的案例，帶你走了一遍完整的流程：

1. `npx knowie init` — 一行指令安裝
2. `/knowie-init` — AI 引導你填知識文件
3. 日常開發 — AI 參考你的知識給更準的建議
4. `/knowie-judge` — 自動抓出矛盾和過時的內容
5. `/knowie-next` — 基於知識體系規劃下一步
6. `/speckit.specify` — 把想法細化成規格，再交給 AI 實作（選配）

從「為什麼做」（Knowie）到「做什麼」（SpecKit）到「怎麼做」（Code），整條鏈都有你的知識在背後串著。

重點不是工具本身，而是這件事：**你腦袋裡有很多 AI 不知道的東西。寫下來，它就知道了。**

```bash
npx knowie init
```

一行指令，五分鐘設定。試一次，你會發現 AI 真的變得不一樣。

---

**GitHub:** [github.com/timcsy/knowie](https://github.com/timcsy/knowie)
**授權：** MIT（開源免費）
