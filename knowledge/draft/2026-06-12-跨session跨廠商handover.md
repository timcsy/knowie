# knowie 當「跨 session / 跨廠商」的 handover 層

> 2026-06-12 設計討論。draft，未定案（多為已實裝、但沒被講清楚的賣點）。
> ✅ **定位已進 vision 核心想法**（2026-06-12 consolidate）：「跨 session／跨廠商的 why 交接層」。**真實 Codex↔Claude 跨廠商交接仍未驗**（見出口），留此。
> 怎麼冒出來的：問「在不同 session 切換、甚至不同廠商 AI（Codex/Claude）交接，knowie 勝任嗎」。
> 這是 [協議非平台](../concepts/協議非平台.md) 最鋒利的一句兌現，但目前只隱含、沒明講成 handover use case。

## 三層 handover（分清楚才不會過度承諾）
| 層 | 內容 | 狀態 |
|---|---|---|
| **1. why 交接** | 新 session/廠商讀同一份 `knowledge/`（markdown + git + `[]()`，零平台、零 resolver）→ 拿到一樣的 why（principles/vision/experience/concepts/episodes/history） | ✅ **完全勝任、無條件可攜**——knowie 命根 |
| **2. 協議交接** | handshake（`init` 把參照注入 CLAUDE.md/AGENTS.md/GEMINI.md/.cursor…）+ skill 是 markdown（任何 AI 讀得懂） | ✅ **已實裝**（registry 接了 Claude Code/Codex/Cursor/Copilot/Gemini/Windsurf/Kiro + AGENTS.md 跨工具標準） |
| **3. 任務交接** | 「我此刻正在做的半成品 + 剛剛的思路」 | ⚠️ **部分，且刻意** |

## 為何第三層有 gap（這是設計，不是缺陷）
knowie **刻意不持久化 context window**（感覺/工作記憶 = runtime，不儲存，見 [記憶系統](../concepts/記憶系統.md)）。所以它**不是 session 逐字稿的交接工具**：
- 要交接任務狀態 → **離場 session 得先 capture 進 `draft/` + commit**。knowie 給機制（capture→draft），但這是個**動作**，不是自動。
- 接手 session 可讀 **git log**（git = 因果基底，見 [往外長](2026-06-05-往外長.md) git 時光機）看上一棒做了什麼——但**沒 commit、還在 context 裡的，沒 capture 就丟了**。

## AGENTS.md = 跨廠商的中立交接點
Codex/Cursor/Copilot/Gemini 共讀 AGENTS.md（Linux Foundation 標準）→ 它是一個**不屬於任何廠商**的 handshake 落點。knowie 注入它一次，多廠商都被促發去查 `knowledge/`。

## 跟 MiMoCode/Letta 的對比（這層的鋒利處）
它們有**跨 session** 記憶，但**鎖在自己平台內、出不了廠商**。knowie **兩個邊界都跨**（session + 廠商）——因為 why 是 markdown+git，不是平台狀態。**一個 session/廠商邊界，對「為共識而記」只是又一個要跨的邊界。** 這是平台型記憶結構上做不到的事（補強 [競品與生存空間](2026-06-06-競品與生存空間.md) 第六方）。

## 交接儀式（實務）
1. **離場**：`capture`/`consolidate` 把工作狀態 flush 進 `draft/` → commit。
2. **接手（任何廠商）**：AGENTS.md → `knowledge/`（why）→ `draft/`（在辦的）→ `git log`（剛發生的）→ 接上。

## 出口
- 大半**已實裝**（第 1、2 層 + registry 多廠商）；要做的只是**把這個 use case 講清楚**（vision 一句定位 + 也許 README 一段「換 AI/換 session 怎麼接」）。
- **未驗**：真的拿 Codex↔Claude 跨廠商交接跑一輪（屬「拿去真實專案測」的延伸維度）。
- 第三層的「離場 capture」要不要做得更順（例如一個 `handover` 動作把 context 摘要進 draft）？——可能是個 skill 候選，但別急（YAGNI，先驗有沒有人真的這樣用）。
