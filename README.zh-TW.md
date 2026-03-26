# Knowie

[English](README.md)

**給你的 AI 一個結構化的專案大腦。**

你的 AI 助手看得到你的程式碼——但它理解你*為什麼*這樣設計嗎？哪些原則是你不會妥協的？哪些你已經試過、從中學到教訓了？

Knowie 為你的專案建立三份結構化的知識文件，讓任何 AI 工具都能讀取，把散落的脈絡變成共享的理解。

## 快速開始

### 在終端機

```bash
npx knowie init
```

互動模式——選擇語言和要連結的 AI 工具。

### 從 AI 工具

讓你的 AI 執行：

```bash
npx knowie init --yes
```

全自動——偵測語言、找到你的 AI 工具、完成所有設定，零互動。當 stdin 不是終端機時（pipe、CI 等）也會自動啟用。

### 接著，在你的 AI 工具中

如果你使用的 AI 工具支援 skill（例如 Claude Code），可以執行：

```
/knowie init
```

這會啟動一段互動式對話，幫助你填寫知識文件。

## 建立的結構

```
knowledge/
  principles.md         ← 核心信念和規則（很少變動）
  vision.md             ← 目標、架構、路線圖（持續演進）
  experience.md         ← 蒸餾出的教訓（逐漸成長）
  research/             ← 探索性筆記 → 可能成為原則
  design/               ← 詳細設計 → 反映到願景
  history/              ← 事件記錄 → 蒸餾成經驗
  .templates/           ← 參考模板（由 Knowie 管理）
  .knowie.json          ← Knowie 設定（版本、語言、工具）
```

## 運作方式

每個專案都有活在人們腦中的知識——為什麼做出某些決定、什麼曾經失敗、接下來要往哪裡走。Knowie 把這些知識變得明確且結構化：

- **原則（Principles）** 回答「什麼規則引導我們？」——你不可妥協的信念，以及從中推導出的規則。
- **願景（Vision）** 回答「我們要往哪裡走？」——要解決的問題、現狀和路線圖。
- **經驗（Experience）** 回答「我們學到了什麼？」——開發中的模式，特別是預期和現實有落差的地方。

你的 AI 工具會自動讀取這些文件，讓它的建議能符合專案的實際脈絡——而不只是程式碼。

## Skills

Knowie 安裝四個 skill（在 `/knowie` 命名空間下）。目前支援 Claude Code，更多 AI 工具規劃中：

| Skill | 功能 |
|-------|------|
| `/knowie init` | 互動式對話，建立或填寫知識文件 |
| `/knowie update` | 檢查知識文件結構是否符合最新模板 |
| `/knowie judge` | 交叉檢查三份文件的一致性和連貫性 |
| `/knowie next` | 根據原則、願景和經驗規劃下一步 |

### `/knowie judge` — 知識健康檢查

對你的知識文件執行 17 項檢查：

- **自洽性**（3）：推導鏈是否完整？結構是否健全？
- **內部一致**（3）：各文件內部是否有矛盾？
- **交叉引用**（6）：三份文件之間是否一致？檢查所有六個方向（例如「經驗是否支持願景？」和「願景是否回應了經驗的發現？」是不同的問題）
- **專案對齊**（3）：文件是否與專案實際狀態一致（程式碼、依賴、git 歷史）？
- **總體**（1）：綜合歸納——應該先關注哪裡？
- **超出範圍**（1）：有沒有不屬於這個專案的內容？

結果使用交通燈指示：🟢 健康（一行摘要）、🟡 張力（展開細節）、🔴 衝突（展開並建議行動）。

## 支援的工具

Knowie 偵測並連結 25+ 種 AI 和規格工具：

| 類別 | 工具 |
|------|------|
| **AI 編碼** | Claude Code、Cursor、Windsurf、GitHub Copilot、Codex CLI、Gemini CLI、Kiro、Amazon Q、Cline、Roo Code、Kilo Code、Aider、Continue.dev、Augment Code、Amp、Devin、Warp、Zed、OpenCode、Qodo、JetBrains AI、Tabnine、Replit Agent、Bolt.new |
| **規格工具** | Speckit、OpenSpec、Kiro Specs |
| **標準** | AGENTS.md（跨工具標準） |

`knowie init` 自動偵測你安裝了哪些工具，並注入指向 `knowledge/` 的引用。`knowie update` 會補上之後新增的工具。

## MCP Server

Knowie 也可以作為 MCP（Model Context Protocol）server 運作，讓你的 AI 工具直接使用 Knowie 的功能：

```bash
npx knowie setup-mcp
```

這會為你的 AI 工具（Claude Code、Claude Desktop、Cursor 等）設定 MCP server。設定完成後，你的 AI 可以直接呼叫 `knowie_init`、`knowie_update`、`knowie_judge` 和 `knowie_next`。

也可以手動設定。在你的 AI 工具的 MCP 設定中加入：

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

## 更新

當 Knowie 發布新版本（改進的 skills 或模板）：

```bash
npx knowie update
```

或讓你的 AI 執行：

```bash
npx knowie update --yes
```

這會更新 skills 和模板（受管理的文件），不會動到你的知識文件。它也會偵測你在上次執行後新增的 AI 工具。

## 設計原則

- **工具無關**：`knowledge/` 是純 Markdown——任何工具都能用，或不用工具也行。
- **零依賴**：不需要 runtime，不需要 server。三份 Markdown 文件和幾個 skills。
- **不鎖定**：Knowie 不擁有你的工作流程。它連結到你現有的工具，而不是反過來。
- **漸進採用**：只用文件，或加上 skills，或兩者都用。
- **AI 友善**：`--yes` 旗標支援全自動操作——你的 AI 可以直接安裝和更新 Knowie，不需要離開對話。

## 理論基礎（給好奇的人）

三份文件的結構不是隨意的。它對應到 *判斷（judgment）* 的結構——知識的最小單位：

- **原則** = 什麼是正確的（規範）
- **願景** = 正在建造什麼（構造）
- **經驗** = 我們所處的脈絡（處境）

這三個視角不可分割——每一個都只有在與另外兩個的關係中才有意義。`/knowie judge` 驗證它們是否仍然對齊，`/knowie next` 利用三者來規劃連貫的下一步。

這個框架源自[三視角主義（triperspectivalism）](https://en.wikipedia.org/wiki/Triperspectivalism)和型別論中的判斷（Γ ⊢ t : A）。如果你有興趣，Knowie 設計背後的研究文件在專案的 `knowledge/research/` 目錄中。

## 授權

MIT
