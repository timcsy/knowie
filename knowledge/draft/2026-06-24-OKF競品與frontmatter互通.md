# Google OKF：競品定位 + frontmatter 作為對外投影頭

> 2026-06-24 研究 + 討論。draft，problem/design 型。
> 怎麼冒出來的：使用者丟來 Google Cloud 的 [Open Knowledge Format 公告](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)（2026-06-13 發布），問定位是否重疊、深挖 frontmatter 互通。

## OKF 是什麼（一句）
Google Cloud（Sam McVeety / Amir Hormati）把 **Karpathy 的 LLM Wiki pattern 形式化成一個開放 format**：markdown + YAML frontmatter + git + 檔案系統，唯一必填 `type`、其餘 producer 自定。consumer 有 agent / catalog / static HTML graph visualizer。明確標語 **"Format, not platform"**。

## 定性：驗證方向、不搶核心——順風遠多於威脅
OKF 用 **Google 的招牌**幫 knowie 的根賭注蓋章：**format not platform + markdown + git + LLM Wiki 是真趨勢**。這是 experience「外部框架是照出 stated-why 的鏡子」的又一次外部驗證。

關鍵：它和 knowie 站在**不同 lane**——
- **OKF 存 what**：schema、metric 定義、表/欄位、catalog metadata、business context（例子就是「orders 表有哪些欄位、weekly active users 怎麼算」＝[why沒有oracle](../concepts/why沒有oracle.md) 的 what-lane，有 ground truth、過時會報錯）。
- **knowie 存 why**：原則/願景/經驗、因果轉移、決策理由（沒 oracle、靜靜誤導）。

→ **OKF 是更好的 data catalog；knowie 是一個 endeavor 的推理記憶。** 描述世界的兩半：OKF「系統長什麼樣」、knowie「我們為什麼這樣建」。**OKF 越成功 → 越多人有結構化的 what → 越凸顯 why 那層缺口**，而那層 OKF 設計上就不碰（minimally opinionated、連 schema 內容都不規定）。

這不是新威脅，是既有 draft 的具體化：[競品與生存空間](2026-06-06-競品與生存空間.md)（OKF＝LLM Wiki 的 Google 正式版）、[能否跨領域-endeavor為單位](2026-06-11-能否跨領域-endeavor為單位.md)（OKF＝組織級 topic-web、無單一 endeavor，正印證「通用 topic-web 是 LLM Wiki 地盤、knowie 守 endeavor」）。README 定位表的「LLM Wiki」格現在有了具名 Google 範例，文案不用改。

## 威脅 vs 機會
- **威脅（小但真）**：mindshare——Google 出手，"open knowledge format" 關鍵字被它佔；不講清差異會被當「沒背書的 OKF 山寨」。
- **機會（大）**：(1) 方向驗證（最強外部背書）；(2) **FUSE 命題反向具體化**——不是 knowie 掛上 LLM Wiki，是 knowie 被 OKF 生態收進去、白嫖它的工具（尤其 static graph visualizer）；(3) 互補不互斥，可共存。

## 深挖：OKF-相容 frontmatter ＝ knowie 的「對外投影頭」⭐
不是讓 knowie 變成 OKF，是**給它多開一個 read model**（不動本質）。

- **幾乎免費**：OKF 只要 `type`，而 knowie 每檔天生有 type（concepts→Concept、history→Decision、episodes→Episode、三核心檔→Principles/Vision/Experience）；title/description/tags/timestamp 都映得出；連結同樣是 markdown links。
- **兩方向，只一個值得做**：
  - **A producer（做）**：knowie 檔帶 OKF frontmatter → 被 OKF consumer（Google Knowledge Catalog、agent、visualizer）吃進去。低成本、蹭 Google 工具與受眾。
  - **B consumer（緩）**：knowie 讀組織的 OKF bundle 當 grounding＝what→why 對帳＝judge 的 oracle 賭注，較重未驗。
- **這是 CQRS / 多投影的又一例**（對上 [意義可追溯改寫](../concepts/意義可追溯改寫.md)）：同一份 why-knowledge，**對人的投影＝三視角判斷三角**、**對機器/OKF 的投影＝扁平 typed docs + links（frontmatter）**。三視角/因果鏈/代謝仍活在 knowie backend；frontmatter 只多開一個對外 read model。完全符合 **principle 8「graph derived not stored」**——不是把語意烤進 frontmatter，是從同一份知識投影出 OKF 視圖。
- **lossy 但可接受**：投影成 OKF 會壓平代謝語意（consumer 看不到「三者 codependent」「這條 history 被 superseded」），同 migrate 的 first-parent 丟時序——proxy，完整語意留 backend。

## 必守紀律
- **frontmatter 只標識「哪種 why」（type/title/tags/timestamp），絕不存 what**（不放 schema、不放指向 data asset 的 resource）。一旦為了「更 OKF」存 metadata，就違反 [why沒有oracle](../concepts/why沒有oracle.md) 的補集定位、踩進 OKF/code 的 lane。
- **別追 OKF 的 lane**：不要為「也能存 metadata」擴 knowie。
- **別觸發 frontmatter 全面改造**：v0.1 很新會變，全面改造會賠掉 graph-derived 的乾淨度、且要一直追版。

## 它把一條抽象 roadmap 變具體
vision「FUSE 掛載驗證」之前很空（要自己發明 adapter 協議）；**OKF 就是那個現成協議**——knowie 直接採用 OKF frontmatter 當「對外可被機器讀的那層」，Google 幫你答了「軟介面該硬化成什麼」。

## 出口
- **狀態：未驗、OKF v0.1 很新會變 → 方向標記 + 低成本試水，非現在 reconstruct。**
- **最小試水實驗**：挑一個 concept 檔加 OKF frontmatter → 丟進 OKF static visualizer 看畫不畫得出來。一檔、可逆、半小時驗「producer 方向成不成立」。
- **定位文案借力**（可隨時做、低風險）：README/貼文加一句「Google 的 OKF 把『knowledge as format, not platform』正式化了——knowie 賭同一件事，但守它刻意不碰的那層：why」。
- 同族：[協議非平台](../concepts/協議非平台.md)、[意義可追溯改寫](../concepts/意義可追溯改寫.md)、[檢索機制-graph還是path](2026-06-07-檢索機制-graph還是path.md)。
