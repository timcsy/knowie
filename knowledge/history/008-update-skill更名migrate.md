# 008：`knowie-update`（skill）→ `knowie-migrate`

> 2026-06-11。一條命名轉移：skill 改名，行為不變。與 [007](007-crystallize更名consolidate.md) 同一輪 skill 命名複審。

## 轉移
- 舊：`knowie-update`（skill）。
- 新：`knowie-migrate`。skill 行為不變（偵測結構漂移 → 提議 → 人確認遷移）。
- **CLI `knowie update` 不動**——它做的是另一件事（拉最新 skills/templates 機具）。

## 為什麼變
1. **名實不符**：這個 skill 的 description 第一個字就是「Migrate」，正文「This skill is **only** structure migration」。它做的是結構遷移，不是泛泛「更新」。
2. **撞車（關鍵）**：**CLI 有 `knowie update`，做的是完全不同的事**（拉最新機具）。skill 卻也叫 `/knowie-update`（遷移結構）——同名兩件事，使用者分不出。改 `/knowie-migrate` → 名字對上功能 ＋ 跟 CLI 脫鉤。
3. 比 [007](007-crystallize更名consolidate.md) 的隱喻撞車更硬：這是**兩個操作硬撞同一個詞**。

## 被否決/保留的選項
- **保留 CLI `knowie update`**：它名實相符（更新安裝的機具），不動。分工：CLI `update`＝拉機具；skill `/knowie-migrate`＝遷移結構。
- i18n key `cli.update.structureBehind` **保留**（它是 CLI update 命令的訊息），只把訊息內文指向的 skill 名改成 `/knowie-migrate`。

## 旁證：judge 在同輪複審中被「留下」
同一輪也檢視了 judge → 一度想改 `review`，但 origin-story 揭露 **judge 以型別論 Judgment（Γ⊢t:A）命名**（三檔＝Γ/t/A，檢查是否構成合法判斷），作者明言「**它不是在評分**」——`review`（複查/評分）恰是它「不是」的意思。故 **judge 維持不變**（承重的根概念名，非方法名）。見 origin-story.md「數學家的 Judgment」。

## 狀態
✅ 已採用。skill 目錄／`SKILL_NAMES`／SKILL.md／i18n 訊息／commands 註解／README×2／templates×2／dogfood 同步。CLI `update` 命令保留。
