# knowie × graph engineering：槽位被命名了，缺的是六條接口

> 2026-09-12 討論。draft，定位型 + 設計型。
> 怎麼冒出來的：問「knowie 跟 Loop Engineering 搭得很好，現在又冒出 Graph Engineering，該怎麼改才能在裡面極其好用」。查證後發現不必改定位——這套實踐自己把 knowie 站的那層切出來當獨立設計問題。是 [harness/loop 定位](2026-06-12-harness-loop-workflow定位.md) 的下一格。

## 這套實踐在講什麼
2026 年中 loop engineering 之後的下一層。一句話：**loop 是「單一節點 + 一條指回自己的邊」的圖**，graph engineering 處理多個這種迴圈怎麼接。

它明確把三件事切開，而且說它們**不能互相替代**：
- **execution graph**：誰下一個跑。
- **context graph**：每個節點**能看到什麼**。
- **loop**：單一節點內部的重複、驗證、重試、升級。

它要求的東西：每個節點一份契約（讀什麼、輸出什麼、權限、逾時、成功條件）；shared state 要有型別、出處、版本、存取規則、併發合併行為；verification node 要跟 maker 分離、當閘門不當建議；終止語意要硬；失敗要能隔離到單一節點修完續跑；拓撲當版本化的可執行規格審。

治理版的講法更接近 knowie：把許多回饋迴圈接成**互相監看、約束、糾正**的網路，並錨在「優化機器**被禁止改寫**」的凍結參考點上。

## 核心發現：槽位被命名了
「execution adjacency is not authorization」——下游 agent 不因為剛好跑在後面就有權拿到上游全部 transcript。**所以 context 邊界不歸 orchestrator 擁有。**

這正是 knowie 站的地方。過去 knowie 得自己論證「我是一層」；現在這套實踐宣告那一層存在、是獨立設計問題、有獨立擁有者。**不是順風，是指名。**

同時它把 [harness/loop 定位](2026-06-12-harness-loop-workflow定位.md) 那句「loop engineering 越火，knowie 接口越被需要」推得更強：節點數乘上去，需要 grounding 的點就乘上去。

## 對照：它要的 vs knowie 有的
| 它要求 | knowie 現況 | 缺口 |
|---|---|---|
| shared state 有型別／出處／版本／存取規則 | git + `history` superseded + 延伸原則 6 | 缺存取規則與型別 |
| 每條 edge 是契約，講明什麼過去、什麼**刻意不給** | 沒有，`knowledge/` 整包給 | **最大缺口** |
| verification node 與 maker 分離、當閘門 | judge 驗知識庫，不驗工作 | 差一個接口 |
| 終止語意要硬 | vision roadmap 有驗收，但是散文 | 機器讀不到 |
| 錨點是被禁止改寫的凍結參考 | 根本原則 + 定案主權 + 延伸原則 5 | 靠慣例，不是閘門 |
| 拓撲當版本化可執行規格 | 不適用 | **不該碰**，見護欄 |

錨點那條值得記著：**別人說「需要一個優化機器不准改寫的凍結點」，knowie 早就有了**，而且是根公理等級。這是目前對外最強的一句話。

## 六條接口：兩組
### A. 理據已有，缺實作
1. **每個節點一份有出處的 context 投影。** reviewer 節點該拿到原則加驗收，不是整疊 draft。`next` 的 brief 已是九成，但它寫給人在聊天視窗讀，不是給節點當輸入契約。推導鏈現成：根公理一「一個概念多個投影」。
2. **brief／回流各自變成有型別的 artifact。** 欄位＝驗收條件、約束＋逐字引用＋出處、明確 out of scope、風險；回程用同一 schema 交回，那就是 capture 的輸入。理據見 [OKF frontmatter 互通](2026-06-24-OKF競品與frontmatter互通.md)：同一份知識多開一個對機器的 read model，不動來源，合原則 8。
3. **併發寫入改 append-only。** fan-out ＝ 多寫者同時寫 `knowledge/`。理論齊了（延伸原則 6 的單調化 + CALM，家在 [多 agent 併發](2026-06-12-多agent併發-git模型.md)），機制沒有：`capture` 寫三檔不是 append，`history/NNN` 是共用計數器——那個衝突在 [架構視角](2026-06-12-migrate架構視角-ES-CQRS-DDD.md) 已被純演繹預測過。不修，fan-out 下會製造 distributed ambiguity。
4. **根本原則的錨點從慣例硬化成閘門。** 根本原則的 diff 沒伴隨 `history` 記錄 → judge 直接紅燈；「改動率趨近零」這個指標要能被外部 loop 查詢。大半存在，只差收緊。

### B. 需要新設計
5. **judge 能當 checker node 跑。** 這是 knowie 在圖裡唯一沒人能複製的價值：所有 verification node 都能說「測試掛了」，只有 knowie 能引用**為什麼**那條約束存在、指得出是哪條原則哪次轉移。接口：給一份 brief artifact + 一個 diff，回報哪些約束被違反、附引用。
6. **roadmap 的驗收條件可機讀。** 對上它列的常見失敗「終止語意太弱」。knowie 有別人沒有的東西：帶人類定案閘門的 roadmap。但它是散文。

## 護欄（第 6 條的前提，也是整份的前提）
- **knowie 只發布終止條件，永遠不評估、不排程。** 一旦它自己判斷「做完了沒」，就跨進 execution 層，[協議非平台](../concepts/協議非平台.md) 破掉。
- **不要把 node／edge／state schema 這組詞彙吸進 knowie 的結構。** 熱門拓撲出現時最大的誘惑就是進口它的詞彙；那違反延伸原則 7，也重演原則 8 已否決的「自建 graph 引擎」。維持 context 與治理層，把接口暴露出去，execution graph 留給 LangGraph 那類。

## 待想
- 第 1 條的「投影給誰」怎麼指定？節點角色是使用者的 execution graph 的概念，knowie 不該認識它——可能的解法是投影**按 endeavor／按 brief**，不按節點名。
- 第 2 條的 schema 放哪？frontmatter vs 獨立檔？跟 [OKF](2026-06-24-OKF競品與frontmatter互通.md) 的欄位會不會打架？
- 第 3 條會動到 `history/NNN` 這個主鍵，是 structure 層改動 → 要評估 `structureVersion`。
- 六條全做完，knowie 會不會實質上變成一個 framework？判準應該是：**它有沒有開始擁有 runtime。** 只要仍是 markdown + 約定，就還在協議這邊。

## 同族
[harness/loop 定位](2026-06-12-harness-loop-workflow定位.md)（上一格）、[多 agent 併發](2026-06-12-多agent併發-git模型.md)（第 3 條的家）、[OKF frontmatter 互通](2026-06-24-OKF競品與frontmatter互通.md)（第 2 條的理據）、[架構視角 ES/CQRS/DDD](2026-06-12-migrate架構視角-ES-CQRS-DDD.md)（read model 的語言）、[協議非平台](../concepts/協議非平台.md)（護欄）、[競品與生存空間](2026-06-06-競品與生存空間.md)。

## 來源
- [Graph Engineering Guide 2026, AI Builder Club](https://www.aibuilderclub.com/blog/graph-engineering-guide-2026)
- [Graph Engineering for AI Agents, eigent.ai](https://www.eigent.ai/blog/graph-engineering-ai-agents)（治理版、錨點）
- [Execution Graphs, Context Graphs, and Loops, puppyone](https://www.puppyone.ai/en/blog/graph-engineering-ai-agents-map)（三者切開、authorization 那句）
- [Graph Engineering Explained, v12labs](https://www.v12labs.io/blog/2026-08-17-graph-engineering-explained)（六個常見失敗）
- [3 Years of Graph Engineering with LangGraph](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph)
- [Graph Engineering for Multi-Agent Systems, TrueFoundry](https://www.truefoundry.com/blog/graph-engineering-enterprise-guide)
