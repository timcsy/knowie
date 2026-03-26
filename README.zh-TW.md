# Knowie

[English](README.md)

**你的 AI 讀得懂程式碼。Knowie 教它讀懂你的想法。**

---

## 問題

你請 AI 加一個功能。它寫出能跑的程式碼——但做了你不會做的選擇。

可能它挑了一個複雜的套件，而你的專案重視簡潔。可能它重新整理了檔案結構，違反了你們團隊的慣例。或者它建議的方案，正好是你上個月試過而且失敗的那個。

**你的 AI 不知道你知道的事。** 它看得到你的程式碼，但看不到你的推理、計畫、或踩過的坑。

## 解法

三份檔案。就這樣。

```
knowledge/
  principles.md    ← 你相信什麼、為什麼
  vision.md        ← 你要去哪裡、怎麼去
  experience.md    ← 你用血淚學到的事
```

你的 AI 在每次任務前讀取它們。現在它的建議會跟你的專案對齊——不只是程式碼。

## 30 秒開始

```bash
npx knowie init
```

完成。Knowie 建好檔案、偵測你的 AI 工具（支援 25+ 種）、全部連結好。

> 用 AI 工具？它可以幫你做：`npx knowie init --yes`

## 差別在哪

**範例 1——新手在做個人專案：**

*之前：* 「加個登入功能」→ AI 生出完整的 OAuth2 + JWT + refresh token 系統，三個服務。

*之後：* AI 讀了 `principles.md`（「保持簡單——這是學習專案」）和 `vision.md`（「單人使用，不需要註冊」），加了一個簡單的密碼驗證。5 分鐘搞定，不是 5 小時。

**範例 2——資深工程師在團隊專案：**

*之前：* 「加快取」→ AI 選了 Redis，因為網路上最多人推薦。但你的原則說「核心功能不用外部依賴」，而且 `experience.md` 記錄了上季類似的快取層造成資料過期的問題。

*之後：* AI 讀了三份檔案。選了 in-memory 快取、根據資料過期的教訓加了 TTL、並連結到 `knowledge/design/` 裡的相關設計文件。

## 運作方式

| 檔案 | 回答的問題 | 更新頻率 |
|------|-----------|----------|
| `principles.md` | 什麼規則引導我們？ | 很少 |
| `vision.md` | 我們要往哪走？ | 里程碑後 |
| `experience.md` | 我們學到了什麼？ | 意外發生後 |

每份檔案都有引導註解幫你開始——不用對著空白頁發愁。

三個子目錄存放詳細內容：

| 目錄 | 放什麼 | 蒸餾到 |
|------|--------|--------|
| `research/` | 探索、實驗 | → principles.md |
| `design/` | 架構決策 | → vision.md |
| `history/` | 事件記錄 | → experience.md |

把三份檔案想成*摘要*，子目錄是*佐證*。先從摘要開始，細節隨時間長出來。

## Skills

如果你的 AI 工具支援 skill（如 Claude Code），Knowie 提供四個指令：

| Skill | 做什麼 |
|-------|--------|
| `/knowie init` | 引導式對話，問你問題、幫你起草知識文件 |
| `/knowie update` | 檢查文件結構，隨專案演進建議改進 |
| `/knowie judge` | 健康檢查：你的文件是否一致？是否跟實際程式碼對齊？ |
| `/knowie next` | 規劃下一步，以原則為根基、以經驗為指引 |

### `/knowie judge` — 核心循環

完成一個功能後，跑 `/knowie judge`。它檢查 17 項：

- 三份檔案各自內部是否一致？（沒有自相矛盾）
- 彼此之間是否一致？（例如：願景是否符合經驗的教訓？）
- 跟你的實際專案對齊嗎？（例如：路線圖說「階段 1 完成」，是真的完成了嗎？）

結果：🟢 健康、🟡 值得注意、🔴 需要處理——附具體引用和行動建議。

## 「我已經在用 Speckit / OpenSpec / Kiro Specs 了，還需要這個嗎？」

需要。它們做的事不一樣。

**規格工具**回答*做什麼*：需求、設計、任務拆解。它們很擅長把想法變成具體計畫。

**Knowie** 回答*為什麼這樣做*：你的原則、路線圖脈絡、以及應該影響每個決策的教訓。

沒有 Knowie，你的規格工具不知道你的專案避免外部依賴、不知道階段 2 依賴階段 1、不知道類似功能上季失敗過。它在真空中產出規格。

有了 Knowie，你的規格工具繼承了脈絡。Knowie 還會偵測專案裡的規格工具並建議接手——例如 `/knowie next` 收斂出一個功能後，如果裝了 Speckit，它會建議你跑 `/speckit-specify`。

```
Knowie（為什麼）→  規格工具（做什麼） →  程式碼（怎麼做）
  原則                需求                  實作
  願景                設計                  測試
  經驗                任務拆解              部署
```

它們是互補的層次。Knowie 給脈絡，規格工具給結構，你寫程式碼。

## 支援你的工具

Knowie 自動連結 **25+ 種 AI 工具和規格工具**：

**AI 工具：** Claude Code、Cursor、Windsurf、GitHub Copilot、Codex、Gemini、Kiro、Amazon Q、Cline、Roo Code、Kilo Code、Aider、Continue、Augment、Amp、Devin、Warp、Zed、OpenCode、Qodo、JetBrains AI、Tabnine、Replit、Bolt.new

**規格工具：** Speckit、OpenSpec、Kiro Specs

**標準：** AGENTS.md（跨工具標準，60k+ repos 採用）

`knowie init` 偵測你有什麼，自動注入 `knowledge/` 的引用。不用手動設定。

## MCP Server

支援 MCP（Model Context Protocol）的 AI 工具：

```bash
npx knowie setup-mcp
```

讓你的 AI 直接使用 `knowie_init`、`knowie_update`、`knowie_judge` 和 `knowie_next`。

<details>
<summary>手動 MCP 設定</summary>

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

```bash
npx knowie update
```

更新 skills 和模板，不動知識文件。自動偵測新增的 AI 工具。加 `--yes` 全自動。

## 設計原則

- **純 Markdown** —— `knowledge/` 跟任何工具都能搭配，沒有專屬格式，不鎖定。
- **無 npm 依賴** —— 只用 Node.js 內建模組，安裝秒完成。
- **AI 原生** —— `--yes` 旗標零互動。你的 AI 可以直接安裝和更新 Knowie。
- **漸進式** —— 先從三份檔案開始。準備好了再加 skills、MCP 或子目錄。

## 為什麼是三份檔案？

你做的每個決定都有三個面向：什麼是*正確的*（原則）、你在*建造什麼*（願景）、你身處什麼*處境*（經驗）。少了一個就會：

- 有原則沒願景 → 僵硬的規則，什麼都做不出來
- 有願景沒經驗 → 重蹈覆轍的計畫
- 有經驗沒原則 → 教訓一堆，卻不知道怎麼用

Knowie 讓三者保持同步。`/knowie judge` 檢查對齊。`/knowie next` 利用三者規劃下一步。

<details>
<summary>給對理論有興趣的人</summary>

這個結構對應到型別論中 *判斷（judgment）* 的結構（Γ ⊢ t : A），以及認識論中的[三視角主義（triperspectivalism）](https://en.wikipedia.org/wiki/Triperspectivalism)。三個視角互相依存、不可化約——每一個都只有在與另外兩個的關係中才有意義。
</details>

## 授權

MIT
