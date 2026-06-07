# why 沒有oracle（Why Has No Oracle）

> knowie 的戰場與領域特性。

開發知識最大的特性：有 ground truth（code）可對帳。但這把 what 和 why 分成了兩種命運。

## what vs why
- **what 過時，有oracle**：code 改了不一致，編譯器紅、測試掛——現實立刻打臉。
- **why 過時，沒oracle**：當初「為什麼這樣設計」的理由不成立了，**沒有任何東西會報錯**。why 不能編譯，只會靜靜誤導你，而且腐爛的 why 會持續生出錯誤的 what。

## 推論
- **knowie = code 的補集**：不搶 what（讓 code 當真相），專守沒有 oracle、最危險的 why。
- **judge 的深層職責 = 給 why 造它天生缺的 oracle**：用 code 側面驗證 why 是否還站得住。

## ⚠️ 實證修正（2026-06-07）：預防 > 偵測
十幾個專案的真實使用顯示：why 能跟上，**主因是 next 在規劃時把規範餵進去（feed-forward 預防），不是 judge 事後對帳 code（偵測）**。judge 的「造 oracle」是給「夠老、why 真的爛掉」的專案的**設計賭注，尚未被驗**；預防讓 why 沒機會爛，所以 oracle 很少觸發。→ 已驗證的價值引擎是 next 的預防；judge oracle 是補集裡的補集。見 experience「why 對齊的引擎是 next」。

## 必要繁瑣 vs 冗餘
因為 knowie 是給「機率性執行者（AI）」的協議，落實 全壓在 skill 措辭上。判準：
- **砍了它，AI 能不能「悄悄」違反某條精神而不被抓到？** 能 → 必要繁瑣（留）；不能 → 冗餘（砍）。
- **表演**（給人看「看起來有做」）= 冗餘；**證據**（可驗證有做）= 必要。
- 必要繁瑣 ≠ 冗長文字：機制要在，描述壓到一句。

## 相關
[協議非平台](協議非平台.md)、[收斂](收斂.md)
