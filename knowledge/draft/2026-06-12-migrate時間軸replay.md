# migrate 運作模型重寫：時間軸 replay（順時間逐片疊，不是看終局一次判斷）

> 2026-06-12 設計討論。draft，design 型——**運作模型**重寫，非措辭修補。先想清楚，再動 migrate skill。
> 怎麼冒出來的：battle 真實遷移**第三跑**後嚴厲批評——deep migrate **不可重現、不收斂**（同 git/specs，run 2 出 9 個 episode、run 3 出 4 個；concepts/history 整組換）。使用者提：「從 git 橫切、順時間慢慢疊起來會不會比較穩妥？」→ 對，而且是理論正確。

## 致命傷（要解的）
現行 migrate ＝「**看最終狀態 + 一次性整體判斷**」（snapshot judgment）。一個巨大判斷 = 高變異 → **每跑一次長出實質不同的知識庫**，違反 knowie 自己的 [收斂](../concepts/收斂.md)/冪等（「再跑該近乎 no-op」）。「重跑修問題」因此破產：它不收斂，只是重擲骰子。

## 新模型：時間軸 replay
**把 git 當事件日誌，從頭往前播放；在每個時間切片把增量疊上去**，知識庫像專案當初那樣**逐步長出來**。

## 為什麼這是理論正確（不只是穩）
1. **真正的 event-sourcing replay**：git ＝ event log、知識庫 ＝ 投影、replay ＝ 重建投影。現行法是 snapshot 判斷、根本沒在 replay（見 [多agent併發](2026-06-12-多agent併發-git模型.md) 的 event-sourcing/CQRS）。
2. **development atom / for 迴圈 用在遷移**：每個時間切片 ＝ 一個原子、知識庫 ＝ 累積的全域狀態、往前播 ＝ for 迴圈（見 [harness-loop](2026-06-12-harness-loop-workflow定位.md) 的 development atom）。
3. **往前播是單調的（monotonic）→ 收斂**：只「新增 + 標 superseded」，不回頭撤回 ＝ CALM 的單調區、本質收斂。snapshot 判斷不單調（每次重評全部）→ 飄。
4. **history（轉移）只有往前播才看得到（決定性理由）**：`history` 是決策的**轉移**（X→Y）。看終局只看得到 Y；只有順時間走，才會在那個 commit 撞見「這裡把 X 換成 Y」。**轉移只在時間軸上可見** → snapshot 法結構性地抓不到 history 精髓；replay 法 history 自然長出來。
5. **變異被分解**：很多個小的、各自錨在一個 commit 上的判斷（低變異、有錨），而非一個巨大判斷。**骨架（哪些切片、什麼順序）是 git 給的、決定性的** → 整體結構穩（9 vs 4 不再發生，episodes 錨在切片上、非 LLM 心情）。

## 演算法草圖
1. **切片**（粒度旋鈕，見下）：把 git 史切成有序的時間窗（里程碑/spec/有意義的 commit cluster）。
2. **順時間 for each slice**：
   - 讀這片的增量（此窗的 commits/diffs、新增/改動的 specs）。
   - **疊進成長中的知識庫**（一次 capture/consolidate）：此片冒出的概念 → `concepts/`；此片的**現場** → `episodes/`（how-leg 指此片 commit/spec）；此片做的**決策** → `history/`；教訓 → `experience`。
   - **轉移**：若此片**改了**先前的決策 → 在 `history/` 記 X→Y 轉移（標舊的 superseded）。這是 replay 最閃光處。
   - **（可選）checkpoint/commit** 這一片。
3. 結果：一個**重演了專案代謝史**的知識庫，因果軌跡（轉移）完整。

## 代價（使用者說的「不一定快」——對）
- N 個切片 ＝ N 次 pass，比一次貴很多。
- **解 ＝ 切片粒度旋鈕**（又是「原子多大」那個旋鈕）：不用每個 commit 一片，用里程碑/spec/cluster（battle ≈ M1/M2a/M2b/M3a/M3b/M3c，6–9 片）。粗 = 快但糊、細 = 慢但準。可調。

## 附帶解掉的
- **「別重擲」**：replay 是累積的、可逐片 commit → 不需要 re-run from scratch，重擲骰子的問題自動消失（呼應「migrate 一次→commit→維護，不是可重擲函數」）。
- **決定性骨架 vs 語義層**：切片結構（決定性，git 給）+ 每片的語義判斷（LLM，但局部有錨）——天然把機械層和語義層分開了。

## 出口（已建 / 部分已驗）
- ✅ **已建進 migrate skill（0.6.3–0.6.5，2026-06-12）**：模型「切片 + 往前播 + 逐片疊」；每片以當時 knowledge/+spec 為主要 why（0.6.4）；spec 來源 tool-agnostic + plan-mode 降級（0.6.5）。
- ✅ **核心賭注已驗（battle 真跑 2026-06-12）**：history 長出**真實決策轉移**（如 002 schema 反轉：plan 原案重建表 → 撞 FK/PRAGMA → 改保留 CHECK+佔位值）——snapshot 法結構上產不出。見 experience「決策轉移只從往前播長出來」。episodes 也錨在 9 個里程碑。
- ⏳ **剩收斂性待驗**：重跑**兩次**比對 episodes/history 集合差多少。錨在里程碑**應**穩，但只有二跑能證。**這是模型欠的最後一個驗收。**
- 設計脈絡同族：[記憶系統](../concepts/記憶系統.md)（git＝原始因果基底）、[收斂](../concepts/收斂.md)（冪等是核心、現行 migrate 違反它）。
- 待想：切片邊界怎麼自動抓（里程碑 tag？commit message 模式？spec 目錄？）；replay 中途人要不要每片確認（成本 vs 控制）。
