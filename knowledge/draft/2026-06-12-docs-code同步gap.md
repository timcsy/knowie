# gap：說明文件 vs code/結構 的脫節，judge 掃不到

> 2026-06-12。problem 型 draft。
> 怎麼冒出來的：這 session **第三次**踩到「改了機制/內容、它在別處的說明沒跟上」——(1) skills-README 還寫舊投影機制、(2) 記憶系統缺 KE 路標、(3) README 結構表還寫「四個子目錄」（漏 skills/）。前兩個在 knowledge/ 內、judge 抓到了；第三個在 **README**、judge **掃不到**。

## 問題
judge 掃 `knowledge/` 的內部一致性（孤兒/死連結/KE/draft↔vision…），但**不掃**「knowie 的**套件說明文件**（README / docs/ / templates）有沒有跟**套件 code**（`SKILL_NAMES` / `SUBDIRS` / 結構）對上」。→ 這類脫節**靜默累積**（README 結構表停在 4 子目錄、docs/ 停在 4 skill+舊結構兩個月）。

## 根：可見性錯覺，跨 knowledge↔docs↔code 邊界
同 experience「寫的人對自己寫的有可見性錯覺」——改 A（skill 表/機制）忘了改 B（結構表/README），因為 A、B 在不同段/不同檔，腦裡覺得「那塊改完了」。三次同一模式，**都是「實作改了、它的某處說明沒跟上」**。

## Scoping（誠實的關鍵：別過度擴張 judge）
- **使用者專案**：「docs 對不對得上 code」是 **what-consistency**（像 linter），**不是 knowie 的 why-lane**（見 [why沒有oracle](../concepts/why沒有oracle.md)：what 歸 code/工具）。→ **不該**是 knowie 的事；把 judge 擴成「掃任何專案的 docs-vs-code」＝越界進 what。
- **knowie 自己的 repo**：套件 docs（README/docs/templates）vs 套件 code（constants）脫節，是**真實的維護 gap**——但它是 **knowie-repo 自己的維護問題**，最好用 **repo 專屬的機械檢查/測試**解，不是做成 knowie 的 skill 功能。
- → dogfood 的邊界現形了：**knowie dogfood 維護的是 `knowledge/`，但它自己的「套件 docs vs 套件 code」不在那個迴圈裡**（也不該靠 knowie 的 why-skill 來顧）。

## 便宜的解（若要做，限 knowie repo）
一個 grep 測試：docs/README 出現的 skill 名必須 ∈ `SKILL_NAMES`、子目錄名必須 ∈ `SUBDIRS`、skill 數字與 `SKILL_NAMES.length` 一致。CI/pre-commit 跑，純機械、冪等。**不進 judge skill**（judge 顧 why；這顧 what）。

## 出口
- **設計已清**：gap 真實、但**正確的家是 knowie-repo 的 lint/test，不是 knowie 的使用者功能**（守 why-lane）。
- 待決（build 決定，小）：要不要在 knowie repo 加那個 grep 測試。**不擋 merge**（這 session 已手動修齊三處）。
- 連動：強化 experience「可見性錯覺」（這是第三個數據點）；[判準式 judge 顧 why 不顧 what](../concepts/why沒有oracle.md) 的邊界又一例。
