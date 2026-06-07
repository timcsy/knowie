# Knowie

[English](README.md)

**你的 AI 讀得懂程式碼。Knowie 教它讀懂你的想法。**

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

**一個人。一個專案。150+ 個功能。依然一致。**

這就是 Knowie 為之設計的標準。不管你是從零開始、還是已經做到第 40 個功能才在想「為什麼 AI 一直推薦我早就拒絕過的方案」——都是為這種場景而生。

## Knowie 的定位

AI 輔助開發的生態已經長出很多層。Knowie 精準地佔據其中一層：

| 層次 | 管什麼 | 代表 |
|------|--------|------|
| Harness | agent 怎麼跑（retry、驗證、workflow） | Claude Code、agent SDK |
| Context engineering | 這次 query 要餵什麼進 LLM context | RAG、@-mentions、repo grep |
| Memory 系統 | 自動萃取並跨 session 保存的事實 | mem0、Letta、ChatGPT memory |
| 規格工具 | 每個功能的規格契約 | SpecKit、OpenSpec、Kiro Specs |
| **Knowie** | **人工策展、專案級的「為什麼」——跨 session、跨規格、跨工具都不漂移** | — |

**vs 規格工具：** 規格是**每個功能各寫一份**，彼此容易碎片化。Knowie 是所有規格**共享**的底層——讓第 20 份規格仍然遵守第 1 份規格建立的原則。規格工具讓每個功能嚴謹，Knowie 讓整個專案一致。

**vs memory 系統：** memory 系統自動萃取、累積（常帶有你無法審計的雜訊）。Knowie 明確是人工撰寫——每一行都是你能指著說「對，這是我的信念」的內容。`/knowie-judge` 提供的回饋迴路是黑箱 memory 系統做不到的。

**vs context engineering：** context engineering 決定「**現在**要載入什麼」。Knowie 決定「跨**每次** query 都成立的是什麼」。不同的軸。

這些層可以共存。用 RAG 做程式碼檢索、用 memory 系統記個人歷史、用 Knowie 管策展過的「為什麼」。不同層、不同職責。

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

## 運作方式

| 檔案 | 回答的問題 | 更新頻率 |
|------|-----------|----------|
| `principles.md` | 什麼規則引導我們？ | 很少 |
| `vision.md` | 我們要往哪走？ | 里程碑後 |
| `experience.md` | 我們學到了什麼？ | 意外發生後 |

模板包含引導註解——不用對著空白頁發愁。

四個子目錄存放其餘內容：

| 目錄 | 放什麼 |
|------|--------|
| `concepts/` | 反覆出現的母概念——三份檔只放指針，細節在這 |
| `episodes/` | 值得回憶的完整現場（教訓或決策背後的情節記憶）|
| `history/` | 因果軌跡——為什麼變成現在這樣（決策、被否決的選項）|
| `draft/` | 短期記憶——還沒定案、正在醞釀的想法 |

三份檔案是*介面*，子目錄放細節。先從三份開始，其餘隨時間長出來。

## Skills

以下指令在你的 **AI 聊天介面**中使用（不是終端機）。支援 skill 的 AI 工具（如 Claude Code）：

| Skill | 做什麼 |
|-------|--------|
| `/knowie-init` | 引導式對話，幫你起草知識文件 |
| `/knowie-capture` | 把一段討論／想法統整進對的地方 |
| `/knowie-crystallize` | 人主動把成熟的 draft 結晶到長期層 |
| `/knowie-next` | 以原則、願景、經驗為根基，規劃下一步 |
| `/knowie-judge` | 健康檢查：連貫性、對齊程式碼、偵測腐爛——然後整理 |
| `/knowie-update` | 結構版本升級時遷移知識庫 |

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

## 設計

- **純 Markdown**——沒有專屬格式，不鎖定
- **人工撰寫**——每一行都可審計，不是自動萃取的雜訊
- **無 npm 依賴**——只用 Node.js 內建模組
- **工具無關**——任何能讀檔案的 AI 工具都能用
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
