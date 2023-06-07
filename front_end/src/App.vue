<template>
  <nav>
    <ul @click="bigImagesObject.isOpen = false">
      <li :value="item" v-for="(item, index) in guildChannelsDataObject.guildChannelsId" :key="index"
        @click="getImgDataArray(item, controllerPrototype.selectedFileType)"
        :class="{ active: item === controllerPrototype.oldChannelId }">
        {{ guildChannelsDataObject.guildChannelsName[index] }}</li>
    </ul>
  </nav>
  <main>

    <div class="img-box" v-show="controllerPrototype.selectedFileType === 'image'">
      <div class="img-box-content" v-for="(item, index) in imagesObject.imgSrc" :key="item.index" @click="showDetail({
        id: imagesObject.id[index],
        url: item,
        fileName: imagesObject.fileName[index],
        userName: imagesObject.imgAuthorUsername[index],
        time: imagesObject.imgTimestamp[index],
        index: index
      })">
        <img :src="item" :alt="imagesObject.imgAuthorUsername[index]" />
      </div>
      <div class="img-box">
        <button name="request-button" type="button"
          @click="getImgDataArray(controllerPrototype.selectedChannelId, controllerPrototype.selectedFileType, controllerPrototype.oldestMessageId)"
          v-if="!controllerPrototype.isOldestMessageId"
          :class="{ inRequesting: buttonState.isOnClick || buttonState.isRequesting }">載入更多</button>
        <button name="request-button" class="not-before-file" type="button" v-else>沒有更舊的圖片啦~</button>
      </div>
    </div>
    <div id="big-image-container" v-show="bigImagesObject.isOpen">
      <div class="top-box">
        <div name="detail-text">
          <h3>{{ bigImagesObject.imgAuthorUsername }}</h3>
          <p>{{ bigImagesObject.imgTimestamp }}</p>
        </div>
        <button type="button" name="close-button" @click="bigImagesObject.isOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-x-lg"
            viewBox="0 0 16 16">
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        </button>
      </div>

      <button type="button" name="left-buttom" @click="imagesButtomController(0)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
        </svg>
      </button>
      <div name="big-img-box" :style="{ backgroundImage: 'url(' + bigImagesObject.imgSrc + ')' }">
      </div>
      <button type="button" name="right-buttom" @click="imagesButtomController(1)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
      <div name="button-box">
        <button ref="copyFileButtonTag" type="button" name="images-copy-link-button"
          v-clipboard:copy="bigImagesObject.imgSrc" v-clipboard:success="onLinkCopySuccess"
          v-clipboard:error="onLinkCopyError">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
            <path
              d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
            <path
              d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
          </svg>
        </button>
        <button ref="downloadFileButtonTag" type="button" name="images-download-button"
          @click="downloadFile(bigImagesObject.imgSrc, bigImagesObject.fileName)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path
              d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path
              d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat"
          viewBox="0 0 16 16">
          <path
            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
        </svg>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'



/**
 * 彙整好的images訊息
 */
const imagesObject = reactive({
  /**
   * 圖片訊息id
   */
  id: [],
  /**
   * 圖片url
   */
  imgSrc: [],
  /**
   * 檔案名稱
   */
  fileName: [],
  /**
   * 傳送圖片的使用者
   */
  imgAuthorUsername: [],
  /**
   * 傳送圖片的時間
   */
  imgTimestamp: []
})

/**
 * 放大圖的資料
 */
const bigImagesObject = reactive({
  id: "",
  imgSrc: "",
  fileName: "",
  imgAuthorUsername: "",
  imgTimestamp: "",
  index: 0,
  isOpen: false,
  downloadUrl: ""
})

/**
 * 所取得之頻道資料object
 */
const guildChannelsDataObject = reactive({
  /**
   * 所取得之所有頻道Id
   */
  guildChannelsId: [],
  /**
   * 所取得之所有頻道名稱
   */
  guildChannelsName: []
})

/**
 * 控制處理流程的各項屬性
 */
const controllerPrototype = reactive({
  /**
   * 當前所選擇之頻道Id
   */
  selectedChannelId: guildChannelsDataObject.guildChannelsId[0],
  /**
   * 當前所選擇之檔案類型
   */
  selectedFileType: "image",
  /**
   * 目前請求中最舊的訊息ID
   */
  oldestMessageId: "",
  /**
   * 紀錄上次請求的頻道ID
   */
  oldChannelId: "",
  /**
   * 是否為最舊的訊息ID
   */
  isOldestMessageId: false,
  /**
   * 是否還在載入中(未使用)
   */
  isLoading: false
})

/**
 * 載入更多的按鈕狀態
 */
const buttonState = reactive({
  /**
   * 是否還在請求中
   */
  isRequesting: false,
  /**
   * 是否已按下
   */
  isOnClick: false
})

/**
 * 複製連結按鈕Button Tag
 */
const copyFileButtonTag = ref(null)
/**
 * 複製連結按鈕Input Tag
 */
const copyFileInputTag = ref(null)
/**
 * 下載圖片按鈕A Tag
 */
const downloadFileATag = ref(null)
/**
 * 下載圖片按鈕Button Tag
 */
const downloadFileButtonTag = ref(null)

onMounted(() => {
  copyFileButtonTag.value
  downloadFileATag.value
  downloadFileButtonTag.value
})

async function getImgSrc(selectedChannelId) {
  const messageObject = await axios({
    method: 'post',
    url: 'http://minichihub.com:5000/getSelectedChannelMessage',
    data: {
      channelId: selectedChannelId
    }
  })
  return messageObject
}

//需要解決後端拋出429錯誤時的處理及回應
async function getSelectedChannelGoalTypeFile(selectedChannelId, type, messageId) {
  // console.log(messageId);
  if (messageId === undefined || messageId === "" || messageId === null) {
    messageId = null
  }
  const messageObject = await axios({
    method: 'post',
    url: 'http://minichihub.com:5000/getSelectedChannelGoalTypeFile',
    data: {
      channelId: selectedChannelId,
      fileType: type,
      oldestMessageId: messageId
    }
  },
    {
      catch: true
    }).catch(error => {
      console.error(error);
    })
  // console.log(messageObject.data.messageObject);
  return messageObject
}

/**
 * 取得該伺服器所有頻道
 */
async function getGuildChannels() {
  const channelsObject = await axios({
    method: "GET",
    url: "http://minichihub.com:5000/getGuildChannels"
  })
  return channelsObject
}

/**
 * 
 */
const imageUrlToBase64 = async (url) => {
  const imageBase64Code = await axios({
    method: "POST",
    url: "http://minichihub.com:5000/imageUrlToBase64",
    data: {
      imageUrl: url
    }
  })
  return imageBase64Code
}

/**
 * 取得圖片src的陣列
 * @param {String} selectedChannelId 輸入以選擇的頻道ID
 * @todo 測試是否能正常更新圖片
 */
const getImgDataArray = async (channelId, fileType, messageId) => {
  // console.log(buttonState.value.isOnClick);

  // 檢查是否在請求中或已經按下請求
  // if (buttonState.isRequesting || buttonState.isOnClick) return null
  buttonState.isOnClick = true
  // console.log(buttonState.value.isOnClick);

  let backEndMessageObject = {
    id: [],
    fileName: [],
    url: [],
    authorUserName: [],
    timestamp: [],
    oldestMessageId: "",
    status: 0,
    statusText: ""
  }
  // console.log(messageId);
  //設定目前選擇的頻道ID
  controllerPrototype.selectedChannelId = channelId
  //在請求同一個頻道時，並不是獲取新圖片，則不會發出新的請求
  if (channelId === controllerPrototype.oldChannelId && (messageId === undefined || messageId === "" || messageId === null)) {
    return null
  }

  //如果請求的頻道改變，則清除獲取的舊訊息ID
  if (channelId != undefined || channelId != "" || channelId != null) {
    if (channelId != controllerPrototype.oldChannelId) {
      controllerPrototype.oldestMessageId = ""
      controllerPrototype.isOldestMessageId = false
      buttonState.isOnClick = false
    }
  }

  //如過已經為最後的訊息ID則不再進行請求
  if (controllerPrototype.isOldestMessageId) return null

  //發出請求
  const imgDataArray = await getSelectedChannelGoalTypeFile(channelId, fileType, messageId)
  if (imgDataArray.data.messageObject.status != 200) return

  //判斷是否已經是最舊的圖片
  if (imgDataArray.data.messageObject.oldestMessageId === controllerPrototype.oldestMessageId ||
    imgDataArray.data.messageObject.oldestMessageId === undefined ||
    imgDataArray.data.messageObject.oldestMessageId === "" ||
    imgDataArray.data.messageObject.oldestMessageId === null
  ) {
    // console.log("已經沒有更舊的圖片了")
    controllerPrototype.isOldestMessageId = true
    buttonState.isOnClick = false
    if (channelId === controllerPrototype.oldChannelId) return
    imagesObject.id = []
    imagesObject.imgSrc = []
    imagesObject.fileName = []
    imagesObject.imgAuthorUsername = []
    imagesObject.imgTimestamp = []
    return
  }

  // 設定狀態為請求中
  buttonState.isRequesting = true

  backEndMessageObject = {
    id: imgDataArray.data.messageObject.id,
    fileName: imgDataArray.data.messageObject.fileName,
    url: imgDataArray.data.messageObject.url,
    authorUserName: imgDataArray.data.messageObject.authorUserName,
    timestamp: imgDataArray.data.messageObject.timestamp,
    oldestMessageId: imgDataArray.data.messageObject.oldestMessageId,
    status: imgDataArray.data.messageObject.status,
    statusText: imgDataArray.data.messageObject.statusText
  }

  backEndMessageObject = await getGoalTypeFileReplenish(backEndMessageObject, 24, channelId, fileType, backEndMessageObject.oldestMessageId)
  console.log("backEndMessageObject.status : ", backEndMessageObject.status);
  if (backEndMessageObject.status != 200) return
  // 該頻道的第一次請求，直接替換資料
  if (messageId === undefined || messageId === "" || messageId === null) {
    imagesObject.id = backEndMessageObject.id
    imagesObject.imgSrc = backEndMessageObject.url
    imagesObject.fileName = backEndMessageObject.fileName
    imagesObject.imgAuthorUsername = backEndMessageObject.authorUserName
    imagesObject.imgTimestamp = backEndMessageObject.timestamp
    controllerPrototype.oldestMessageId = backEndMessageObject.oldestMessageId
    controllerPrototype.oldChannelId = channelId
  } else {
    //同頻道的更新請求，在原有資料上加入新的資料
    imagesObject.id = imagesObject.id.concat(imgDataArray.data.messageObject.id)
    imagesObject.imgSrc = imagesObject.imgSrc.concat(imgDataArray.data.messageObject.url)
    imagesObject.fileName = imagesObject.fileName.concat(imgDataArray.data.messageObject.fileName)
    imagesObject.imgAuthorUsername = imagesObject.imgAuthorUsername.concat(imgDataArray.data.messageObject.authorUserName)
    imagesObject.imgTimestamp = imagesObject.imgTimestamp.concat(imgDataArray.data.messageObject.timestamp)
    controllerPrototype.oldestMessageId = imgDataArray.data.messageObject.oldestMessageId
    controllerPrototype.oldChannelId = channelId
  }

  buttonState.isRequesting = false
  buttonState.isOnClick = false
  // console.log(buttonState.value.isOnClick)
  // console.log(oldestMessageId.value);
}


const getGoalTypeFileReplenish = async (messageObject, fileCount, channelId, fileType, messageId) => {
  let maxRequestCount = 2
  while (messageObject.id.length <= fileCount) {
    if (maxRequestCount == 0) break
    let beforeMessageObject = await getSelectedChannelGoalTypeFile(channelId, fileType, messageId)
    if (beforeMessageObject.data.messageObject.oldestMessageId === messageId ||
      beforeMessageObject.data.messageObject.oldestMessageId === undefined ||
      beforeMessageObject.data.messageObject.oldestMessageId === "" ||
      beforeMessageObject.data.messageObject.oldestMessageId === null
    ) {
      controllerPrototype.isOldestMessageId = true
      break
    }
    messageObject = {
      id: messageObject.id.concat(beforeMessageObject.data.messageObject.id),
      fileName: messageObject.fileName.concat(beforeMessageObject.data.messageObject.fileName),
      url: messageObject.url.concat(beforeMessageObject.data.messageObject.url),
      authorUserName: messageObject.authorUserName.concat(beforeMessageObject.data.messageObject.authorUserName),
      timestamp: messageObject.timestamp.concat(beforeMessageObject.data.messageObject.timestamp),
      oldestMessageId: beforeMessageObject.data.messageObject.oldestMessageId,
      status: beforeMessageObject.data.messageObject.status,
      statusText: beforeMessageObject.data.messageObject.statusText
    }
    controllerPrototype.oldChannelId = channelId
    maxRequestCount -= 1
    await sleep(500)
  }
  return messageObject
}

/**
 * 取得頻道Object，只留文字頻道，且顯示圖片
 */
const getChannelsDataArrayAndShow = async () => {
  let firstIndex = 0
  const guildChannelsData = await getGuildChannels()
  for (const key in guildChannelsData.data.channelsObject) {
    if (guildChannelsData.data.channelsObject[key].type === 0) {
      guildChannelsDataObject.guildChannelsId.push(guildChannelsData.data.channelsObject[key].id)
      guildChannelsDataObject.guildChannelsName.push(guildChannelsData.data.channelsObject[key].name)
      if (firstIndex === 0) {
        // defaultChannelsId.value = data.data.channelsObject[key].id
        getImgDataArray(guildChannelsData.data.channelsObject[key].id, "image")
        firstIndex++
      }
    }
    // console.log(data.data.channelsObject[key].id);
  }

}


getChannelsDataArrayAndShow()


/**
 * 延遲器
 * @param {number} ms 延遲時長(ms)
 * @returns 無內容，僅設定延遲
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期
 * @param {string} dateString 要格式化的日期字串
 * @returns 已格式化的日期字串
 */
const formatDate = (dateString) => {
  const dateValue = new Date(dateString)
  /**
   * 小於10補零
   * @param {number} number 
   * @returns 補0的數字字串或原來的數字字串
   */
  const zeroReplenish = (number) => {
    if (number < 10) return `0${number}`
    return number
  }
  return `${dateValue.getFullYear()} 年 ${zeroReplenish(dateValue.getMonth() + 1)} 月 ${zeroReplenish(dateValue.getDate())} 日 ${zeroReplenish(dateValue.getHours())}:${zeroReplenish(dateValue.getMinutes())}:${zeroReplenish(dateValue.getSeconds())}`
}

/**
 * 大圖上的圖片詳細訊息
 * @param {{id: String, url: String, fileName: String, userName: String, time: String, index: Number}}
 */
const showDetail = ({ id, url, fileName, userName, time, index, }) => {
  // console.log(id, url, userName, time);
  bigImagesObject.id = id
  bigImagesObject.imgSrc = url
  bigImagesObject.fileName = fileName
  bigImagesObject.imgAuthorUsername = userName
  bigImagesObject.imgTimestamp = formatDate(time)
  bigImagesObject.index = index
  bigImagesObject.isOpen = true
  // bigImagesObject.value.downloadUrl = imageUrlToBase64(url)
}

/**
 * 大圖控制按鈕方法
 * @param {number} value 0或1控制上一張及下一張
 */
const imagesButtomController = (value) => {
  const dataObject = (num) => {
    bigImagesObject.id = imagesObject.id[bigImagesObject.index + num]
    bigImagesObject.imgSrc = imagesObject.imgSrc[bigImagesObject.index + num]
    bigImagesObject.fileName = imagesObject.fileName[bigImagesObject.index + num]
    bigImagesObject.imgAuthorUsername = imagesObject.imgAuthorUsername[bigImagesObject.index + num]
    bigImagesObject.imgTimestamp = formatDate(imagesObject.imgTimestamp[bigImagesObject.index + num])
    bigImagesObject.index = bigImagesObject.index + num
  }
  switch (value) {
    case 0:
      if (bigImagesObject.index <= 0) return
      dataObject(-1)
      break
    case 1:
      if (bigImagesObject.index === imagesObject.id.length - 1) return
      dataObject(1)
      break
  }
}

/**
 * 檔案下載方法
 * @param {string} url 下載檔案的url
 * @param {string} fileName 下載檔案的名稱
 */
const downloadFile = async (url, fileName) => {
  const fileData = await imageUrlToBase64(url)
  const link = document.createElement('a')
  link.href = fileData.data.imageBase64Code
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>


<style lang="scss">
html,
body,
div,
h1,
h2,
h3,
h4,
h5,
p,
a {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  // font-family: sans-serif, 'Microsoft JhengHei';
}

h1,
h2,
h3,
h4,
h5,
p,
a,
li,
span {
  font-family: sans-serif, 'Microsoft JhengHei';
  color: inherit;
  text-decoration: none;
}

body {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #FFE1B9 25%, #FFD6CA 50%, #F7CDF2 100%);

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-track-piece {
    background: transparent;
  }

  ::-webkit-scrollbar {
    width: 12.5px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(252, 181, 198);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgb(249, 139, 139);
  }
}

#app {
  margin: 0.5%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: 98vh;
  position: relative;
  background-color: rgba($color: #FFFFFF, $alpha: 0.60);
  background-attachment: fixed;
  border-radius: 10px;
  overflow-y: auto;
  transition: all ease 200ms;


  nav {
    width: 15%;
    height: max-content;
    position: sticky;
    top: 0;
    // left: 0.5%;

    ul {

      padding-inline-start: 0%;

      li {
        height: 1.5em;
        cursor: pointer;
        list-style: none;
        padding-top: 2.5%;
        padding-right: 5%;
        padding-bottom: 2.5%;
        padding-left: 5%;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        text-align: center;
        // font-weight: bold;
        transition: all ease 150ms;

        &:hover {
          background-color: rgb(255, 170, 170);
        }
      }

      li[class="active"] {
        cursor: default;
        color: #FFFFFF;
        background: rgb(255, 121, 121);
      }
    }
  }

  main {
    margin: 0.5%;
    width: 84%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    position: relative;

    .img-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .img-box-content {
        display: flex;
        justify-content: center;
        width: 250px;
        height: 250px;
        border: 2px solid rgba($color: #FFFFFF, $alpha: 0.75);
        overflow: hidden;
        cursor: pointer;

        img {
          max-width: auto;
          height: auto;
        }
      }
    }
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  button[name="request-button"] {
    padding: 2%;
    width: 100%;
    font-size: 25px;
  }

  button[class="inRequesting"] {
    animation: inRequestingAnimation 500ms linear infinite;
    cursor: default;
  }

  button[class="not-before-file"] {
    cursor: default;
  }

  button[name="close-button"] {
    color: rgb(255, 121, 121);
    font-size: 2em;
  }

  #big-image-container {
    padding: 1.5%;
    width: 80%;
    height: 90vh;
    position: fixed;
    bottom: 5%;
    background: rgba($color: #ffffff, $alpha: 0.95);
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    svg {
      width: 40px;
      height: 40px;
      color: rgb(255, 121, 121);
      font-size: 2em;
    }

    .top-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      div[name="detail-text"] {
        width: 90%;

        h3 {
          height: 1.75em;
          font-size: 2em;
        }

      }

      button[name="close-button"] {
        width: 10%;
      }
    }

    div[name="big-img-box"] {
      width: 85%;
      height: 75%;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button {
      display: flex;
      align-items: center;
      color: rgb(255, 121, 121);
      cursor: pointer;
      width: 5%;
    }

    button[name="left-buttom"] {
      padding-right: 1%;
    }

    button[name="right-buttom"] {
      padding-left: 1%;
    }

    button[name="images-copy-link-button"] {
      &:hover {}
    }

    button[name="images-download-button"] {
      &:hover {}
    }

    div[name="button-box"] {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      svg {
        width: 24px;
        height: 24px;
      }
    }

  }

  @keyframes inRequestingAnimation {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

}
</style>
