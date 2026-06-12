# knowie × harness / loop engineering / goal / workflow：慢 grounding 層

> 2026-06-12 研究 + 討論。draft，未定案（定位型）。
> 怎麼冒出來的：問「knowie 搭配最紅的 Harness、Loop Engineering、goal、workflow 效果如何」。比 SDD 那塊更貼當下熱點。

## 2026 當前定義（對齊用）
- **Harness engineering**（早 2026，Hashimoto/OpenAI/Anthropic）：包住**單次 run** 的確定性 runtime——工具、約束、驗證閘，validate/authorize/execute/log 每個動作。
- **Loop engineering**（6 月 2026，比 harness 高一層）：按**排程 + 對著 goal** 自己 prompt agent、生 helper、「邊睡邊跑」。槓桿從「單一 prompt」移到「生成+驗證 prompt 的系統」。
- **Workflow / goal**：agentic workflow ＝ goal→think→act→observe→repeat；goal-oriented = 動態自學 vs 傳統 workflow = 固定軌。
- 來源：[Loop Engineering/MindStudio](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents)、[explainx 2026](https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026)、[OpenAI harness](https://openai.com/index/harness-engineering/)、[awesome-harness](https://github.com/ai-boost/awesome-harness-engineering)。

```
Loop engineering   ← 排程+goal、自主、生 helper、邊睡邊跑
   ↑ 高一層
Harness            ← 包住單次 run（工具/閘/驗證動作）
   ↑
Model
```

## knowie 的位置：正交的「持久 grounding」，在 stack **底下**
這三層全是**執行機制**（怎麼跑）。knowie 是它們該扎根的**持久 why**。關係＝**前促發、後對帳+固化**。

## development atom：統一的耦合面（為何配所有引擎是同一招）
把**一次 loop 當成一顆不透明的「開發原子」**，knowie 在原子**外面**做事——像 for 迴圈把全域狀態放迴圈外：
```
# knowie 持有全域狀態：knowledge/ ＝ 累加器 + 此 endeavor 的 why/goal/約束
while not done(goal):                    # loop engineering：對 goal 排程
    prime(atom, from=knowledge)          # next：把 why/goal/約束讀進原子
    result = run_atom()                  # harness/SDD/plan：原子 body，knowie 不進去
    knowledge = reconcile+consolidate(knowledge, result)  # judge + capture/consolidate：寫回
```
**knowie ＝ `run_atom()` 以外的一切**（迴圈的持久狀態 + 邊界讀寫）。

- **不透明 ＝ 可攜的原因**：原子內部（think→act→observe / spec→code / plan→execute）是**平台特定**的；但**邊界介面統一**（prime 進 / reconcile+consolidate 出）。knowie 只依賴邊界、不依賴內部 → **換引擎不用改**。這是 [協議非平台](../concepts/協議非平台.md) FUSE 命題的 precise 版：knowie 定邊界協議，原子（operation）可插拔。
- **同一招配三者**：SDD ＝ 一次 spec→code、plan ＝ 一次 plan→execute、loop ＝ 一圈 iteration——都是一顆原子，knowie 都只在兩端做事。所以下面「逐一配對」其實是**同一個介面的三個投影**。
- **粒度旋鈕 ＝ 校正頻率**：原子越大 → knowie 只在結束才 reconcile → 內部可能先漂；越小 → 邊界越頻繁 → grounding 越密、drift 越小。**「一顆原子多大」是 loop/harness 的設計選擇**；對 run-while-you-sleep，把原子設成「一圈 iteration」→ knowie 每圈 prime+verify。
- **兩層單位**：[endeavor](2026-06-11-能否跨領域-endeavor為單位.md)（整個志業）＝ knowie **組織** why 的單位；**development atom**（一顆 loop）＝ knowie **包裹** work 的單位。一個 endeavor 由許多 atom 組成。
- **接 git/transaction**：原子 ＝ 一個 transaction ＝ 一個 git commit（原子性）；邊界讀寫在 commit/merge 點；狀態在邊界才可見 ＝ [多agent併發](2026-06-12-多agent併發-git模型.md) 推過的 release consistency。

## 逐一配對
- **× Harness**：harness 閘檢查「動作准不准跑」（安全/授權），**不檢查**「合不合 why/原則/教訓」——後者是 knowie（next 餵 why、judge 語義對帳）。**harness 是動作閘，knowie 是 why 閘。** 且 knowie 跨廠商 → 騎在任何 harness 上。
- **× Loop engineering ── 最強配對**：「邊睡邊跑、對 goal、沒人在每一圈」＝ drift/reward-hack/遺忘風險最大處。knowie 供它最缺三樣：**持久 goal**（vision/roadmap，非 ephemeral）、**約束**（principles 護欄、防漂/防抄捷徑）、**跨圈記憶+語義驗證**（capture/consolidate 複利每圈所學、judge 每圈 verify，超出 harness 的動作閘）。→ **knowie ＝ run-while-you-sleep loop 的龍骨 + 長期記憶**。loop 生 helper ＝ 多 agent → 套 [多agent併發](2026-06-12-多agent併發-git模型.md) 的 git 併發模型。
- **× goal**：vision 本就是**持久 goal 表徵**（前瞻記憶）；principles=約束；使命「為共識而記」＝人與 agent **共享同一 goal**（長期自主追 goal 不偏離人意圖的對齊）。
- **× workflow**：反覆的 workflow → **蒸餾成 domain skill**（knowie 是 workflow「持久化+可攜化」的去處＝distill→skill）；需 why 的 workflow → 讀 knowie 當 grounding。

## 統一
**harness/loop/workflow ＝ 快引擎（怎麼跑）；knowie ＝ 慢 grounding（為何/為誰/別漂/記得）。** 正是 [記憶系統](../concepts/記憶系統.md) 的**快寫（海馬/draft）vs 慢寫（皮質/三檔）**：loop 是快系統，knowie 是慢的、已固化、跨一切那層。前促發（goal/約束/plan）、後對帳+複利（verify/固化）。

## 戰略順風（同 SDD 理）
harness/loop 引擎爆量且**平台綁定**（各家自己的）。它們越紅、越自主、越邊睡邊跑，**越需要一個不被綁進單一 harness 的、可攜的持久 why 層** ＝ knowie（跨廠商 markdown，[協議非平台](../concepts/協議非平台.md)）。**loop engineering 越火，knowie 接口越被需要。**（補強 [競品與生存空間](2026-06-06-競品與生存空間.md)。）

## 誠實邊界
knowie **不跑 loop/不排程/不編排/不自主追 goal**——被動 grounding，**互補非替代**；每圈快狀態（context window）歸 harness、不歸 knowie（同 [handover](2026-06-12-跨session跨廠商handover.md) 界線）。

## 出口
- 定位洞見（已成熟核心：「knowie ＝ autonomous loop 的對齊龍骨 + 長期記憶」）。
- ⏸ **2026-06-12 consolidate：考慮升 vision 核心想法，決定 defer（留 draft）**。理由：(1) 結構定位雖穩，但說服力全靠未驗的 drift-prevention——沒接過真 loop 前升 vision ＝ 拿 draft 當定論（同 history/002 的坑）；SDD 能進 vision 是「已在用」，loop 這條還沒。(2) vision 核心想法已長（SDD/FUSE/endeavor/handover），避免催肥。
- **升 vision 的觸發**：接一個真 loop（next 餵 goal/約束、judge 每圈 verify、consolidate 複利）跑一輪、drift 真防住 → 那是「已在用」信號 → 再升。
- 待驗：上述真實 loop 整合。
