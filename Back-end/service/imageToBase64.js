const fs = require('fs')
const axios = require('axios')
const fileTypeFilter = require('./fileTypeFilter')
const httpRequest = require('../httpRequest/httpRequest')

module.exports = {

    /**
     * 圖片連結轉換成base64編碼
     * @param {string} url 圖片連結
     * @returns 圖片base64編碼
     */
    urlToBase64: async (url) => {
        const base64Data = await httpRequest.getUrlData(url, 'arraybuffer')
        const type = base64Data.headers['content-type']
        const base64String = Buffer.from(base64Data.data).toString('base64')
        // console.log(`data:${type};base64,${base64String}`);
        return `data:${type};base64,${base64String}`
    },
    /**
     * 多張圖片連結轉換成base64編碼(陣列形式)
     * @param {Array} urlList 圖片連結(陣列形式)
     * @returns 圖片base64編碼(陣列形式)
     */
    getUrlListData: async (urlList) => {
        let base64List = []
        const base64ListData = await httpRequest.getUrlListData(urlList, 'arraybuffer')
        base64ListData.forEach(element => {
            base64List.push(`data:${element.headers['content-type']};base64,${Buffer.from(element.data).toString('base64')}`)
        })
        return base64List
    },

    /**
     * 本地檔案轉換成base64編碼
     * @param {string} file 檔案路徑
     * @returns 檔案base64編碼
     */
    fileToBase64: (file) => {
        const base64 = fs.readFileSync(file, 'base64')
        const filenameExtensionTyepText = fileTypeFilter.filenameExtensionTyepText(file)
        return `data:image/${filenameExtensionTyepText};base64,${base64}`
    }


}