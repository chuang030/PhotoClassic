const messageProcess = require('./messageProcess')
const imageToBase64 = require('../service/imageToBase64')

module.exports = {
    /**
     * 取得該伺服器內所有頻道
     * @param {string} guildId 伺服器ID
     * @returns 該伺服器內所有頻道內容
     */
    getGuildChannels: async (guildId) => {
        return await messageProcess.getGuildChannels(guildId)
    },
    /**
     * 取得該頻道內所有內容
     * @param {string} channelId 頻道ID
     * @param {number} limit 一次請求回傳最大訊息數量
     * @returns 該頻道內所有內容
     */
    getSelectedChannelMessage: async (channelId, limit) => {
        return await messageProcess.getSelectedChannelMessage(channelId, limit)
    },
    /**
     * 取得該頻道內指定內容
     * @param {string} channelId 頻道ID
     * @param {number} limit 一次請求回傳最大訊息數量
     * @param {string} fileType 檔案類型
     * @param {string} oldestMessageId 這次請求中最舊的訊息ID
     * @returns 指定檔案類型之訊息ID、fileName、url、authorUserName、timestamp、oldestMessageId的object
     */
    getSelectedChannelGoalTypeFile: async (channelId, limit, fileType, oldestMessageId) => {
        return await messageProcess.getSelectedChannelGoalTypeFile(channelId, limit, fileType, oldestMessageId)
    },

    /*---------------------image to base64---------------------*/

    urlToBase64: async (url) => {
        return await imageToBase64.urlToBase64(url)
    }

}
