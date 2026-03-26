# Knowie

[English](README.md)

**你的 AI 讀得懂程式碼。Knowie 教它讀懂你的想法。**

---

## 問題

你的 AI 寫出能跑的程式碼——但做了你不會做的選擇。挑錯套件、打亂結構、建議你上個月試過且失敗的方案。

**它看得到程式碼，但看不到你的推理。**

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

*之前：* AI 生出 OAuth2 + JWT + refresh token，三個服務。
*之後：* AI 讀了原則（「保持簡單——學習專案」）和願景（「單人使用，不需要註冊」），加了簡單的密碼驗證。5 分鐘搞定，不是 5 小時。

**資深範例**——「加快取」：

*之前：* AI 選 Redis（網路上最熱門）。但你的原則說「核心功能不用外部依賴」，experience.md 記錄了上季快取導致資料過期。
*之後：* AI 選 in-memory 快取、根據教訓加了 TTL、連結到 `knowledge/design/` 裡的設計文件。

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

三個子目錄存放詳細內容：

| 目錄 | 放什麼 | 蒸餾到 |
|------|--------|--------|
| `research/` | 探索、實驗 | → principles.md |
| `design/` | 架構決策 | → vision.md |
| `history/` | 事件記錄 | → experience.md |

三份檔案是*摘要*，子目錄是*佐證*。先從摘要開始，細節隨時間長出來。

## Skills

以下指令在你的 **AI 聊天介面**中使用（不是終端機）。支援 skill 的 AI 工具（如 Claude Code）：

| Skill | 做什麼 |
|-------|--------|
| `/knowie init` | 引導式對話，幫你起草知識文件 |
| `/knowie update` | 檢查結構，建議改進 |
| `/knowie judge` | 17 項健康檢查：一致性、連貫性、程式碼對齊 |
| `/knowie next` | 以原則為根基、以經驗為指引，規劃下一步 |

`/knowie judge` 是核心回饋循環。它會抓到願景和經驗矛盾、原則和程式碼不符、或文件已經過時的問題。結果：🟢 健康、🟡 值得注意、🔴 需要處理——附具體引用和建議。

## 已經在用規格工具？

Knowie 和規格工具互補：

```
Knowie（為什麼）→  規格工具（做什麼） →  程式碼（怎麼做）
```

規格工具產出需求和設計。Knowie 給它脈絡——你的原則、路線圖和教訓。沒有 Knowie，規格在真空中產出。

`/knowie next` 完成後會偵測已安裝的規格工具（Speckit、OpenSpec、Kiro Specs）並建議接手。

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
- **無 npm 依賴**——只用 Node.js 內建模組
- **AI 原生**——`--yes` 零互動操作
- **漸進式**——先從三份檔案開始，準備好了再加 skills / MCP / 子目錄

## 為什麼是三份檔案？

每個決定有三個面向：什麼是*正確的*（原則）、你在*建造什麼*（願景）、你身處什麼*處境*（經驗）。少了一個：

- 有原則沒願景 → 僵硬的規則，什麼都做不出來
- 有願景沒經驗 → 重蹈覆轍的計畫
- 有經驗沒原則 → 教訓一堆，不知道怎麼用

`/knowie judge` 保持對齊。`/knowie next` 用三者規劃下一步。

<details>
<summary>理論</summary>

對應型別論中的判斷（Γ ⊢ t : A）和認識論中的[三視角主義](https://en.wikipedia.org/wiki/Triperspectivalism)。三個互相依存、不可化約的視角。
</details>

## 授權

MIT
