# 檢索機制：graph 還是 path？（連結語法是它的下游）

> 2026-06-07 設計討論。draft，未定案（problem 型）。
> 怎麼冒出來的：問「連結用 `[]()` 還是 `[[ ]]`」，發現這不是格式偏好，是**檢索機制的決策**——查 LLM Wiki 後更清楚（見 [競品與生存空間](2026-06-06-競品與生存空間.md) 第四方）。

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

## 暫定（未定案前的最小承諾）
先用 **`[]()`**：它是兩條路的最小公分母——將來上 graph 也照樣渲染；反過來 `[[ ]]` 在沒引擎時是壞的。把 9 處既有 `[[ ]]`（concepts 互引）暫留，等這條定了再一次遷。
- ⚠️ 注意：knowie 現有的「概念互引」（concepts/相關、experience→concept）其實已經是**雛形 graph**。所以 knowie 可能「想當 path、實際在長 graph」——這條沒想清楚前別硬遷。

## 連動（這條牽動的）
- **next 檢索設計**：graph 式 → next 該沿邊召回，不只讀三檔索引。
- **judge**：graph 式 → 要加 wiki-integrate 式「維護 backlink/index」職責。
- **定位**：graph + RAG 替代 = 往「LLM Wiki + why 層」靠（見競品檔的待答）；path = 守純協議。
- **MEMORY.md**（我的自動記憶）用 `[[ ]]` 是另一套系統，不在此決策內。

## 出口
這是 problem 型：要先答「knowie 要不要 graph 檢索 / 要不要往 LLM Wiki 靠」，才會變成 design → roadmap。在那之前 `[]()` 是安全暫定。

## 來源
- nvk/llm-wiki、vanillaflava/llm-wiki-skills、ar9av/obsidian-wiki
- Karpathy LLM Wiki vs RAG（mindstudio）、LLM Wiki Architecture（smartscope）
- Hermes Agent bundled LLM Wiki skill（hermes-agent.nousresearch.com）
