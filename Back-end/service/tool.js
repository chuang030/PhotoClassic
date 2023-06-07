module.exports = {
    /**
    * 延遲器
    * @param {number} ms 延遲時長(ms)
    * @returns 無內容，僅設定延遲
    */
    sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
}