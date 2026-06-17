# Knowie

[English](README.md)

**你的 AI 讀得懂程式碼。Knowie 教它讀懂你的想法。**

📖 **[完整實操教學](docs/tutorial.md)** · **[我為什麼開發 Knowie](docs/origin-story.md)** · 🎬 **[影片介紹](https://youtu.be/EYDFtX37CVQ)**

---

## 問題

你的 AI 寫出能跑的程式碼——但做了你不會做的選擇。挑錯套件、打亂結構、建議你上個月試過且失敗的方案。

**它看得到程式碼，但看不到你的推理。**

而且這個問題會隨規模放大。多數 AI 輔助開發的專案大約在 30–50 個功能之後開始漂移：原則被默默放棄、同樣的 bug 重新冒出來、scope 無意識地膨脹。每一個新功能都在「忘記前十個」的狀態下被寫出來。

## 解法

`knowledge/` 目錄裡三份 Markdown 檔案：

```
knowledge/
  principles.md    ← 你相信什麼、為什麼
  vision.md        ← 你要去哪裡、怎麼去
  experience.md    ← 你用血淚學到的事
```

你的 AI 在每次任務前讀取它們。建議從此跟你的專案對齊——不只是程式碼。

## 開始使用

在你的**終端機**中執行：

```bash
npx knowie init
```

搞定。Knowie 建好檔案、偵測你的 AI 工具、全部連結好。

> **想留在 AI 聊天介面？** 請你的 AI 執行這個（它會在終端機幫你跑）：
> ```bash
> npx knowie init --yes
> ```

> **第一次用？** 看 **[完整實操教學](docs/tutorial.md)**，帶你從零把一個專案走一遍。

## 差別在哪

**新手範例**——「加個登入功能」：

> *之前：* AI 生出 OAuth2 + JWT + refresh token，三個服務。
>
> *之後：* AI 讀了原則（「保持簡單——學習專案」）和願景（「單人使用，不需要註冊」），加了簡單的密碼驗證。5 分鐘搞定，不是 5 小時。

**資深範例**——「加快取」：

> *之前：* AI 選 Redis（網路上最熱門）。但你的原則說「核心功能不用外部依賴」，experience.md 記錄了上季快取導致資料過期。
>
> *之後：* AI 選 in-memory 快取、根據教訓加了 TTL、連結到 `knowledge/history/` 裡的決策脈絡。

## 實戰驗證

**一個人。一個專案。200+ 個功能。依然一致。**

而且 Knowie 自己就是用 Knowie 開發的——它的推理活在它自己的 `knowledge/` 裡。（還很早，0.x 版：日常的「三份檔 + `/knowie-judge`」這套已經穩；像 `/knowie-migrate` 這種較新的還是 beta。）

這就是 Knowie 為之設計的標準。不管你是從零開始、還是已經做到第 40 個功能才在想「為什麼 AI 一直推薦我早就拒絕過的方案」——都是為這種場景而生。

## Knowie 的定位

現在的 AI 開發工具，大多在做**記憶**或**自動化**。Knowie 補上它們漏掉的那一塊——而且能跟它們並用。

| 現在很紅的 | 它做什麼 | 它漏掉的 |
|---|---|---|
| **AI 記憶**（mem0、Letta、ChatGPT memory） | 記得**說過什麼**——自動收集、鎖在單一廠商裡 | 「為什麼」——而且常常難以查核 |
| **LLM Wiki／知識庫** | 整理你程式碼裡**已知什麼** | 一根脊椎：這專案到底**為了什麼** |
| **自主 agent／「loop」**（邊睡邊跑那種） | 朝著 goal **把事做掉** | 它有沒有走偏——以及跨次執行的記憶 |
| **規格工具**（SpecKit、OpenSpec、Kiro） | 把**每個功能**釘清楚 | 貫穿所有功能的那條線 |

**Knowie 握的是「為什麼」**——那條決定「哪段記憶重要、專案為了什麼、工作還在不在軌道上」的推理。

三點讓它不一樣：

- **它是你的，而且到哪都能用。** Knowie 就是你 git repo 裡的 Markdown——不是一個要你登入的服務。所以它能搭配每一種 AI 工具和廠商，連那些彼此看不到對方的也行。
- **它在底下托著，不擋路。** 你的記憶工具、wiki、agent loop 都留著——Knowie 是它們底下的「為什麼」層，不是來取代。（最接近的工具「ADR for AI」把決策連到程式碼，但很扁平——沒有願景、沒有教訓、沒有健康檢查。）
- **它包住你「怎麼工作」，不管你用什麼。** 不管一輪工作長什麼樣——一份 spec、一次自主 agent 跑、還是只是想一遍 plan——Knowie 都用同一種方式接：前面餵「為什麼」進去，後面把學到的收回來。它從不自己跑那段工作，所以**不綁任何工具或工作流**。換掉你的引擎，你的「為什麼」原封不動。

**你自己寫的，所以信得過。** 每一行都是你刻意放的，不是自動抓來的雜訊——而 `/knowie-judge` 會幫你看它有沒有走樣。黑箱記憶工具做不到這件事。

可以混搭：用搜尋工具找程式碼、用記憶工具記個人歷史、用 Knowie 管策展過的「為什麼」。各司其職。

**Knowie 不適合的時候：**
- 你需要從對話中自動萃取事實 → 用 memory 系統
- 你的專案邏輯一個檔案裝得下 → 一份 `CLAUDE.md` 就夠了
- 你對專案還沒有強烈的主張 → 等你有了再回來

## 加到既有專案

Knowie 可以安全地加到任何專案：

- **不動你的程式碼**——只建立 `knowledge/` 和在 AI 工具設定中注入引用
- **不會弄壞任何東西**——引用使用 HTML 註解標記，隨時可移除
- **不需要重寫**——從空檔案開始，慢慢填
- **跟既有文件共存**——`knowledge/` 是 README、wiki、ADR 的補充，不是取代

先從 `principles.md` 開始就好。你的 AI 從第一份填好的檔案就開始受益。

**已經做很深了？** `/knowie-migrate` 能直接從你的 git 歷史把「為什麼」重建出來——順著一個一個 commit 重播，讓你不用對著空白頁發愁。它還新（beta）：它提議、你審核，而你原本的筆記會安全保留在 `knowledge.old/`。

## 運作方式

| 檔案 | 回答的問題 | 更新頻率 |
|------|-----------|----------|
| `principles.md` | 什麼規則引導我們？ | 很少 |
| `vision.md` | 我們要往哪走？ | 里程碑後 |
| `experience.md` | 我們學到了什麼？ | 意外發生後 |

模板包含引導註解——不用對著空白頁發愁。

五個子目錄存放其餘內容：

| 目錄 | 放什麼 |
|------|--------|
| `concepts/` | 反覆出現的母概念——三份檔只放指針，細節在這（語意記憶）|
| `episodes/` | 值得回憶的完整現場（教訓或決策背後的情節記憶）|
| `skills/` | 學到的領域 skill——反覆工作蒸餾成可重用能力（程序記憶／小腦）；投影到你 AI 工具的 skill 目錄 |
| `history/` | 因果軌跡——為什麼變成現在這樣（決策、被否決的選項）|
| `draft/` | 短期記憶——還沒定案、正在醞釀的想法 |

三份檔案是*介面*，子目錄放細節。先從三份開始，其餘隨時間長出來。

## Skills

以下指令在你的 **AI 聊天介面**中使用（不是終端機）。支援 skill 的 AI 工具（如 Claude Code）：

| Skill | 做什麼 |
|-------|--------|
| `/knowie-init` | 引導式對話，幫你起草知識文件 |
| `/knowie-capture` | 把一段討論／想法統整進對的地方 |
| `/knowie-consolidate` | 人主動把成熟的 draft 固化到長期層 |
| `/knowie-next` | 以原則、願景、經驗為根基，規劃下一步 |
| `/knowie-judge` | 健康檢查：連貫性、對齊程式碼、偵測腐爛——然後整理 |
| `/knowie-migrate` | 要在已經有歷史的專案上採用 Knowie？從你的 git 紀錄重建出「為什麼」（beta）|

`/knowie-judge` 是核心回饋循環。它會抓到願景和經驗矛盾、原則和程式碼不符、或文件已經過時的問題。結果：🟢 健康、🟡 值得注意、🔴 需要處理——附具體引用和建議。

## 跟規格工具搭配

規格工具（SpecKit、OpenSpec、Kiro Specs）讓每個功能都有嚴謹的契約。但規格是**每個功能各寫一份**——放任不管會碎片化。第 1 份規格強調效能，第 20 份規格悄悄沒有，因為它被寫的時候根本看不到第 1 份。

Knowie 在你的規格工具**底下**，不是跟它串在 pipeline 裡：

```
           ┌── 規格 1
           ├── 規格 2
  knowie ──┼── 規格 3  ──→ code
           ├── ...
           └── 規格 N
```

每份規格都共享同一套原則、願景、教訓。`/knowie-next` 會偵測已安裝的規格工具並自然接手——Knowie 提供*為什麼*，規格工具提供*做什麼*，AI 處理*怎麼做*。

規格只是「一輪工作」的一個例子。同樣的包法也適用於自主 agent loop、或單純的 plan mode：Knowie 前面餵「為什麼」、後面收回改了什麼。這不是規格工具專屬的功能——這是 Knowie 接上**任何**工作流的方式。

## 完整流程（從頭到尾怎麼跑）

**設定（一次）：**

1. 裝好環境 —— Node、你的 AI 工具，以及（選配）一個 spec 工具。*（作者的一鍵捷徑：[`npx prespec`](https://www.npmjs.com/package/prespec)；或各自手動裝。）*
2. *（選配 —— 只有用 SDD 才需要）* `specify init . --ai claude --ai-skills`，然後在 AI 裡跑 `/speckit.constitution`（例如 *「使用 TDD。請用繁體中文撰寫規格文件與回答」*）。
3. 把 `npx knowie init --yes` 直接貼進 AI CLI 聊天視窗（它會幫你在終端機跑、免互動），再 `/knowie-init` 把知識填進去。*（已經有歷史的舊專案？`/knowie-migrate` 從 git 重建「為什麼」—— beta。）*

**每一輪（重複）：**

```
/knowie-next   → 規劃這一輪（基於原則／願景／經驗）
   ↓
做一輪          → SpecKit（specify → plan → tasks → implement）、一個 agent loop、或就只是 plan mode
   ↓
/knowie-judge  → 對齊知識庫 + 健康檢查
   ↓
有新想法？聊一聊，然後 /knowie-capture → draft    ·    draft 太多？/knowie-consolidate
   ↓
回到 /knowie-next
```

沒有新想法時，就是 next → 做一輪 → judge → next → 做一輪 → judge…… Knowie 不在意你用哪個引擎跑那一輪——它只在前後兩端接。

完整一步步的版本在 **[實操教學](docs/tutorial.md)**。

## 支援的工具

**25+ 種 AI 工具**自動連結：Claude Code、Cursor、Windsurf、GitHub Copilot、Codex、Gemini、Kiro、Amazon Q、Cline、Roo Code、Kilo Code、Aider、Continue、Augment、Amp、Devin、Warp、Zed、OpenCode、Qodo、JetBrains AI、Tabnine、Replit、Bolt.new

**標準：** AGENTS.md（60k+ repos 採用）

`knowie init` 偵測你有什麼，自動注入引用。不用手動設定。

<details>
<summary>MCP Server（進階）</summary>

支援 MCP 的 AI 工具：

```bash
npx knowie setup-mcp
```

或手動設定：
```json
{
  "mcpServers": {
    "knowie": {
      "command": "npx",
      "args": ["-y", "knowie", "--", "knowie-mcp"]
    }
  }
}
```
</details>

## 更新

當 Knowie 有新版本時，在你的**終端機**執行：

```bash
npx knowie update
```

這會把 skills 和模板更新到最新版。**你的知識文件永遠不會被修改**——只有受管理的檔案（skills、模板）會更新。也會偵測你之後新增的 AI 工具。

> 重新跑 `npx knowie init` 也是安全的——效果一樣，會跳過已存在的檔案。

如果版本之間**結構本身**有變動，`npx knowie update` 一樣不會碰你的檔案——它會**明確警告**結構落後，你在 AI 裡執行 `/knowie-migrate` 來遷移，每一步都提議讓你確認。Breaking 變更會被攤開，絕不靜默套用。

## 設計

- **純 Markdown**——沒有專屬格式，不鎖定
- **人工撰寫**——每一行都可審計，不是自動萃取的雜訊
- **無 npm 依賴**——只用 Node.js 內建模組
- **工具與工作流都無關**——任何能讀檔案的 AI 工具都能用，也包得住任何工作方式（spec、agent loop、或 plan mode）
- **漸進式**——先從三份檔案開始，準備好了再加 skills / MCP / 子目錄

## 為什麼是三份檔案？

每個決定有三個面向：什麼是*正確的*（原則）、你在*建造什麼*（願景）、你身處什麼*處境*（經驗）。少了一個：

- 有原則沒願景 → 僵硬的規則，什麼都做不出來
- 有願景沒經驗 → 重蹈覆轍的計畫
- 有經驗沒原則 → 教訓一堆，不知道怎麼用

`/knowie-judge` 保持對齊。`/knowie-next` 用三者規劃下一步。

<details>
<summary>理論</summary>

對應型別論中的判斷（Γ ⊢ t : A）和認識論中的[三視角主義](https://en.wikipedia.org/wiki/Triperspectivalism)。三個互相依存、不可化約的視角。

</details>

## 授權

MIT
