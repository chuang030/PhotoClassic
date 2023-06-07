const httpRequest = require('../httpRequest/httpRequest')
const fileTypeFilter = require('./fileTypeFilter')
const tool = require('./tool')

module.exports = {
    /**
     * 取得該伺服器內所有頻道
     * @param {string} guildId 伺服器ID
     * @returns 該伺服器內所有頻道內容
     */
    getGuildChannels: async (guildId) => {
        return await httpRequest.getGuildChannels(guildId)
    },
    /**
     * 取得該頻道內所有內容
     * @param {string} channelId 頻道ID
     * @param {number} limit 一次請求回傳最大訊息數量
     * @returns 該頻道內所有內容
     */
    getSelectedChannelMessage: async (channelId, limit) => {
        return await httpRequest.getSelectedChannelMessage(channelId, limit)
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
        let messageObject = null
        // if (this.isRequesting) return messageObject
        this.isRequesting = true
        // 前端第一次請求
        if (oldestMessageId === undefined || oldestMessageId === "" || oldestMessageId === null) {
            messageObject = await getSelectedChannelGoalTypeFile(channelId, limit, fileType)
            // console.log(messageObject);
        } else {
            // 前端後續請求
            messageObject = await getSelectedChannelGoalTypeFileBefore(channelId, limit, fileType, oldestMessageId)
        }
        if (messageObject.id != undefined || messageObject.id != null) {
            // 當獲取的檔案數量不足時(確保上次請求有獲取資料再請求)
            if (messageObject.id.length > 0) messageObject = getGoalTypeFileReplenish(channelId, limit, fileType, messageObject, Number(process.env.MAX_FILE_COUNT))
        }
        // this.isRequesting = false
        // console.log(messageObject);  
        return messageObject
    }
}

/**
 * 以取得的頻道訊息Object，分類出需要的資料，並打包回傳
 * @param {object} channelsObject 從Discord API回傳的頻道Object
 * @param {string} fileType 檔案類型
 * @returns 指定檔案類型之訊息ID、fileName、url、authorUserName、timestamp、oldestMessageId的object
 */
const getGoalTypeFileObject = (channelsObject, fileType) => {
    let messageObject = {
        id: [],
        fileName: [],
        url: [],
        authorUserName: [],
        timestamp: [],
        oldestMessageId: "",
        status: 0,
        statusText: ""
    }

    if (!channelsObject) {
        messageObject.statusText = 'error'
        return messageObject
    }

    if (channelsObject.data.length > 0) {
        for (const messageObjectKey in channelsObject.data) {
            for (const attachmentsKey in channelsObject.data[messageObjectKey].attachments) {
                // console.log(channelsObject.data[messageObjectKey]);
                if (fileTypeFilter.typeFilter(channelsObject.data[messageObjectKey].attachments[attachmentsKey].url) != fileType) continue
                if (channelsObject.data[messageObjectKey].attachments.length >= 0) {
                    // @ts-ignore
                    messageObject.id.push(channelsObject.data[messageObjectKey].attachments[attachmentsKey].id)
                    // @ts-ignore
                    messageObject.fileName.push(channelsObject.data[messageObjectKey].attachments[attachmentsKey].filename)
                    // @ts-ignore
                    messageObject.url.push(channelsObject.data[messageObjectKey].attachments[attachmentsKey].url)
                    // @ts-ignore
                    messageObject.authorUserName.push(channelsObject.data[messageObjectKey].author.username)
                    // @ts-ignore
                    messageObject.timestamp.push(channelsObject.data[messageObjectKey].timestamp)
                }
            }
        }
        //紀錄這次請求中最舊的訊息ID
        messageObject.oldestMessageId = channelsObject.data[channelsObject.data.length - 1].id
        console.log("channelsObject.status : ", channelsObject.status);
        // console.log(httpRequest);
        messageObject.status = channelsObject.status
        messageObject.statusText = channelsObject.statusText
    }
    return messageObject

}

/**
 * 從Discord API取得該頻道的訊息Object(首次請求)
 * @param {string} channelId 頻道ID
 * @param {number} limit 一次請求回傳最大訊息數量
 * @param {string} fileType 檔案類型
 * @returns 訊息Object
 */
const getSelectedChannelGoalTypeFile = async (channelId, limit, fileType) => {
    const channelsObject = await httpRequest.getSelectedChannelMessage(channelId, limit)
    return errorProcessFunction(getGoalTypeFileObject(channelsObject, fileType))
}

/**
 * 從Discord API取得該頻道的訊息Object(重複請求)，用於取得指定訊息以前的訊息Object
 * @param {string} channelId 頻道ID
 * @param {number} limit 一次請求回傳最大訊息數量
 * @param {string} fileType 檔案類型
 * @param {string} messageId 這次請求中最舊的訊息ID
 * @returns 訊息Object
 */
const getSelectedChannelGoalTypeFileBefore = async (channelId, limit, fileType, messageId) => {
    const channelsObject = await httpRequest.getSelectedChannelMessageBefore(channelId, limit, messageId)
    return errorProcessFunction(getGoalTypeFileObject(channelsObject, fileType))
}

/**
 * 從Discord API取得該頻道的訊息Object(重複請求)，此方法是填補指定檔案不足指定數量時使用
 * @param {string} channelId 頻道ID
 * @param {number} limit 一次請求回傳最大訊息數量
 * @param {string} fileType 檔案類型
 * @param {Object} messageObject 上一次請求的messageObject
 * @param {number} fileCount 指定檔案數量
 * @returns 訊息Object
 */
const getGoalTypeFileReplenish = async (channelId, limit, fileType, messageObject, fileCount) => {
    if (isErrorCheckFunction(messageObject)) return errorProcessFunction(messageObject)
    // @ts-ignore
    await tool.sleep(process.env.REQUEST_INTERVAL)
    let maxRequestCount = Number(process.env.MAX_AGAIN_REQUEST_COUNT)
    while (messageObject.url.length <= fileCount) {
        if (maxRequestCount == 0) break
        const beforeMessageObject = await getSelectedChannelGoalTypeFileBefore(channelId, limit, fileType, messageObject.oldestMessageId)
        if (beforeMessageObject.id.length <= 0) break
        messageObject = {
            id: messageObject.id.concat(beforeMessageObject.id),
            fileName: messageObject.fileName.concat(beforeMessageObject.fileName),
            url: messageObject.url.concat(beforeMessageObject.url),
            authorUserName: messageObject.authorUserName.concat(beforeMessageObject.authorUserName),
            timestamp: messageObject.timestamp.concat(beforeMessageObject.timestamp),
            oldestMessageId: beforeMessageObject.oldestMessageId,
            status: beforeMessageObject.status,
            statusText: beforeMessageObject.statusText
        }
        maxRequestCount -= 1
        // @ts-ignore
        await tool.sleep(process.env.REQUEST_INTERVAL)
    }
    return errorProcessFunction(messageObject)
}

const isErrorCheckFunction = (messageObject) => {
    if (messageObject.statusText === 'error') return true
    return false
}

const errorProcessFunction = (messageObject) => {
    if (messageObject.statusText === 'error') {
        return {
            status: 0,
            statusText: 'error',
        }
    } else {
        return messageObject
    }
}
