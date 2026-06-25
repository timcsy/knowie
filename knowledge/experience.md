# 經驗

## 教訓

### 鐘擺失敗：從「措辭萬能」盪到「必須建 runtime」，跳過中間
- **理論說**：一個方法不行，就換一個更重的方法。
- **實際發生**：migrate 我先信「skill 措辭萬能」（改五版），失敗後直接盪到另一端「**必須建外部 harness/runtime**」。但跳過了中間最該試的——使用者一句「真需要 harness 嗎，還是你 skill 寫太爛」點破：(1) 我那五版 skill **自相矛盾**（叫 AI「別偷看結局」、又叫它「讀最終狀態做偵測/隔離」）→ **我根本沒試過一個會遮罩的 skill**；(2) 遮罩 **AI 在場能自己做**（per-slice 開乾淨 context 的 sub-agent ＝ 遮罩），不必外部 runtime。兩端（純措辭 / 純 runtime）我都摸到了，**中間沒摸**。
- **解決方式**：失敗時先問「**同一層、但做對，我試了沒？中間有沒有更便宜的選項？**」，而不是直接跳到最重的方案。具體：先寫「不矛盾 + AI 自我遮罩」的 skill（便宜），驗了再決定要不要 harness。
- **教訓**：一個方法失敗，**別預設要換更重的方法**——常是「同一層做對」還沒試。也呼應本檔「在場的 AI 自己做」（我跳到外部驅動器、正好違反它）。
- **來源**：migrate harness 設計後被使用者質疑 2026-06-12。

### 有些 bug 是執行層的，協議層（skill 措辭）解不了——別預設用措辭修
- **理論說**：skill 寫得夠清楚，AI 就會照做；再補一句措辭就能修好。
- **實際發生**：migrate 連改**五版**措辭（0.6.1–0.6.5：深版/隔離舊檔/檔名/structureVersion/replay/讀當時 knowledge/tool-agnostic），但 battle 真跑**還是非決定性 + 復發舊錯**（`history/001-early-lessons` 又進 history、沒重判）**+ 沒偵測到**。根因不是措辭——是 **AI 有整個 repo 存取權，會偷看結局（最終 knowledge/code），做 hindsight rationalization**。措辭擋不住偷看；自律修不了非決定性。三個角度（沒遮罩 / 偷看結局 / 舊 knowledge 原地混淆）指向同一結論。
- **解決方式**：停止再改 skill 措辭（邊際遞減、已證無效）。真解在**執行層**：(1) **遮罩 harness**（checkout per commit、物理上拿掉未來）；(2) **舊 knowledge/ 搬遷**（別原地讀寫）；(3) **機械偵測檢查**（抓得到錯，不靠 AI 自覺）。協議層（skill）描述「該怎樣」、執行層（harness）保證「真的這樣」。
- **教訓**：「[落實全壓在 skill 措辭](concepts/why沒有oracle.md)」有個上限——當 bug 是「AI 看到不該看的（結局/舊態）」，那是**執行層**的事，措辭保證不了。**先判一個 bug 是協議層還是執行層，別預設用措辭修。** 我自己連犯五版才被使用者點醒（協議層偏誤）。
- **來源**：battle 0.6.1–0.6.5 真跑 2026-06-12；使用者三則回饋（遮罩/偷看/舊 knowledge 混淆）。見 [draft/migrate時間軸replay](draft/2026-06-12-migrate時間軸replay.md)「執行層黑洞」。

### 驗證：決策轉移真的只從「往前播」長出來（snapshot 看不到）
- **理論說（賭注）**：把 git 史往前播、逐片疊，會長出 snapshot 法**結構上看不到**的「決策轉移」（`history/` 的精髓）；snapshot 看終局只看得到結果 Y，看不到 X→Y。
- **實際發生**：battle 真實跑 replay 版（migrate 0.6.3），history 長出**三條真實轉移**。最強一條（`002`）：X＝plan 原案「重建 submissions 表、移 content CHECK」→ 動手撞 `votes` FK + SQLite PRAGMA 在交易內 no-op → Y＝「保留 CHECK + 佔位值 + type 判別欄位」。**看最終 schema 永遠生不出這條**——只有讀到 plan 寫的 X、再走到反轉它的 commit，才看得到。賭注成立。
- **解決方式**：已是 migrate 的模型（切片 + 往前播 + 逐片疊，見 [draft/migrate時間軸replay](draft/2026-06-12-migrate時間軸replay.md)）；這條驗證了它最決定性的理由。
- **教訓**：有些知識（因果轉移）**結構上只在時間軸上可見**，從終局反推抓不到。這不只對 migrate——它說明 knowie 本該被**逐步**餵養（轉移在發生當下被捕捉），事後一次補只能靠 replay 補回。⏳ 仍待驗：**收斂性**（重跑兩次是否一致），這是 replay 模型欠的最後一個驗收。
- **來源**：battle replay-model 真實跑 2026-06-12（history 002 schema 反轉）。

### 遷移的價值在「用 git/specs 重建過去、分對層」，不是搬資料夾
- **理論說**：migrate 把舊結構搬成新結構（資料夾改名、三檔重塑）就完成了。
- **實際發生**：發佈後**第一次真實遷移**（battle 專案）——做了資料夾改名 + root/derived 原則 + `[]()` 連結（tech-stack 還留了 commit how-leg，git 時光機運作了），但 **`episodes/` 空、`concepts/` 稀疏、無 Key Extensions、`structureVersion` 沒 bump、`skills/` 沒建**。而 battle 的過去**明明在 git（M1–M3 commit）和 specs 裡**——migrate 走了捷徑、沒去重建。
- **解決方式**：把 git/spec **考古重建**從「歧義時的輔助」升成 migrate 的**核心**：走 git log+diff+specs 重建過去 → 分發到正確的層（**現場→episode、決策→history，別混**）→ 補完 canon。skill 措辭得**明確命令**做考古，否則 AI 合理地走捷徑（[why沒有oracle](concepts/why沒有oracle.md)：落實全壓在 skill 措辭）。
- **教訓**：遷移是**一次性把既有過去正確結晶的機會**；「richness 靠後續代謝長」**用錯地方**了——**未來**的新材料靠代謝，**過去**已在 git/specs 裡、該由 migrate 重建。留白 episodes ＝ 沒做完。
- **來源**：battle 真實遷移驗證 2026-06-12（發佈後第一個回饋）。

### 寫的人對自己寫的有「可見性錯覺」（靠機械掃描補，不靠記性）
- **理論說**：改了一個東西，相關的地方我自然會記得一起改。
- **實際發生**：反覆「改了 A、忘了改 B」，因 A/B 在不同段/不同檔，腦裡覺得「那塊改完了」——這 session **三次**：skills-README 還寫舊投影機制、`記憶系統` 缺 KE 路標（我自己加強最多、卻沒確認它被找得到）、README 結構表停在「四個子目錄」（skill 表改了、結構表沒）。都是「**實作改了、它某處的說明沒跟上**」。
- **解決方式**：靠 judge 的**機械掃描**（grep/ls：孤兒/死連結/KE/結構）補——`knowledge/` 內抓得到；`knowledge/` 外（README/docs vs code）是 gap，但那屬 **what-consistency、不該硬塞進 judge**（見下「why-lane 不掃 what-consistency」）。
- **教訓**：「我覺得改完了」不可信；一致性要**結構化檢查、不靠作者的可見性**。這是 judge「偵測既成脫節」那半（vs next 的預防）。
- **來源**：三次 judge 自我維護 2026-06-12。

### 反覆使用的隱性判準，會以為已固化、其實沒（它不是「新」，逃過捕捉）
- **理論說**：一個我一直在用的判準/教訓，當然早就在知識庫裡了。
- **實際發生**：兩條被反覆引用、卻從沒寫進真相源——「多條獨立推導＝真根」（引用 4 次才發現不在 [收斂](concepts/收斂.md)）、「可見性錯覺」（引用整個 session 才發現不在 experience）。**用熟了 → 以為固化了**，但它只活在「程序記憶」（怎麼做事），沒升進「語意記憶」（可引用的概念/教訓，見 [記憶系統](concepts/記憶系統.md)）。諷刺：兩條都是「怎麼維護知識庫」的 meta 判準——越貼身用，越忘了它沒被寫下。
- **為何逃過捕捉**：capture 兩條輸入線抓「新思考」和「做中學」；一個**一直在用、從不『新』**的隱性判準**沒有觸發**——它不像新洞見、也不像某次教訓，就是「預設操作」。它是 reconsolidation（外部鏡子）的反面：不是「重新理解舊的」，是「用熟的隱性判準從沒顯性化」。
- **解決方式**：catch ＝ **引用一個判準/教訓當「已知」（「見 X」「呼應 X」）時，先確認 X 真在知識庫裡**；不在 → 那是逃過捕捉的隱性判準 → 當場固化。（機械版：judge 可掃「引用某具名概念/教訓、卻無對應檔/標題」＝概念級 dangling reference，跟死連結同族。）
- **教訓**：盲點不只「漏記新東西」，還有「**太熟的舊判準從沒顯性化**」。
- **來源**：兩次 2026-06-12（收斂判準、可見性錯覺）。

### 在場的 AI 自己做，CLI 只給「AI 不在場」的自舉（反覆失敗模式）
- **理論說**：把功能包成 CLI 很自然——可測、可重跑、像個正經工具。
- **實際發生**：**反覆**把「AI 已在場、用自己的檔案工具就能做」的事塞進 CLI——健康儀表板（砍）、skill 安裝逼 CLI（改 AI 直接裝）、`installDomainSkills`（砍）、`knowie sync`（否決）。**四次同一個錯**。CLI 是「AI 還沒在場」的東西；在場還發明 CLI ＝ 多餘 + **逆協議非平台**（把行為從可攜的 skill markdown 搬進綁定的 runtime）。
- **解決方式**：判準——**行為住在 skill（markdown，AI 執行）；CLI 只留給「AI 不在場」的工具自舉**（`init`/`update` 裝 package skill）。可逆的動作（symlink／搬檔）AI 在場就自動做（延伸原則 5）。
- **教訓**：要加 CLI 前先問「**AI 現在在場嗎？在場就讓它做**」。這是我反覆犯、該被擋下的觸發（見 [收斂](concepts/收斂.md) 失敗模式）。
- **來源**：四次（2026-06），最近一次 domain skill symlink 投影否決 `knowie sync`。

### 外部框架（理論＋競品）是照出「stated-why ⊊ real-why」的鏡子
- **理論說**：知識從內部長——想出來（Thinking→draft）、做中學（Doing→回流）。
- **實際發生**：拿**外部框架當鏡子**照既有知識，抓到內部兩條線抓不到的：(1) **CALM 定理**照出延伸原則 6 的 real-why（單調化→協調自由）遠超 stated-why（可審計）；(2) **event sourcing/CQRS** 重新命名 history/三檔/蒸餾/根公理二，白送一套理論的詞彙與預測力；(3) 純演繹**預測**出 `history/NNN` 計數器 bug（沒踩到就抓到）；(4) **競品也是鏡子**——MiMoCode 照出「護城河是三軸非機制」、LLM Wiki 照出「人在環不獨特」（修正自我認知）。
- **解決方式**：把「外部鏡子」當**第三條輸入線**——不長新原料，而是**用外部參照重新處理既有知識**（＝認知科學的 **reconsolidation**：前兩條是 encoding，這條是 re-encoding；見 [記憶系統](concepts/記憶系統.md)）。理論與競品都算鏡子。
- **教訓**：knowie 號稱管 why，卻可能對自己原則的 real-why 有盲點；外部框架是照盲點的鏡子，尤其能把 judge 的「事後偵測」升級成演繹**預測**失敗。
- **來源**：多 agent 併發分析 2026-06-12（CALM/event-sourcing/NNN）+ 競品，見 `draft/多agent併發-git模型`、`draft/競品與生存空間`。

### 護城河是三軸（哲學），不是機制
- **理論說**：knowie 的賣點是 distill / dream / skill 這些記憶機制。
- **實際發生**：MiMoCode（小米）等大廠**獨立做出了**同一套機制（distill→skill、dream 代謝、SDD、markdown 記憶）並 production——機制是 table-stakes，不是差異化；當所有 agent 都自動記 what，光有機制等於跟風的弱複製。
- **解決方式**：對外錨在**三條哲學軸**——協議不平台（可攜、跨廠商）／人在環不全自動（人保定案主權）／why 不 what（三視角因果）。大廠全做反的恰是這三軸。
- **教訓**：機制會被趨同（那是驗證、不是護城河）；差異化在哲學選擇。競品越強，這三軸的對比越鋒利。
- **來源**：MiMoCode 對比 2026-06-11，見 `draft/競品與生存空間` 第六方。

### 整理的病根是「分類維度不正交」，不是資料夾命名
- **理論說**：知識難整理，是因為資料夾名稱不夠好。
- **實際發生**：research/design/history 同時混用「類型」和「時間」兩個不正交的軸，所以「舊的研究」永遠不知道該進哪——是結構在逼人做不可能的選擇。
- **解決方式**：改按概念（投影）組織；類型降為標記、時間降為狀態。
- **教訓**：整理不順時，先懷疑「分類軸正不正交」，而不是改名字。
- **來源**：設計討論 2026-06

### dump 進 vision = 維度坍縮
- **理論說**：討論完把結論寫進願景，省事。
- **實際發生**：一場討論的產出是跨三視角的（原則/路線/教訓/概念）；全塞 vision 會把原則埋掉、經驗走失。
- **解決方式**：寫入改成 分發——先拆「產出了哪幾種知識」，再各歸其位。回流（寫回 experience）同理，別坍縮。
- **教訓**：寫入是分發動作，不是傾倒動作 → 已結晶成母概念 [分發非傾倒](concepts/分發非傾倒.md)（固化／回流同理）。
- **來源**：設計討論 2026-06

### 被否決的方案是純金 why，只寫結論會丟掉它
- **理論說**：記下最後採用的結論就夠了。
- **實際發生**：討論中排除的選項（為什麼不選 A/B）是 why 密度最高的部分，卻最容易被「只寫結論」濾掉。
- **解決方式**：結論 + 「被排除的選項 + 理由」一起留（墓碑）。
- **教訓**：why 最濃的地方在「為什麼不」，不在「為什麼是」。
- **來源**：設計討論 2026-06

### Frame 三視角是寶藏，但「三」有硬要成分
- **理論說**：principles/vision/experience 完美對應 Frame 的 normative/situational/existential。
- **實際發生**：「三」可能是神學承諾（三位一體）；vision 其實偏「未來意圖」、不純是「當下處境」，對應約七八成。
- **解決方式**：認清三檔的承重牆是十幾個專案的經驗、不是 Frame；Frame 是事後解釋層。當它是對經驗開放的工作假設，不當教條。
- **教訓**：地基放在經驗驗證上，理論只是解釋——連三視角這條也服從「經驗能修訂根本原則」。
- **來源**：設計討論 2026-06

### experience 是最高流量的器官——最寶貴，也最需勤整理
- **理論說**：三檔地位對等。
- **實際發生**：experience 是唯一直接連到「執行」這個高頻活動的視角，所以更新最頻、長最快、最貼 ground truth。
- **解決方式**：回流預設寫 experience（合理），但加一道例外篩，把「挑戰原則 / 該改路線 / 新概念」分流出去。
- **教訓**：experience 寶貴正因為它流量大；它需要整理也正因為它流量大——同一事實的兩面。
- **來源**：設計討論 2026-06

### 成熟的設計該主動固化，「等使用驅動」會變成裹足不前
- **理論說**：captured ≠ committed，所以設計型 draft 要等真實使用驗證了才固化，沒驗過就先擺著最安全。
- **實際發生**：記憶動態這套已反覆討論磨穩，卻一直擺在 draft 不敢動手；結果拿半成品去試真實專案，反而讓別的專案 knowledge 也變半成品——保守本身成了風險。
- **解決方式**：把「captured ≠ committed」正確理解成「想清楚才 commit」，不是「永不 commit」。機制磨穩（能想清楚的部分）就固化進 skills/結構，讓產品先完整、再拿去測 domain 層。
- **教訓**：「等使用驅動」對根公理（不可逆）成立，對已磨穩的機制（可逆、可改）就成了拖延的藉口；分清哪些該等、哪些該動手。
- **精煉（2026-06-07）·固化 ≠ 外推**：成熟設計該**內部固化**（別裹足），但**工具自身穩之前別外推到別的專案**（會散播不穩定）；先當經驗者內省自評，churn 收斂後再外推。固化是 commit、外推是 deploy，兩回事。
- **來源**：本次固化（記憶動態 → skills），使用者指出「裹足不前、半成品互相傳染」；後補經驗者回流（外推時機）。現場 → [episode](episodes/2026-06-07-next規劃自己揭露召回盲點.md)。

### 人定案的閘門是 draft→roadmap，不可略過——連「去建」也要先走 roadmap
- **理論說**：設計磨穩了、人也說要建，就直接動手實作最快。
- **實際發生**：固化記憶動態時跳過 vision roadmap，直接 draft→實作→出列；它在 vision 裡以「已完成」現身，等於略過人在環閘門、也沒讓 next 驅動。使用者當場抓到「怎麼直接拿 draft 實作，沒進 vision？」。
- **解決方式**：設計型 draft 的正路是 **draft → roadmap（人定案、可被 next 拾起）→ 實作 → 兌現出列**。人說「固化／去建」是定案動作，但要落成 roadmap 項目走過閘門，不是跳過它。
- **教訓**：「主動固化」與「走過閘門」不衝突——前者反對拖延，後者反對抄捷徑；定案要快，但要走在軌道上。這條是 dogfood 抓到自己違反協議的實例。
- **已落實**：`knowie-next` 改成動手前先掃 `draft/` 找成熟項，並在最後選項問「要不要先把它進 roadmap 再開始」——把這個閘門從「靠人記得」變成「skill 主動提」。
- **來源**：本次固化記憶動態（redesign/protocol-skills），使用者抓到跳過 roadmap。

### roadmap 項要帶驗收 + 雙向連回設計 draft；draft 是「在建脈絡」留到完成才退場
- **理論說**：設計進了 roadmap，draft 任務就結束了，可以刪；roadmap 寫個標題即可。
- **實際發生**：我把設計寫進 roadmap 卻沒給 checklist（違反 knowie 自己「milestones 要有可驗收標準」），又想刪 draft——使用者抓到「為何沒 checklist？draft 為何刪？上下文怎麼找得到？」。
- **解決方式**：(1) roadmap 項一律帶 `- [ ]` 驗收清單（可機械驗）。(2) roadmap 項 ←→ draft **雙向連結**（可導航的真實路徑）。(3) draft **不在提升時刪**——它是「在建的設計脈絡」，蓋到一半要回看「當初為何這樣設計」；**留到 roadmap 完成才兌現出列**（現場→episodes、教訓→experience），那時才退場。judge 不可把「被 active roadmap 連到的 draft」當過時清掉。
- **教訓**：提升不是「draft 結束」，是「draft 進入在建狀態」；它的價值在建設中與回顧時才最高，所以連結要留、驗收要明、退場要等完成。
- **已落實**：寫進 `_core`／capture／judge §4·§5／next（roadmap 帶驗收 + 雙向連結 + draft 留到完成）。
- **來源**：本次把 draft 分發進 vision（redesign/protocol-skills），使用者抓到缺 checklist + 問 draft 去留。

### why 對齊的引擎是 next 的預防，不是 judge 的偵測
- **理論說**：judge 的深層職責是「給沒有 oracle 的 why 造 oracle」——對帳 code、抓出腐爛的 why，這是 knowie 的核心價值。
- **實際發生**：十幾個專案的真實使用裡，why 確實有跟上，但**主因是 next 在規劃時把規範餵進去（預防）**，讓 code 一開始就建對；judge 大多在做回流／記帳（更新願景 checklist、寫回設計、新增經驗），**很少真的「抓腐爛 why」**。
- **解決方式**：認對價值引擎——**next 的 feed-forward 預防**是已驗證的核心；judge 的 oracle 偵測是給「夠老、why 真的爛掉」的專案的賭注，還沒被驗（你的專案因 next 一直預防，why 沒機會爛）。兩者不衝突，但別把敘事壓在未驗的那個上。
- **教訓**：**預防 > 偵測**。knowie 已驗證能打的是 `next→spec` 的預防；judge 的 [why沒有oracle](concepts/why沒有oracle.md) oracle 是未驗賭注、不是賣點。
- **推論（2026-06-07）·next 只能預防 KB 裡記了的**：dogfood next 推「拿去外推」卻漏了「工具未穩別外推」這條——因為它不在 KB。**召回率 = KB 完整度**；經驗者腦中的約束不寫下來，next 就召不回（等於不存在）。
- **來源**：使用者十幾個專案真實使用回饋（2026-06-07）+ dogfood next 漏召回。現場 → [episode](episodes/2026-06-07-next規劃自己揭露召回盲點.md)。

### skill 該寫成判準，不是窮舉流程
- **理論說**：要完整，skill 就得列舉所有步驟與情況（cella 的 judge：Phase A/B、17 項檢查，約 400 行）。
- **實際發生**：重寫成「`_core` 共享核心 + 一頁判準」後，judge 約 45 行，dogfood 跑通（孤兒/死連結偵測有效，還揪出自己「複習偵測沒機械化」的缺口）。
- **解決方式**：完整性來自**生成式**（判準 + 不變量 + 根公理，讓 AI 推導），不是**窮舉**（列舉每種情況）；共享部分抽 `_core`、CLI 注入。
- **教訓**：skill 該像一頁判準，不像一本手冊——窮舉長且脆，判準短且跨處境；但「必要的繁瑣」（堵漏洞的機制）要留，只是壓成一句。
- **何時該加一個新 meta skill（判準）**：當它是「**distinct 且反覆的人類 invocation 意圖、而既有 skill 的框架沒服務到**」才 earn 得起；否則折進既有 skill 或砍。套三次：路線錯了→折進 judge（無 distinct invocation）；health→砍（與 judge 重複）；consolidate→加（人主動固化，既有沒服務）。（domain skill 的判準不同：recurrence → 程序自習得。）
- **來源**：這次重構（redesign/protocol-skills）+ judge 試跑 + consolidate（原 crystallize）決策。

### 同一編排實作兩遍必漂移——解法是單一 source + 委派，不是靠對齊警覺
- **理論說**：CLI 和 MCP 是兩個入口，各自實作 init/update 的編排很自然；小心點保持一致就好。
- **實際發生**：`knowie update` 在 `commands/update.js`（CLI）和 `mcp-server.js`（MCP）各寫一遍，漂了——MCP 那條忘了傳 language、兩條都沒裝 subdir README（README 是檔名/格式約定的唯一來源 → battle 的 history 套成日期前綴、draft 漏日期前綴）。順手審計又抓到同一病灶的近親：`CORE_FILES` 在 `mcp-server.js` 硬寫死兩次（改名會靜默讀舊檔）、`SUBDIR_READMES` 沒從 `SUBDIRS` 導出（加 subdir 要改兩處）、init 的 CLI/MCP 語言寫法分歧。
- **解決方式**：別逐個對齊（靠警覺撐不住），**消掉重複**——清單提到單一常數（`constants.js`）、編排抽共用函式讓 MCP handler **委派**而非各抄一份（CLI 包互動層、MCP 直呼非互動核心）。已做：抽 `installReadmes()` 兩端共用、`CORE_FILES`/`SUBDIR_READMES` 收斂進 constants、import 取代 inline。
- **教訓**：**重複的知識會獨立漂移**——同一份事實（清單／編排／約定）寫在兩處，改一處不會更新另一處，是時間問題不是機率問題。這是 [分發非傾倒](concepts/分發非傾倒.md) 的對偶：分發是「一份輸入別坍縮成一處」，這條是「一份事實別複製成多處」；兩者同根——**唯一真實來源**。約定本身若只活在一個會被繞過的地方（README 沒被 update 裝），等於沒有來源。
- **已落實**：fix/update（0.6.9）抽 `installReadmes` + 傳 language；後續修 `CORE_FILES`/`SUBDIR_READMES` 收斂。CLI/MCP 編排委派的較大重構 → [draft](draft/2026-06-12-CLI-MCP編排委派.md)。現場 → [episode](episodes/2026-06-12-CLI-MCP漂移審計.md)。
- **來源**：battle 缺 subdir README 的 bug（使用者問「為何沒 README」「我是用 update 做的」）+ 三路並行漂移審計（2026-06-12）。

### why-lane 不掃 what-consistency——一致性焦慮會誘 why-skill 越界顧 what
- **理論說**：judge 既然對帳一致性，把套件自己的「docs 對不對得上 code」（README/docs vs `SKILL_NAMES`/`SUBDIRS`/結構）也納進來掃很自然。
- **實際發生**：這 session 三次踩「改了機制、別處說明沒跟上」——skills-README 寫舊投影機制、記憶系統缺 KE 路標、README 結構表還寫「四子目錄」（漏 skills/）。前兩個在 `knowledge/` 內 judge 抓到了；第三個在 **README**，judge **掃不到**（judge 只掃 `knowledge/`）。一度想把 judge 擴成掃 docs-vs-code。
- **解決方式**：認清 lane——docs-vs-code 是 **what-consistency**（像 linter，歸 code/工具），不是 knowie 的 **why-lane**（見 [why沒有oracle](concepts/why沒有oracle.md)：what 歸 code）。把 judge 擴去掃它＝越界進 what。要補就用普通 grep 測試（optional、不擋 merge），不是 knowie 的 why-skill。
- **教訓**：知識庫的 why-lane 與工具的 what-lane 要分清；**一致性焦慮會誘使 why-skill 越界去顧 what，但那違反分工**。dogfood 的盲點（knowie 顧 `knowledge/`，但它自己的「套件 docs vs 套件 code」不在那迴圈裡、也不該靠 why-skill 顧）是**結構性 by-design，不是 bug**——它正好標出 knowie 的邊界在哪。
- **來源**：本 session 三次 docs 跟不上、第三次在 README judge 掃不到（consolidate 自 `draft/docs-code同步gap`，已退場）。

### projection 編輯不是 domain event——纏很久的 regression 缺的是範疇模型，不是更強措辭
- **理論說**：migrate replay 要忠實重現 git 每個 commit 做的事，包括作者對 `knowledge/` 的整理。
- **實際發生**：battle 真跑 migrate，切片 7 撞到 commit「experience.md 瘦身 — M1 教訓歸檔至 history/」，AI 把這個**純 `knowledge/` 維護 commit 當 domain 決策忠實重現**，又長出 `history/001-early-lessons`——這個 regression 從 0.6.2 用「quarantine 措辭」擋、纏到 0.6.10 還在。措辭防線一直擋不死。
- **解決方式**：换**範疇模型**而非更強措辭。ES 視角（[記憶系統](concepts/記憶系統.md)：git＝原始因果基底）：**git＝event log、`knowledge/`＝projection**。replay 是「從 **domain events**（code/spec/產品）**重建** projection」。只碰 `knowledge/` 的 commit ＝**舊 projection 的編輯**、不是 event → 不產 history 轉移（重播它＝拿過時的 view 更新疊到剛重建的 view 上＝範疇錯誤）。舊規則 curation 的**內容**在原始作者切片用**現規則**重判（教訓→experience），**搬移動作忽略**。判準：寫 history 前問「是專案的 why 變了，還是有人只是重組知識庫？」
- **教訓**：**有些 bug 不是措辭沒寫好，是缺一個結構性範疇區分**（domain event vs projection edit）。這是「[有些 bug 是執行層的、協議層解不了]」的姊妹——那條是「跳到對的層」，這條是「**留在協議層，但要對的範疇模型，不是更響亮的禁令**」。一個 regression 反覆用措辭擋不死 → 該懷疑缺的是模型不是字句。
- **來源**：battle 真跑 migrate 切片 7（2026-06-13），使用者截圖抓到 `001-m1-early-lessons` 又冒出。設計脈絡 ←→ [migrate時間軸replay](draft/2026-06-12-migrate時間軸replay.md)。

### 把 migrate 當冪等函數修是用錯標準——它是生成重建，不是可重擲函數
- **理論說**：migrate 跟 judge/capture 一樣是 knowie skill，所以也該收斂——「再跑近乎 no-op」，run-to-run 不一致就是 bug，用更精準的措辭逼它穩。
- **實際發生**：照這標準修了一長串（projection-edit／日期／墓碑…），但每跑 battle 又冒新差異；0.6.10 vs 0.6.12 同邏輯卻 history 組織天差地遠。打地鼠打不完、且沒有「修完」的信號。癥結：**judge/capture/next operate on 既有 knowledge（有界、可檢查、會收斂）；migrate 用 IRL 從 git 推不可驗證的 why**——而 [why 沒有 oracle](concepts/why沒有oracle.md)，所以它的產出**本質是抽樣、不是固定點**。拿冪等標準要求它是範疇錯誤。
- **解決方式**：認下 migrate 的本性＝**一次性生成重建 → 人策展（HITL）→ 維護**，不是冪等函數。差異分兩型：**第一型可定義範疇錯**（維護當決策、否決當轉移、今天當 git 日期）有正解 → 寫規則、會收斂、繼續修；**第二型本質判斷變異**（怎麼分組/命名/強調哪個 why）無單一正解 → **交 HITL 策展，不再用越來越細的措辭追**（追它就是[鐘擺失敗]）。品質閘＝good-enough + 人策展，不是 determinism。
- **教訓**：**不是所有 knowie skill 都該收斂**——收斂屬於「整理既有」的 skill；「推不可驗證 why 的生成重建」本質非冪等，硬追 determinism 會無止境打地鼠。先分清一條產出該不該收斂，再決定用規則還是 HITL。
- **來源**：本 session migrate 修復長弧 + 0.6.10/0.6.12 兩跑變異 + 收斂會計討論（2026-06-13，使用者拍板「偏向認下一次性重建」）。設計脈絡 ←→ [migrate時間軸replay](draft/2026-06-12-migrate時間軸replay.md)。

### 在不確定狀態上做破壞性操作，會把小坑挖成大洞——異常先疑自己、別腦補陰謀
- **理論說**：工具輸出看起來怪怪的，一定是有什麼特殊狀況（甚至外部攻擊）；先處理眼前的事、邊做邊查就好。
- **實際發生**：一次 `Write` 只寫進 1 行（沒寫全），我**當下沒驗證實際寫入**就往下走；接著看到殘缺/被截斷的工具輸出，我**編了一套「prompt injection」陰謀論**而不是先懷疑自己的工具；然後在**沒先確認當前分支**的迷霧裡，在 `main` 上 `git commit --amend`（把改動 squash 進 merge commit）+ `reset --hard` + push，把「檔案沒寫全」的小坑放大成「污染 main 歷史」的大洞；再信任攪亂的多行輸出反覆「以為已 SYNCED」，直到使用者給 IDE 截圖（外部 ground truth）才戳破。
- **解決方式**：三條紀律。(1) **異常輸出 → 預設懷疑自己的工具，不是外部陰謀**——把不確定降級成「我大概哪裡做錯了，重驗」，而不是升級成戲劇。(2) **不確定的狀態上絕不做破壞性/難復原操作**（amend／reset --hard／push）——動之前先用**單一指令**確認 branch + HEAD；尤其「在 main 上絕不 amend」。(3) **驗證靠 ground truth，不靠自己看到的 narrative**——單一指令、IDE graph 可信；複合多行輸出 + 腦補不可信（這次複合 bash 輸出會被攪亂，逐項單一指令才驗得準）。
- **教訓**：**Write/操作之後立刻驗實際結果**（行數/diff/branch），小錯當下抓就不會滾雪球；**迷霧中前進是把小問題放大的主因**——停、用可信來源確認、再動。這是 [讓認錯變便宜](concepts/讓認錯變便宜.md) 的失敗實例（在 injection 陰謀論上越走越遠＝認錯太慢）+ [why沒有oracle](concepts/why沒有oracle.md)「靠機械驗證不靠記性」的延伸，也是「可見性錯覺」的近親（信任了自己看到的輸出）。
- **來源**：本 session OKF capture 時的操作失誤（2026-06-24，使用者給 IDE 截圖戳破我誤判的「已同步」）。注意：「bash 複合輸出被攪亂」可能是該 session 偶發的環境問題，普遍可遷移的是上述三條紀律。

## 關鍵延伸（主題觸發必讀）

| 觸發關鍵字 | MUST 讀 |
|---|---|
| 命名 / 捕捉非發明 / 私語 / 批次結晶 | `concepts/蒸餾.md` |
| 必要繁瑣 vs 冗餘 / 落實 / 機率性執行者 | `concepts/why沒有oracle.md` |
| 寫入 / 固化 / 回流 / 維度坍縮 / dump 進 vision / 唯一真實 / 重複漂移 | `concepts/分發非傾倒.md` |
| 認知失調 / 路線錯了 / 認錯 / 失敗模式 / 合理化維持 / 破壞性操作 / 異常輸出 / 確認分支 | `concepts/讓認錯變便宜.md` |
| migrate / replay / projection 編輯 / 範疇錯誤 / event sourcing | `concepts/記憶系統.md` + `draft/2026-06-12-migrate時間軸replay.md` |
