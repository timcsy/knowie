# 018：package skill 自舉 — 從單一硬寫目錄，到 `.agents` 為家 + 地板目錄

> 2026-09-12。一條散佈機制的決策轉移，補上 [016](016-跨工具散佈-單一源加枚舉投影.md) 只修了一半的另一半。

## 轉移
- **舊（superseded）**：CLI 把六個 package skill **硬寫**進 `.claude/skills/`（`SKILLS_TARGET` 常數）。`skillDirs` 只服務 AI 投影 domain skill，CLI 自己不讀它。目錄清單由偵測結果決定。
- **新（current）**：`installSkills()` 收 `skillDirs`——**實體**寫進 `SKILLS_HOME`（`.agents/skills/`），其餘每個目錄放 per-skill **相對** symlink 指回家（symlink 失敗才退化成複製）。`getSkillDirs()` 從**地板** `['.agents/skills', '.claude/skills']` 起算，註冊到的工具只會**加**、不會減。

## 為什麼變
1. **016 的修法只修了「AI 在場」那半。** 枚舉來源補了、capture／judge 改成枚舉 `skillDirs` 了，但 CLI 自舉那半仍握著一個寫死的目標。同一個根因有兩個執行者，修一條不等於修好。
2. **現場比症狀嚴重。** 使用者在 Codex 跑 `npx knowie init --yes`：`.agents/skills/` 沒被建（回報的症狀），而六個 skill 全被寫進 `.claude/skills/`——一個那個 base **根本沒註冊**的工具的目錄。Codex 看不到任何 skill，連 `/knowie-init` 都不存在。
3. **`.agents` 當家，不是 `.claude`。** 跨工具中央慣例 vs 單一廠商目錄——讓廠商目錄當中央源與[協議非平台](../concepts/協議非平台.md)相衝。
4. **單一實體，不是兩份複製。** update 只動一份、git diff 不翻倍、任一工具的視圖不可能與另一個漂移（[experience](../experience.md)「重複的知識會獨立漂移」）。與 016 對 domain skill 用的是同一套 per-skill symlink 機制。
5. **地板，不是偵測。** 偵測回答的是「**現在**這裡是哪個工具」，而一個 base 活得比那個答案久——人換 agent 是常態。兩個空目錄近乎零成本；少一個的代價是整套 skill 對下一個 agent 隱形。

## 被否決的選項
- **兩邊都實體複製**（不用 symlink）：最穩，但同一份事實在使用者 repo 裡 committed 兩份、每次 update 的 diff 翻倍。
- **反向指（`.claude` 為家）**：把單一廠商目錄升成中央源，見上面 3。
- **整個目錄 symlink**：016 已否決且理由不變——`.claude/skills/` 也住著使用者自己的 skill，整目錄指過去會吞掉它們。現行實作只動 `SKILL_NAMES` 內的名字。

## 來源
使用者在 Codex 的現場回報（2026-09-12）+ 本次修復（0.7.6）。
