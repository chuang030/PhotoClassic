const axios = require('axios')

module.exports = {

    /* ---------------------message http request---------------------- */

    /**
     * 呼叫Discord API取得該伺服器內所有頻道
     * @param {string} guildId 伺服器ID
     * @returns 該伺服器內所有頻道內容
     */
    getGuildChannels: async (guildId) => {
        return await discordApiGetMethod(`https://discord.com/api/guilds/${guildId}/channels`)
            .catch(error => {
                httpResponseErrorFunction(error)
            })
    },
    /**
     * 從Discord API取得該頻道的訊息Object，請求最新到限制數量的訊息
     * @param {string} channelId 頻道ID
     * @param {number} limit 一次請求回傳最大訊息數量
     * @returns 訊息Object
     */
    getSelectedChannelMessage: async (channelId, limit) => {
        return await discordApiGetMethod(`https://discord.com/api/channels/${channelId}/messages?limit=${limit}`)
            .catch(error => {
                httpResponseErrorFunction(error)
            })
    },
    /**
     * 從Discord API取得該頻道的訊息Object，於選定的訊息向前請求到限制數量的訊息
     * @param {string} channelId 頻道ID
     * @param {number} limit 一次請求回傳最大訊息數量
     * @param {string} messageId 選定的訊息ID
     * @returns 訊息Object
     */
    getSelectedChannelMessageBefore: async (channelId, limit, messageId) => {
        return await discordApiGetMethod(`https://discord.com/api/channels/${channelId}/messages?limit=${limit}&before=${messageId}`)
            .catch(error => {
                httpResponseErrorFunction(error)
            })
    },

    /*---------------------------image to base64---------------------------- */

    /**
     * 取得檔案數據
     * @param {string} url 圖片連結
     * @param {string} responseType response 類別
     * @returns 檔案數據
     */
    getUrlData: (url, responseType) => {
        return getUrlData(url, responseType)
    },
    /**
     * 取得多個檔案數據(陣列形式)
     * @param {Array} urlList 圖片連結(陣列形式)
     * @param {string} responseType response 類別
     * @returns 檔案數據(陣列形式)
     */
    getUrlListData: (urlList, responseType) => {
        let urlDataList = []
        urlList.forEach(async function (element) {
            urlDataList.push(await getUrlData(element, responseType));
        })
        // console.log(urlDataList);
        return urlDataList
    },
    /**
    * 回傳錯誤處理方法
    * @param {Object} error axios catch data
    * @returns 
    */
    httpResponseErrorFunction: (error) => {
        return httpResponseErrorFunction(error)
    }
}

/**
 * 取得檔案數據
 * @param {string} url 檔案連結
 * @param {string} responseType response 類別
 * @returns 檔案數據
 */
const getUrlData = (url, responseType) => {
    return axios({
        method: "get",
        url: url,
        responseType: responseType
    })
    // return base64Data
}

/**
 * Discord Api GET 請求方法
 * @param {string} url 請求連結
 * @returns 請求的object
 */
const discordApiGetMethod = async (url) => {
    const object = await axios({
        method: "get",
        url: url,
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        }
    },
        {
            catch: true
        })
    return object
}

/**
 * 回傳錯誤處理方法
 * @param {Object} error axios catch data
 */
const httpResponseErrorFunction = (error) => {
    if (error === null || error === undefined) return
    console.error(`Error Status : ${error.response.status}`);
    console.error(`Error StatusText : ${error.response.statusText}`);
}