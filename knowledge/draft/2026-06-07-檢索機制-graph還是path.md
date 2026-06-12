# 檢索機制：graph 還是 path？（連結語法是它的下游）

> 2026-06-07 設計討論。
> 怎麼冒出來的：問「連結用 `[]()` 還是 `[[ ]]`」，發現這不是格式偏好，是**檢索機制的決策**——查 LLM Wiki 後更清楚（見 [競品與生存空間](2026-06-06-競品與生存空間.md) 第四方）。
> ✅ **大部分已定案並固化**：連結慣例 `[]()` → 延伸原則 8；決策 + 否決理由 → [history/003](../history/003-連結慣例與檢索定位.md)；9 處 `[[ ]]` 已遷；judge 加 backlink 衍生。
> 🔶 **此檔現在是 roadmap 項「FUSE 掛載驗證」的在建脈絡**（未證的那塊：adapter 從 `[]()` 衍生 graph、軟介面硬化）。完成後才兌現出列。下方保留完整推理當現場。

## 核心岔路
連結語法 = 檢索機制的下游。兩條路：

- **path 式**（`[]()`）：index / Key Extensions → 跟著真實路徑走。連結是「位置指標」。
  - 優：純 markdown、第三方免工具讀得懂、judge 死連結用 grep/ls 機械驗、AI 跟路徑零歧義、不假設平台（合「協議非平台」「answer to ground truth」）。
  - 缺：改名要更新引用（但這合「記錄轉移」不變量，judge 也抓得到，半失效的缺點）。

- **graph 式**（`[[ ]]`）：概念互連成圖，沿 backlink/邊 traverse。連結是「檢索的邊」。
  - 優：backlink + graph view + 改名不斷；**LLM Wiki 靠這個打 RAG**（「every [[wikilink]] becomes an edge」，號稱 95% less token than RAG）。最貼「用 LLM Wiki 取代 RAG」的嚮往。
  - 缺：`[[ ]]` 在 GitHub/純 markdown 不渲染（第三方看到壞字）、要 resolver（= 假設平台，逆「協議非平台」）、要維護 backlink/index（一個 wiki-integrate 式步驟）。

- **dual-link**（兩個都寫）：成熟 LLM Wiki 的折衷。
  - 缺：寫兩份連結 = 冗餘，逆 knowie 的「砍冗餘/單一真相源」。**除非那條 graph 邊真的拿去檢索，否則是 theater。**

## 判準（別為相容而 dual，要 dual 是因為要 graph 檢索）
決策不在「哪個語法好看」，在「**knowie 要不要 graph 式檢索**」：
- 要 graph 檢索（跟 RAG 拚 token 效率）→ 採 `[[ ]]`（或 dual）+ judge 維護 backlink/index。
- 不要（path 檢索夠用）→ `[]()`，dual 是冗餘。

## 收斂（2026-06-07）：強烈往 `[]()` 倒，選 graph 的三個理由被逐一拆掉
討論後，原本支持 `[[ ]]`/graph 的理由站不住：

1. **「管 why 不管 what」直接判了檢索**：大規模檢索 / RAG 替代 / token 效率都是 *what-retrieval* 的最佳化。knowie 既已定位「不下場比記憶 agent、當 why 層」，自己去蓋 graph-RAG 就走回剛避開的競技場（Letta/Hermes/LLM Wiki 已贏）。→ **大規模檢索 = what = 可插拔後端；knowie 掛上去，不自己蓋。**
2. **graph 可「衍生」，不必「扛」**：knowie 真相源 = 正向 `[]()`；要 graph view 由後端 / adapter 從結構生 `[[ ]]`（像 Key Extensions 是衍生索引）。一份真相、多個投影＝根公理一。dual 因此是冗餘，不是必要。
3. **雙向連結不構成選 graph 的理由**：雙向 ≠ 語法功能，是「對正向連結建的衍生反向索引」。`[[ ]]` 的「雙向」是 Obsidian 引擎掃檔建的，語法只是好 parse。`[]()` 一樣能雙向：
   - **(A) 衍生**：grep `](path` 即得 backlink；**judge 死連結偵測同一個掃描順手就吐**，零冗餘、永遠準。
   - **(B) 物化**：把反向邊也寫出來——knowie 現在就在做（roadmap↔draft、concepts/相關、experience→concept）。judge 維護其對稱即 wiki-integrate 式自動化。
   - `[[ ]]` 唯一真贏：人用 Obsidian raw 瀏覽時 backlink 即時跳出。但 knowie 讀者主要是 AI（自己 grep），用不到。

→ 三題一起落地：**檢索**＝小而策展的 why 浮現（next）＋大規模外包後端；**語法**＝`[]()`（graph/backlink 衍生，不 dual）；**定位**＝掛在 LLM Wiki / agent memory 上的 why 層，不比 wiki。
→ 附帶：「檢索是手段（可外包）、共識/why 是目的」也是把根公理推向「為共識而記」的一條獨立線（**已定案**，見 [history/004](../history/004-補使命-根公理二鬆綁.md)）。多條獨立推理指向同一個根 = 可能是真的根。
→ **仍虛的一塊**：FUSE 掛載（adapter 衍生 graph、軟介面硬化）未證；但不影響此刻用 `[]()`。這是唯一還需驗的，所以本檔仍 draft。

## 暫定（未定案前的最小承諾）
先用 **`[]()`**：它是兩條路的最小公分母——將來上 graph 也照樣渲染；反過來 `[[ ]]` 在沒引擎時是壞的。把 9 處既有 `[[ ]]`（concepts 互引）暫留，等這條定了再一次遷。
- ⚠️ 注意：knowie 現有的「概念互引」（concepts/相關、experience→concept）其實已經是**雛形 graph**。所以 knowie 可能「想當 path、實際在長 graph」——這條沒想清楚前別硬遷。

## 連動（這條牽動的）
- **judge**：backlink = judge 衍生的職責（掃正向 `[]()` → 反向索引；與死連結偵測同一掃描）。要人讀的關鍵節點可物化反向邊，judge 維護其對稱。
- **next 檢索設計**：維持「策展索引 → 跟 `[]()` 指標走」即可；大規模沿邊召回是後端的事。
- **定位**：path + 後端衍生 graph = 「掛在 LLM Wiki 上的 why 層」（見競品檔的待答）。
- **MEMORY.md**（我的自動記憶）用 `[[ ]]` 是另一套系統，不在此決策內。

## KFS：把 FUSE 介面形式化（北極星，但 premature + POSIX 陷阱）
問過「做一個 Knowledge File System 協定，讓 knowie 坐在上面？」——這其實是 **FUSE 北極星的具體化**：把「機械層」正式切出來。
```
knowie（why 語意：三視角、記憶動態、層結構）
   ↓ 用
KFS（知識檔操作：存/讀/連/查/版本，backend 可插拔）   ← 形式化的 FUSE 介面
   ↓ 被實作
backends（純檔 / 向量庫 / LLM Wiki / Obsidian）
```
- **架構對**：乾淨歸位本檔反覆分的東西——檢索/graph/sync/backend ＝ KFS（機械）；why/三視角/動態 ＝ knowie（語意）。並解鎖「KFS 被多方共用」（LLM Wiki / agent memory 都能坐上去，knowie 只是 why-語意那個 consumer）＝協議被多方實作的成功態。
- **時機錯（最大級 premature）**：knowie 上層**還沒驗**（只軟體 dogfood），先定下層協議＝為沒證明有人要的房子打地基。正解**自底向上**：先驗 knowie，**若**機械層真要被重用，**再從穩的上層 factor 出 KFS**——不 top-down 先猜。（同砍 health CLI / installDomainSkills 的 YAGNI，scale 更大。）
- **POSIX 陷阱（最尖）**：knowie 命根＝**FUSE 不是 POSIX**（寄生「AI 會讀寫 markdown」、零採用成本）。KFS 若是**別人要去實作的新標準**→ 用 knowie 先要有 KFS 實作＝採用成本＝POSIX，**背叛命根**。故 KFS 必須**保持寄生**（只 markdown+慣例，零採用）——但那它幾乎就是 knowie 已內嵌的東西，當「獨立協議」邊際價值低。形式化的真價值是**互通**（多工具共用知識檔基底），但要**生態 + knowie 已證**才有意義。
- **判斷**：對的北極星，錯的時機；真做時守住「仍寄生 markdown」。歸進 roadmap「FUSE 掛載驗證」的同一族（artifact 封裝見 [能否跨領域](2026-06-11-能否跨領域-endeavor為單位.md)）。

## 出口
problem 大半已答（往 `[]()` + 衍生 backlink + why 層收斂），剩 **FUSE 掛載未證**。
- 若接受此收斂 → 轉 design：(1) 把 9 處 `[[ ]]` 遷 `[]()`（連結慣例定案）；(2) judge 加「掃正向連結 → 衍生 backlink」職責；(3) 定位句進 vision（已部分進）。三者可進 roadmap。
- 在使用者拍板前，`[]()` 仍是安全暫定，9 處 `[[ ]]` 暫留（遷了等於默認定案）。

## 來源
- nvk/llm-wiki、vanillaflava/llm-wiki-skills、ar9av/obsidian-wiki
- Karpathy LLM Wiki vs RAG（mindstudio）、LLM Wiki Architecture（smartscope）
- Hermes Agent bundled LLM Wiki skill（hermes-agent.nousresearch.com）
