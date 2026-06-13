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

## 執行層黑洞：沒遮罩 ＝ 偷看結局 ＝ hindsight（理論對、執行沒做到）⭐
真實觀察（battle）：**AI 並沒有真的往前播**——它有整個 repo 存取權，自然去讀**最終的 knowledge/、最終 code**（看了結局），skill 寫「往前播」卻**沒有任何東西強制遮罩未來**。結果是 **hindsight rationalization**（從已知結局往回合理化），退化回 snapshot 判斷、只是包了層「假裝往前走」。

**為什麼遮罩是命脈（比「轉移可見」更深）**：why 的推論**本質上需要遮罩未來**。
- 看了結局 → 只會**合理化結局**（hindsight bias），推不出真實意圖；
- 遮住未來往前走 → 看到開發者在**不知道未來**下選了 X → 「**為何當下、不知會反轉、仍選 X**」才是真 why。
→ 遮罩不只為了看到轉移，是**讓 why 是『推論出來的』而非『從結局倒推的』**。偷看結局 ＝ 污染 why 推論。

**IRL/GAIL 才是對的目標框架**（BC 太淺）：
| | 給什麼 | 夠嗎 |
|---|---|---|
| Behavior Cloning | state→action 複製：「做了**什麼**」 | ❌ 只有 what |
| **IRL / GAIL** | 推論軌跡背後的 reward/intent：「**為何**這樣做」 | ✅ knowie 要的 |
→ migration ＝ **對 git 軌跡做 inverse RL**：從觀察到的行為推論能解釋它的 why。每片任務從「摘要這片發生什麼」（BC、淺）改成「**遮住未來下，推論這片行為背後的 why**」（IRL、深）。而 IRL 本來就要求看軌跡 unfold——看結局就不是 IRL。

**怎麼真正遮罩（skill 措辭管不住，已驗）**：
1. **每片 checkout 到該 commit / 開 worktree** → 工作樹**物理上沒有未來的檔案**，想偷看也沒得看（最強遮罩）。
2. **harness/script 驅動**：外圈迴圈 checkout 每個 commit、只把那片狀態的 context 餵 AI、累積。

→ **遮罩屬執行層（harness），不是協議層（skill）**：這正是「knowie 在 loop 外、harness 驅動迴圈」——harness 提供遮罩，knowie 提供「拿到遮罩切片該做什麼」的 skill。純 skill 靠 AI 自律＝弱（已證）。**缺口：「skill 描述遮罩 replay」與「AI 真的遮罩 replay」之間，要 harness 補，不是改措辭**（同「plan mode ephemeral、knowie 不存 atom 內部」——遮罩是 harness 職責）。

## 演算法草圖
1. **切片**（粒度旋鈕，見下）：把 git 史切成有序的時間窗（里程碑/spec/有意義的 commit cluster）。
2. **順時間 for each slice**：
   - 讀這片的增量（此窗的 commits/diffs、新增/改動的 specs）。
   - **疊進成長中的知識庫**（一次 capture/consolidate）：此片冒出的概念 → `concepts/`；此片的**現場** → `episodes/`（how-leg 指此片 commit/spec）；此片做的**決策** → `history/`；教訓 → `experience`。
   - **轉移**：若此片**改了**先前的決策 → 在 `history/` 記 X→Y 轉移（標舊的 superseded）。這是 replay 最閃光處。
   - **（可選）checkpoint/commit** 這一片。
3. 結果：一個**重演了專案代謝史**的知識庫，因果軌跡（轉移）完整。

## 每片怎麼處理：跑真 capture（非 re-implement）＋ 循序傳累積（非平行）⭐
0.6.6 的 history 退化成「每里程碑一條摘要」，兩個真因都在「每片怎麼處理」：

**真因一：migrate 自己重做 dispatch、沒跑真代謝。**
- migrate 一直在「**描述** knowie 的代謝」（自己一張 dispatch 判準表），不是「**跑** knowie 的代謝」。→ 產出「像 knowie 但非標準」（格式漂、history 變摘要）。
- 解：**每片讓 AI 跑真 `capture`/`consolidate`**——扮演「那個時間點、剛做完這片、正在用 knowie 的開發者」**親身經歷**一次。好處：格式由真 `_core` 產生（不漂）、**history 自動只在轉移處**（capture 回流規則「只有 decision-transition→history」，不會每片一條）、DRY（不重複 capture 邏輯）。
- → **migrate 瘦成 orchestrator**（遮罩/切片/往前播/跨片轉移偵測/how-leg/完整性）；**capture/consolidate ＝ per-slice 處理器**。migrate 砍掉自己那張 dispatch 表。

**真因二：sub-agent 沒拿到「前面的狀態」（fresh 被做成 empty）。**
- replay 是 **fold**：每片建在前面累積上、**對它偵測轉移**。**平行＝每 agent 沒前面狀態＝不能累積、不能偵測轉移＝退回斷開快照。fold 不能平行。**
- 0.6.6 的 sub-agent「只給這片 git show」＝**沒給累積 base** → 看不到前面的決策 → **偵測不到 X→Y 轉移** → 只好寫成每片一條摘要。**這直接造成 history 退化。**
- 解：**fresh ＝「沒看過未來」非「空的」**。每片 processor 要**載入累積 `knowledge/`（前面的狀態，masked-built、無未來洩漏、安全）** + 這片 masked 增量。**遮的只有未來**（git > N、最終 code），不是累積的過去。
- 對應 snapshot：累積 base ＝ 最近 snapshot，下一片從它續播（見 [架構視角](2026-06-12-migrate架構視角-ES-CQRS-DDD.md)）。

→ 兩個合起來：**循序往前疊、每片傳入累積 base、跑真 capture、只遮未來。** 這才修得了 history（領域事件需 IRL lift + 前面狀態才偵測得到轉移）。

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

## 四個常態破口的設計答案（2026-06-12，寫進 migrate）⭐
盤點 replay 的下游風險（見 [預期問題](2026-06-12-migrate預期問題.md)），四個會崩品質的問題各有答案，**底線是同一句：別假設證據均勻乾淨，順著證據、標出強度。**

1. **亂史/DAG（#1）→ 按 git 結構切，不靠 LLM 判**：沿 `--first-parent` mainline、一 merge/PR=一片。DAG 不是問題是答案——mainline=domain events、branch 內部=technical events（DDD 投影，對上 [架構視角](2026-06-12-migrate架構視角-ES-CQRS-DDD.md)）。切片來自 git 形狀 → 上面「待想：切片邊界怎麼抓」與「非決定性從切片後門溜回」一起關掉。純線性無 merge → message-arc/窗 + 粗顆粒；rebase 過的史更線性、只丟真實時序。
2. **後加 knowledge（#4）→ adoption commit=相位邊界**：migrate 其實混了兩操作——*結構遷移*（knowie 從第一天有）vs *考古回填*（中途採用），接縫＝引入 `knowledge/` 的第一個 commit。採用前=粗顆粒考古（無當時 knowledge、why 弱、標 inferred）、採用後=細顆粒讀當時 knowledge。「讀當時 knowledge」從必要步驟降為 **enrichment-when-present**、per-slice graceful。**多數真實採用都在中途 → 採用前段是常態非邊緣。**
3. **推錯/沒 why（#3）→ 兩種聲音 + 不編造**：stated-why（作者記的，權威）vs inferred-why（從 diff 推、**標成推測**），HITL 專挑推測 jog（最高價值）。推不出 → 留洞記 episode、不給假 history 轉移。why 沒 oracle（根公理）根治不了，只能讓不確定可見、不洗成假自信。
4. **cascade（#2）→ 改記錄≠改過去**：單調性禁的只是「後見之明重審判專案的過去決策」；修「轉錄錯誤」（記錯實際發生的事，如轉移指向 base 從沒記過的決策＝judge 的 dead reference）不是撤回 → 准修、重 checkpoint。防火牆已在：每片 checkpoint + 每幾片 judge＝cascade 偵測器。**這釐清了上節 HITL 的單調性規則——它只防 retraction，不該連修記錄也禁。**

→ 仍未寫進 skill、待真實 battle 驗：5「無法重建的舊內容→直接搬+人確認」、8 中斷/resume 標記。

## 出口（已建 / 部分已驗）
- ✅ **已建進 migrate skill（0.6.3–0.6.5，2026-06-12）**：模型「切片 + 往前播 + 逐片疊」；每片以當時 knowledge/+spec 為主要 why（0.6.4）；spec 來源 tool-agnostic + plan-mode 降級（0.6.5）。
- ✅ **核心賭注已驗（battle 真跑 2026-06-12）**：history 長出**真實決策轉移**（如 002 schema 反轉：plan 原案重建表 → 撞 FK/PRAGMA → 改保留 CHECK+佔位值）——snapshot 法結構上產不出。見 experience「決策轉移只從往前播長出來」。episodes 也錨在 9 個里程碑。
- ⚠️ **0.6.5 真跑反而退步（2026-06-12）**：history 從 0.6.3 的 4 條乾淨轉移 → 1 條 + 復發舊錯（`history/001-early-lessons` 又進 history、沒重判、沒偵測到）。**證明：skill 措辭已到頭、非決定性沒解**——因 AI 偷看結局（無遮罩）。見 experience「有些 bug 是執行層的」。
- ⚠️→🟩 **0.6.10 真跑揪出 regression 的真根（2026-06-13）**：battle 切片 7，AI 把「M1 教訓歸檔 experience→history/」這個**純 `knowledge/` 維護 commit 當 domain 決策忠實重現** → `001-early-lessons` 又冒出。真根不是遮罩、是**範疇錯誤**：把 projection 編輯當 domain event。0.6.10 加結構性規則（knowledge/-only commit = 舊 projection 編輯、不產 history）。**用範疇模型取代纏了 8 版的措辭防線**。見 experience「projection 編輯不是 domain event」。
- 🔨 **待建（執行層，非 skill 措辭）**：
  - **遮罩 harness**（真解）：checkout/worktree per commit、per-slice 餵 AI、累積——物理上拿掉未來 → 非決定性消失、收斂、不偷看。是 harness/loop-engineering 元件，不是 skill。
  - **舊 knowledge/ 搬遷**：建之前把舊最終態搬到一邊（`knowledge.old/`）→ 從空重建（per-slice 當時態仍在 git）→ 去掉「原地讀寫混淆 + 沿用舊內容」（history/001 復發的一半原因）。有了遮罩 harness 則自動不必。
  - **機械偵測檢查**：掃 history 有沒有四段式 experience 混進來、數轉移、舊規則殘留——**抓得到錯，不靠 AI 自覺**（解「沒偵測到」）；也當「新 base vs 舊 base」完整性 cross-check。
- ✅ **收斂性：決議不要求冪等（2026-06-13 拍板）**。原以為要二跑比對證收斂——但釐清了 migrate **本性非冪等**：它用 IRL 推不可驗證的 why（[why 沒 oracle](../concepts/why沒有oracle.md)），產出是抽樣不是固定點。所以 run-to-run 變異分兩型：**第一型範疇錯**（projection-edit／墓碑／日期）有正解→規則→會收斂；**第二型判斷變異**（分組/命名/強調）無單一正解→交 HITL 策展，不追 determinism。**收斂非 migrate 的品質閘，good-enough + 人策展才是**（見 experience「把 migrate 當冪等函數修是用錯標準」）。「同版連跑比 diff」降為 optional（想量第一型殘差時才做），不再 gating。遮罩 harness 也因此非必要——in-session 遮罩已擋住第一型 regression（projection-edit 跨兩跑不復發）。
- 設計脈絡同族：[記憶系統](../concepts/記憶系統.md)（git＝原始因果基底）、[收斂](../concepts/收斂.md)（冪等核心、現行 migrate 違反它）、[架構視角 ES/CQRS/DDD](2026-06-12-migrate架構視角-ES-CQRS-DDD.md)（history bug＝投影技術事件非領域事件）。
- ✅ 切片邊界怎麼自動抓：**已答**——`--first-parent` mainline、一 merge/PR=一片（見上「四個常態破口」#1）。不靠 tag/commit-pattern 猜，靠 git 結構。
