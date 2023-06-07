# PhotoClassic

### 由於Discord已經在搜尋功能推出「搜尋具有圖片」功能<br>
### 而這功能相較這專案的方法更為方便，所以這專案不再進行開發

這是讓Discord也能像Line一樣有瀏覽所有照片功能的專案。<br>
這個專案主要是為單一伺服器設計。

## 實現方法：
* 使用`Discord API` + `Vue3 + Vite` ，取得資料再由另外設計的網頁呈現。
* 後端是由`Express.js`框架建置，呼叫`Discord API`。
* 需要`Discord bot`搭配使用

---

## 設置

需要新增`.env`檔並加入以下內容
```env
# 伺服器port號，預設：5000
PORT=5000
# 機器人token
BOT_TOKEN=YOUR_BOT_TOKEN
# 要取得照片的伺服器
GUILD_ID=
# 單次請求最大訊息量(0~100)，預設：100
MAX_MESSAGES_COUNT=100
# 單次請求最少須獲得的檔案數量(超過請求次數仍未到達指定數量時，將不會繼續請求)，預設：20
MIN_FILE_COUNT=20
# 單次請求中不足MIN_FILE_COUNT時，最大重複請求次數(最多5次)，預設：3
MAX_AGAIN_REQUEST_COUNT=3
# 重複發出請求間隔時間(單位ms)，預設：250
REQUEST_INTERVAL=250
```
**由於`Discord API`有呼叫速度、次數限制，所以取得照片速度會有所限制。**
