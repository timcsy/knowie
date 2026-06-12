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

## HITL：replay 是「訪談開發者」的機會，介入粒度＝dial
逐片往前播，不只是給 AI 重建，也是**把人接進來**的最好時機。

- **最強的 why 來源是開發者腦袋裡沒寫下的東西**：當初真實意圖、走過的死路、「我其實是因為 X 才這樣做」——連 git/spec 都沒有。**replay 順時間走會 jog 記憶**（走到 M3b 那片，開發者想起那時撞的坑）。HITL 就趁那一刻把它撈進來。→ 遷移從「匯入過去」變成「**AI 用時間軸訪談開發者、趁記憶還在把沒寫下的 why 撈出來結晶**」（也是最後機會，再過半年自己也忘）。
- **介入粒度是 dial，不該全有全無**（又是那個粒度旋鈕家族：切片/grounding/介入頻率同源）：粗＝跑完審結果 · 逐里程碑 · 逐片/逐件（現行 step 5）。
- **最佳預設＝升級制（escalation）**：AI 有把握的直接做；**不確定/高風險才 trap 給人**（「這是概念還是決策？」「值不值得留？」「碰到一條原則，你定」）＝[多agent併發](2026-06-12-多agent併發-git模型.md) 的保護環/interrupt（AI user mode 跑，撞不可逆才陷入 ring 0）。好處：人只被問該問的，不會被 200 個確認轟到麻木而全部 rubber-stamp（等於沒 HITL）。
- **務實前提：逐片審「可做」，審完整 200 檔「不可做」**。replay 把「不可能的審查」切成「一口口審得動」——這本身就是 HITL 可行的前提。
- **接使命**：這讓遷移真正是「為共識而記」——人補腦裡的、AI 補 git 裡的、每片對齊，**一起把過去的 why 重新策展**，比純 AI replay 整理得乾淨。

## HITL 的安全形態：人讀軌跡、不在中途改寫（RL 鏡子）⭐ 修正上節
上節把 HITL 講成「人介入重建」——但人若**在 replay 中途 re-decide**，會引發**蝴蝶效應**：下游切片都建立在「真實發生過的事」上，被人改過一刀後就對不上、變沒價值。根本原因——**re-decide ＝ retraction（撤回/改寫）＝ 破壞單調性**，而單調性正是 replay 收斂的命根（見上「為什麼理論正確」#3）。**蝴蝶效應就是單調性被破壞的後果。**

**RL 的鏡子照得很準**：
| RL | replay-migration |
|---|---|
| **Trajectory**（實際走過的路） | git 史 ＝ 專案真實軌跡，**不可變** |
| **Replay Buffer**（存經驗、只讀、取樣學） | git 軌跡＝buffer——replay 它、取樣它，**永不編輯它** |
| 學習 / policy update | 蒸餾（從軌跡建 knowledge/）＝學習那一側 |
| **Off-policy**（從別 policy 的軌跡學） | 歷史是**沒 knowie 時**產生的（不同 policy）→ off-policy 地學 knowie 知識 |

RL 鐵律：**不編輯 buffer 裡的經驗，從它學。** 人在中途寫＝編輯 buffer＝污染經驗＝蝴蝶。**「人讀不寫」＝人在 learning 側、不在 experience 側。**

**解＝把「忠實記錄軌跡」和「策展知識」分兩相**（蝴蝶只在兩者混在一起時存在）：
- **Phase 1 — replay（人讀，軌跡不可變）**：AI 忠實蒸餾進 knowledge/；人讀（時間軸 jog 記憶）。產出忠實、單調，無蝴蝶。
- **Phase 2 — 策展（人寫）**：在完整忠實 base 上跑正常代謝（consolidate/judge）剪/併/重塑——這裡寫不 cascade，因重建已完成。

**「撈 why」收斂成 additive-only**：人讀 replay、記憶被勾起 → **說出** missing why → **AI 寫**進那片（additive＝補真實 why、不改軌跡 ＝ 單調 ＝ 安全）。人**不**中途 re-decide/剪/重塑（retraction＝蝴蝶）→ 留 Phase 2。**分界：additive 補充（安全）vs alteration 改寫（危險）。** 「人說、AI 寫」也對上延伸原則 5（人給語義、AI 機械寫）。

→ 本質：**不可變的軌跡 + 可策展的投影**——跟 event sourcing（log 不可變、projection 可重建）同結構，也是 replay 單調收斂的保證。

## 代價（使用者說的「不一定快」——對）
- N 個切片 ＝ N 次 pass，比一次貴很多。
- **解 ＝ 切片粒度旋鈕**（又是「原子多大」那個旋鈕）：不用每個 commit 一片，用里程碑/spec/cluster（battle ≈ M1/M2a/M2b/M3a/M3b/M3c，6–9 片）。粗 = 快但糊、細 = 慢但準。可調。
- **HITL 也加成本**（人越細審越慢）：dial 讓開發者自己換（趕時間就粗、要乾淨就細）；escalation 模式把「細」的成本壓到最低（只問該問的）。

## 附帶解掉的
- **「別重擲」**：replay 是累積的、可逐片 commit → 不需要 re-run from scratch，重擲骰子的問題自動消失（呼應「migrate 一次→commit→維護，不是可重擲函數」）。
- **決定性骨架 vs 語義層**：切片結構（決定性，git 給）+ 每片的語義判斷（LLM，但局部有錨）——天然把機械層和語義層分開了。

## 出口（已建 / 部分已驗）
- ✅ **已建進 migrate skill（0.6.3–0.6.5，2026-06-12）**：模型「切片 + 往前播 + 逐片疊」；每片以當時 knowledge/+spec 為主要 why（0.6.4）；spec 來源 tool-agnostic + plan-mode 降級（0.6.5）。
- ✅ **核心賭注已驗（battle 真跑 2026-06-12）**：history 長出**真實決策轉移**（如 002 schema 反轉：plan 原案重建表 → 撞 FK/PRAGMA → 改保留 CHECK+佔位值）——snapshot 法結構上產不出。見 experience「決策轉移只從往前播長出來」。episodes 也錨在 9 個里程碑。
- ⏳ **剩收斂性待驗**：重跑**兩次**比對 episodes/history 集合差多少。錨在里程碑**應**穩，但只有二跑能證。**這是模型欠的最後一個驗收。**
- 設計脈絡同族：[記憶系統](../concepts/記憶系統.md)（git＝原始因果基底）、[收斂](../concepts/收斂.md)（冪等是核心、現行 migrate 違反它）。
- 待想：切片邊界怎麼自動抓（里程碑 tag？commit message 模式？spec 目錄？）；replay 中途人要不要每片確認（成本 vs 控制）。
