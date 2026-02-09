# 開發紀錄 (Development Log) - PDF2PPT 部署與優化

## 1. 任務目標
將 PDF2PPT 專案推送到 GitHub 並成功部署至 GitHub Pages，確保在線環境可正常執行。

## 2. 失敗紀錄與原因分析

### 2.1 404 Resource Not Found (資源載入失敗)
- **問題描述**：部署後開啟頁面，瀏覽器 Console 回報 `Failed to load resource: the server responded with a status of 404 ()`。
- **原因分析**：
    1. **絕對路徑問題**：Vite 預設構建使用絕對路徑（如 `/assets/...`），在 GitHub Pages 的子目錄環境下（`https://user.github.io/repo/`）會找不到資源。
    2. **無效檔案引用**：`index.html` 中引用了 `index.css`，但專案目錄中並不存在此檔案（樣式已內嵌在 HTML 內）。
    3. **引用未使用的腳本**：`index.html` 尾部引用了空的 `/index.tsx`，且路徑使用了根目錄絕對路徑。

### 2.2 瀏覽器測試工具初始化失敗
- **問題描述**：`browser_subagent` 在執行自動化測試時回報 `$HOME environment variable is not set`。
- **原因分析**：當前系統環境限制導致 Playwright 無法正確啟動。
- **矯正措施**：改以手動檢查檔案路徑邏輯，並提供 Check-list 供使用者進行最後驗證。

## 3. 矯正措施與實作紀錄

### 3.1 修復路徑與引用 (2026-02-09)
- **措施 A**：修改 `vite.config.ts`，將 `base` 設定為 `./`（相對路徑），增加對不同部署環境的相容性。
- **措施 B**：從 `index.html` 中移除無效的 `index.css` 引用。
- **措施 C**：修正 `index.html` 中的 script 標籤，確保符合構建後的路徑結構。

### 3.2 檔案整理與精簡 (2026-02-09)
- **措施 D**：識別出 `App.tsx` 與 `index.tsx` 為空檔案，且專案邏輯主要存在於 `index.html` 的集成內。
- **後續計畫**：根據 MECE 原則，評估是否移除這些冗餘檔案或將邏輯遷移至 React 元件。

## 4. 驗證與測試流程 (SOP 實踐)
1. **構建驗證**：運行 `npm run build` 檢查是否產生正確的 `dist` 目錄。
2. **路徑檢查**：確認 `dist/index.html` 中的資源引用是否皆為 `./assets/...` 形式。
3. **部署確認**：將 `dist` 推送至 `gh-pages` 分支。
4. **人工測試項目 (待確認)**：
    - [ ] 頁面標題正確顯示。
    - [ ] 外部庫 (PDF.js, PptxGenJS, Tailwind) 成功載入（無 404）。
    - [ ] 點擊「PDF 解析區」可正常觸發檔案選擇。

## 5. 檔案整理與整合 (MECE)
- **核心邏輯**：整合於 `index.html` (HTML/CSS/JS)。
- **外部服務**：`services/geminiService.ts` (API 整合)。
- **設定檔**：`package.json`, `tsconfig.json`, `vite.config.ts` (構建工具)。
- **說明文件**：`README.md`, `DEV_LOG.md`。
