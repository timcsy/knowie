# domain skill 跨工具散佈：knowledge/skills 為源 + 內部 symlink 投影

> 2026-06-12 設計討論。draft，design 型——設計已具體，待建 + 待驗（symlink/Windows/跨廠商沒跑過）。
> 怎麼冒出來的：問「knowie 學出來的 skill 跨不跨廠商」→ 查 code（只裝 `.claude/skills`）→ 研究 2026 best practice → 收斂出這個設計。是 `程序自習得`（vision roadmap）的**跨廠商落地**。

## 2026 best practice（外部鏡子，已是標準）
- **SKILL.md / agentskills.io 是跨工具開放標準**：Claude Code / Codex / Gemini / Copilot / Cursor / Cline / Windsurf / OpenCode 都讀（[agent-skills 開放標準](https://www.agensi.io/learn/agent-skills-open-standard)）。**「skill 跨廠商」在格式層已解決**（修正了「Codex 沒 skill 機制」的舊認知）。
- **AGENTS.md** ＝指令/context 的跨工具標準（Linux Foundation、60k+ repos）。
- **散佈慣例 ＝ 單一真相源 + symlink 進各工具 skill 目錄**（新興中央源 `.agents/skills/`；[Skillshare](https://github.com/runkids/skillshare) 同步 60+ CLI）。

→ knowie **格式已對**（agentskills.io），架構（skill=知識存 `knowledge/skills/` → 投影到 runtime）**正好就是這個 pattern**。只差「散佈的最後一哩」。

## 設計：源在 knowledge/skills，AI 內部投影
```
knowledge/skills/X/SKILL.md          ← 唯一真相（小腦，committed）
   │ per-skill symlink（相對路徑）
   ├──→ .claude/skills/X    （Claude Code）
   ├──→ .agents/skills/X    （Codex/Cursor/Gemini/Copilot/OpenCode 共讀）
   └──→ <偵測到的工具 skillsDir>/X
```

**內部做，不是 CLI**（關鍵，見下「界線」）：投影是 **AI 用自己檔案工具執行的 skill 步驟**，因 symlink **可逆 + gitignore** → 照延伸原則 5「可逆的自動化」**AI 直接做、不需人確認**（人確認的是「skill 要不要固化」那步）。接在兩個既有 skill：
- **consolidate（學到 skill 時）**：固化進 `knowledge/skills/` 後，同動作裡 per-skill symlink 進 `.claude/skills` + `.agents/skills`。
- **judge §5（skills backstop，維護時）**：re-ensure 投影存在、heal 斷掉/缺的——接住「fresh clone 只有源沒投影」「新工具出現」兩 case。冪等：已在就 no-op。

| 情境 | 誰處理（全內部、零 CLI） |
|---|---|
| 學到新 skill | consolidate 固化時順手 symlink |
| fresh clone / 新工具 | judge §5 維護時 re-ensure |

## CLI / 內部的界線
- **CLI 只管「AI 不在場」的工具自舉**：`init`/`update` 從 npm 裝 knowie **自己的** package skill 進 `.claude/skills`。
- **domain skill 投影是「AI 在場後」的事 → 內部做**。否決 `knowie sync`（那是「把在場該做的塞給 CLI」，見 experience）。

## 兩種 skill 分清楚（否則 symlink 會蓋錯）
- **工具 skill**（knowie 自己的 capture/judge…）：npm 裝進 `.claude/skills`，跟工具版本走，**真檔**。
- **domain skill**（學來的）：住 `knowledge/skills/`，**per-skill symlink**（不是整個目錄 symlink，否則蓋掉 package skill）進各工具目錄、並存。

## 工程坑
- **per-skill symlink**（非整目錄）；**源 committed、投影 gitignore**。
- **Windows**：symlink 易失敗 → skill 指令寫「失敗就 copy + 記需 re-sync」，AI 自己判斷退化（仍內部）。
- **冪等**：re-ensure 可重跑、no-op-on-clean（對齊 [收斂](../concepts/收斂.md)）。
- **registry 復活 `skillsDir` 欄位**（每工具一個 skill 目錄；之前砍 installDomainSkills 時說「跨 checkout/泛化才需要 → 真要時再接」，現在就是真要時）——但**給 AI 當投影目標用，不是給 CLI**。

## 配套：handshake 補指 knowledge/skills/
handshake snippet 現在漏指 `skills/`。補上 → 即使某工具沒被 symlink/不支援 SKILL.md，agent 也**知道小腦在那、能讀了照做**（「讀+照做」地板，與 symlink「自動調用」優化獨立，兩個都要）。

## 出口（待建/待驗）
- 待建：consolidate/judge §5 加投影步驟（markdown 指令）；registry `skillsDir`；handshake 補指 `skills/`。
- 待驗：symlink 在真實多工具/Windows 跑過；Codex/Gemini 真的讀到並用到 domain skill。
- 不自造引擎——只接 agentskills.io 標準 + `.agents/skills/` 慣例（[協議非平台](../concepts/協議非平台.md)）。
