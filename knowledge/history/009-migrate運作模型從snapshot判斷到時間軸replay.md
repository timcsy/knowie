# 009：migrate 運作模型 — 從 snapshot 判斷到時間軸 replay（且認下非冪等）

> 2026-06-12～13。一條運作模型的決策轉移（不是改名，是「migrate 怎麼運作」整個換掉）。由 battle 真實遷移反覆回饋驅動（0.6.3→0.6.13）。

## 轉移
- **舊（superseded）**：migrate ＝ **看最終狀態、一次性整體判斷**（snapshot judgment）。早期 migrate 直接讀 final knowledge/code，往回合理化、整批判斷該怎麼分層。
- **新（current）**：**順 git 往前播、逐片疊、遮罩未來、跑真代謝**（時間軸 replay）。每片在乾淨 sub-agent 跑真 capture/consolidate、攜帶累積 base；切片按 `--first-parent`；採用點為相位邊界；日期一律用 git 當時日期。**並認下 migrate 的本性＝一次性生成重建 + HITL 策展 + 維護，非冪等函數。**

## 為什麼變
1. **snapshot 不可重現、抓不到 transition**：一個巨大判斷 = 高變異，每跑長出實質不同的庫；且看終局只見 Y、永遠看不到 X→Y——而 transition 是 `history/` 的精髓，只在往前播時可見。
2. **遮罩未來才推得出真 why**：看了結局只會合理化結局（hindsight）；遮住未來往前走，才是 inverse-RL 從軌跡推意圖。in-session 自我遮罩已驗擋住 `001-early-lessons` 那類 regression（跨兩跑不復發）。
3. **認下非冪等（2026-06-13 拍板）**：migrate 用 IRL 推不可驗證的 why（[why 沒 oracle](../concepts/why沒有oracle.md)）→ 產出是抽樣不是固定點。run-to-run 變異分兩型：第一型範疇錯（projection-edit／墓碑／日期）有正解→規則→收斂；第二型判斷變異→交 HITL，不追 determinism。**收斂非 migrate 的品質閘**——這修正了「migrate 該像 judge 那樣冪等」的錯誤預期。

## 被否決/保留的選項
- **純措辭修（skill 寫更細就好）**：盪過頭、自相矛盾（叫 AI 別偷看又叫它讀終局）→ 否決。見 experience「鐘擺失敗」。
- **外部遮罩 harness（runtime）**：列為最後手段，**非必要**——in-session 自我遮罩已夠擋第一型 regression。
- **追求冪等/同版連跑證收斂**：降為 optional（想量第一型殘差才做），不再 gating——因已認下非冪等本性。

## 狀態
✅ 模型已建進 `/knowie-migrate`（0.6.3→0.6.13）、battle 真跑驗核心（真 transition 長出來、projection-edit regression 消失）。本性框寫進 SKILL 頂部。**roadmap 項仍 in-flight**（真實舊專案的廣度驗證未完），故 [replay 設計 draft](../draft/2026-06-12-migrate時間軸replay.md) 及衛星留作在建脈絡、未退場。

## Pointer
- 設計脈絡：[時間軸replay](../draft/2026-06-12-migrate時間軸replay.md)（幅射到 [預期問題](../draft/2026-06-12-migrate預期問題.md)／[架構視角 ES/CQRS/DDD](../draft/2026-06-12-migrate架構視角-ES-CQRS-DDD.md)／[遮罩harness](../draft/2026-06-12-遮罩harness設計.md)）
- 教訓：experience「決策轉移只從往前播長出來」、「projection 編輯不是 domain event」、「把 migrate 當冪等函數修是用錯標準」
- how-leg：CHANGELOG 0.6.3–0.6.13、`skills/knowie-migrate/SKILL.md`
- 前一條結構決策：[008 update→migrate 更名](008-update-skill更名migrate.md)（那是改名；本條是換運作模型）
