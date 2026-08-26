# mattpocock/skills：doing-lane 鄰居，兼 endeavor-independent skill 的上游典型

> 2026-08-26 討論 + 查證（README + skill 清單）。draft，未定案。
> 怎麼冒出來的：使用者問「knowie 和 [mattpocock/skills](https://github.com/mattpocock/skills) 有什麼異同」。查完發現它不是競品——是 knowie 一直畫在圖上、卻沒有具名實例的那個 doing lane。

## 它是什麼（一句）
Matt Pocock（Total TypeScript）的個人 agent skill 集，走 Claude Code plugin ＋ `npx skills add` 兩條分發。明說 **"small, easy to adapt, composable"**，並點名反對 GSD / BMAD / Spec-Kit「owning the process, taking away your control」。

## 定性：**不同軸，互補不是競品**
兩邊治的是不同的熵：

| | mattpocock/skills | knowie |
|---|---|---|
| 治的熵 | **一輪工作之內** | **輪次之間** |
| 時間尺度 | 一次 change（對齊→TDD→review→架構巡檢） | 專案生命週期（第 40 個 feature 還記得第 3 個為何那樣決定） |
| 它是什麼 | 做事的**紀律** | 記 why 的**協議** |
| 跑不跑工作 | 跑（`/implement`、`/tdd`、`/triage`、`/to-tickets`） | 明確不跑 |

他的四大失敗模式（misalignment / verbosity / code quality / architecture decay）全都是**在這一輪裡**發生的；knowie 的問題陳述是「30–50 個 feature 之後開始漂」。**同一個 AI coding 困境的兩半。**

## 同（又一次外部背書）
- **診斷一致**：他的 #1 是 misalignment，＝ knowie 的使命「為共識而記」。用詞不同、病灶同一個。
- **同樣拒絕平台化**：他的「small / hackable / 反對 owning the process」＝ [協議非平台](../concepts/協議非平台.md) 的另一種兌現。兩邊都選「你擁有的檔案」而不是「你登入的服務」。
- 同樣寄生 markdown + git、同樣對標 agentskills.io / `.agents/skills/`、同樣跨 Claude Code / Codex。
- 同樣有「共享語言」的需求：他的 `CONTEXT.md`（domain model / 術語表）≈ knowie 的 `concepts/`。
- 同樣 dogfood（他用 `.agents/adr/` 記自己的決策）。

## 異（真正的差異）

### 1. 他的持久層是**副產品**，knowie 的是**主體**
他確實有持久 why：`CONTEXT.md` + ADR。但那是 `/grill-with-docs` 順手更新出來的——**扁平、無成熟度分層、無代謝、無健康檢查**。這正好落進 vision 早就寫下的那句描述：「最近的真競品是 ADR-for-AI，但它扁平、無三視角／回流／代謝。」

**最明顯的空缺：他沒有 `experience.md` 的對應物。** 有標準（code-review）、有詞彙（CONTEXT.md）、有決策（ADR），**沒有「這條路我們試過、失敗了」**。[三視角](../principles.md) 裡的存在視角在他那套完全缺席。

### 2. 兩邊都在對抗熵，掃的是不同 lane
- `/improve-codebase-architecture` → 掃 **code** 的健康（deepening opportunities）
- `/knowie-judge` → 掃 **knowledge** 的健康（死連結、孤兒率、久懸概念、定案狀態）

一個在 what lane，一個在 why lane。**互不重疊，而且都需要。** 這是 [why沒有oracle](../concepts/why沒有oracle.md) 的乾淨對照：他掃的東西有 oracle（跑得動、測得過），judge 掃的沒有。

### 3. 知識的形狀：按類型 vs 按概念投影
他：`skills/engineering/` vs `skills/productivity/`、一份 CONTEXT.md、一疊 ADR——**按類型分資料夾**。
knowie：三視角 + `concepts/episodes/history/draft` 的成熟度分層 + 代謝。**延伸原則 1「整理是投影，不是分割」的正面反例。** 這是根公理級分歧，不是風格差異。

### 4. 上手成本（knowie 誠實的劣勢）
`npx skills add` 之後 CONTEXT.md 空的也能跑；knowie 要 init、要懂三檔、要學代謝節奏。**多數專案撐不到 feature #40，所以他的取捨在 adoption 上是對的**——他優化採用，knowie 優化長期不崩。反過來他那套到規模就是扁平化崩潰（越來越長的 CONTEXT.md + 沒人回頭讀的 ADR）。這條該記著，別自我安慰。

## 最有價值的一點：他可以直接當 knowie 的 doing lane
vision 的圖一直長這樣，但中間那格只寫「SDD（Spec Kit / Kiro）」。**他是這格的另一個具體實作，而且更輕**：

```
/knowie-next 產 brief
   ↓ 餵進
/grill-with-docs → /to-spec → /to-tickets → /implement → /code-review
   ↓ 收工
/knowie-capture 回流（他的 /handoff 只壓縮對話，不分診到長期層）
```

他的 `CONTEXT.md` 其實該是 knowie `concepts/` 的一個投影。**這是「不擁有 runtime」那個賭注的又一次兌現**——換引擎不用換 why。

## 第二價值：他是 **endeavor-independent skill 的上游典型**
[驗證證據在外部repo](2026-08-14-驗證證據在外部repo.md) 那條 roadmap（`skills/` 分 domain vs endeavor-independent、後者 frontmatter 加 `origin: <repo>@<commit>`、judge §5 掃到就報「上游可能變了」）——**mattpocock/skills 就是那個 origin 要指向的東西的原型**。他甚至已經把「訂閱 vs fork」做成兩條明確分發（plugin ＝ read-only 訂閱、skills.sh ＝ 可改的 copy），正是 origin 欄位要處理的兩種語義。要驗那條設計，這是現成的上游。

## 可偷的三樣
1. **`grilling` 當 model-invoked primitive**：他把「相對盤問人直到設計樹每個分支都解決」抽成可重用原語，被 5 個 user-invoked skill 復用。knowie 的 capture/next 都是 AI 主導蒐集，**缺一個逼出隱含假設的技法**——而延伸原則 2「捕捉，不是發明」正需要這個。
2. **user-invoked / model-invoked 明確二分**，還立了規則：user-invoked 可叫 model-invoked，但不能叫另一個 user-invoked。knowie 六個 skill 這條軸沒標，`next`/`capture` 的觸發邊界其實模糊。
3. **`writing-for-agents` skill**：他把「怎麼寫給 agent 讀的文件」本身做成 skill——那正是 `_core` 蒸餾 ＋ [history/017](../history/017-judge壓縮-判準與論證分居.md)（判準與論證分居）在做的事。值得逐條對照他的判準，看有沒有 knowie 沒想到的。

## 威脅面（小，但別當沒有）
- **mindshare**：他有 newsletter 級的分發（~60k）和官方 marketplace 位置。「agent skills」這個詞被他的品味定義。
- **吸收路徑**：如果他的 `CONTEXT.md` + ADR 長出成熟度分層與代謝，就直接侵門踏戶。但他的哲學（small / composable / 反對 owning the process）**結構上會抗拒**做一個有主張的知識 schema——那正是 knowie 在做的事。這個張力對 knowie 有利，但也是提醒：**knowie 不擁有 process，卻擁有 knowledge 的 schema**，這一半確實落在他批評的射程裡。值得想清楚怎麼講。

## 待答
- knowie 該不該在 README 的「Where Knowie Fits」表加一列「agent skill 集（mattpocock/skills 這類）」？它現在四列（memory / wiki / agent loop / spec 工具）都沒有涵蓋這一類。
- `grilling` 原語要偷到哪裡去——capture 的入口？還是獨立一個 skill？（涉及「何時加 skill」的判準，見 [history/005](../history/005-新增crystallize-skill家族成形.md)）
