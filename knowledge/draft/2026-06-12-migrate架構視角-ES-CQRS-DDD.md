# migrate 的架構視角：Event Sourcing / Snapshot / CQRS / DDD

> 2026-06-12 討論。draft，lens 型——用四個成熟架構 pattern 重新看 migrate/replay。
> 怎麼冒出來的：問「能不能從 ES/snapshot/CQRS/DDD 角度看這件事」。四面鏡子收斂得驚人，而且把 [history 退化 bug](2026-06-12-migrate時間軸replay.md) 診斷得更精準。

## 一句話統一
**migrate ＝ 把 git 日誌往前 event-sourcing 重播、用 IRL 把技術事件 lift 成領域事件、重建 `knowledge/` 這組 CQRS 讀模型——因為舊 `knowledge/` 是過期 snapshot、現規則下必須從不可變日誌重建。** 之前所有的洞（遮罩/循序/傳累積/別信舊/轉移）全是這句的推論。

## Event Sourcing
- **git 史 ＝ 不可變 event log；`knowledge/` ＝ projection；replay ＝ rebuild projection from log。**
- 日誌不可變 → 不編輯 git、replay 中不寫（蝴蝶）、RL buffer 唯讀——同一條。
- **關鍵 impedance**：git commit **不是乾淨的 domain event**（是 code diff＝技術事件）。真正的 domain event ＝「決策/why」，要**從 commit 推論**（＝IRL）。兩層事件：技術（commit）→ 推論 → 領域（決策）。`knowledge/` 是**領域事件**的投影。

## Snapshot（解釋了遮罩 + 「前面的狀態」）
- ES 為省錢存 snapshot（物化中間態），從最近 snapshot 往後播。
- **舊 `knowledge/` ＝ 一個 snapshot，但用舊規則建（stale）。** ES 鐵律：**投影邏輯一改，舊 snapshot 失效 → 必須從 log 重建，不能從 stale snapshot 續。**
- → 這就是「別信舊 `knowledge/`、從 git 重播 + 遮罩最終態」的精確理由：偷看舊最終態 ＝ 用 stale snapshot 污染重建。
- **per-slice checkpoint ＝ 新 snapshot（現規則）**；使用者問的「前面的狀態」**就是「目前累積的 snapshot」**——下一片從它往後播。**循序傳累積 base ＝ 從最近 snapshot 續播。**

## CQRS（layers ＝ 多讀模型 ＝ 根公理一）
- 寫側＝開發（commit＝事件）；讀側＝`knowledge/`（為「答 why」優化的 read model）。
- **`concepts`/`episodes`/`history`/三檔 ＝ 同一 git 日誌的多個 projection**，各為一種 query（語意/情節/因果/規範）＝**根公理一（一概念多投影）+ [記憶系統](../concepts/記憶系統.md) 那張對應表**。
- 人**讀** read model、不在重播中**寫**它（寫＝污染投影＝蝴蝶）＝讀寫分離。

## DDD（診斷出 history bug）
- **領域事件 ≠ 技術事件**：「反轉了 schema 決策」是領域事件；「commit abc 改 5 行」是技術事件。
- → **0.6.6 的 history 退化成「每里程碑一條摘要」，精確說：migrate 投影了『技術事件』（每 cluster 一條），不是『領域事件』（決策/轉移）。** history 該是**領域事件流**（決策、散落在發生處）。**這是 ES/DDD 的 impedance 沒跨過去——技術→領域的 lift 失敗**（lift ＝ IRL + 需要前面狀態偵測轉移，正是 0.6.6 缺的兩樣）。
- 其餘對應：**bounded context**（why=knowie / what=code、how-leg＝context mapping 指針、不吸收＝根公理二）；**aggregate**（母概念＝一致性邊界、god-concept＝過大 aggregate＝那個 watch）；**ubiquitous language**（檔名/概念用領域自己的詞＝capture「命名是認出私語」）。

## 誠實界線（別假統一）
**不是純 ES**——純 ES 裡領域事件**是被記錄的真相源**；這裡領域事件是**從 code 事件推論**（IRL），而且**推論有損、有不確定**。**這個差異正是 migrate 難的根源**：事件不是現成的、要在遮罩下推論 → 才有非決定性、才需遮罩、才會 history 退化。**「事件是推論而非記錄」是 knowie 跟教科書 ES 唯一但關鍵的不同。**

## 出口
- lens，重新理解既有設計，不急回流。成熟用法：對外解釋 migrate「= rebuild CQRS read models by ES-replaying git, events lifted via IRL」。
- **可行動的產出**：history bug 重新診斷成「投影技術事件、非領域事件」→ 修法已明（IRL lift + 循序傳累積 base），併進 migrate 重寫時用。
- 四鏡頭（ES/Snapshot/CQRS/DDD）+ 先前（RL/CALM/atom）收斂於同一結構 ＝ [收斂](../concepts/收斂.md)「多面獨立鏡子→真根」又一例。
