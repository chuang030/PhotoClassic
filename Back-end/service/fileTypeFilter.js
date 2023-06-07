const fileType = require('./fileType.json')

module.exports = {
    filenameExtensionTyep: (fileNameString) => {
        return filenameExtensionTyep(fileNameString)
    },
    filenameExtensionTyepText: (fileNameString) => {
        return filenameExtensionTyep(fileNameString).slice(1, fileNameString.length + 1)
    },
    typeFilter: (fileNameString) => {
        const filenameExtension = filenameExtensionTyep(fileNameString)
        let fileTypeValue = ""
        if (fileType.image.includes(filenameExtension)) {
            fileTypeValue = "image"
        } else if (fileType.audio.includes(filenameExtension)) {
            fileTypeValue = "audio"
        } else if (fileType.media.includes(filenameExtension)) {
            fileTypeValue = "media"
        } else if (fileType.document.includes(filenameExtension)) {
            fileTypeValue = "document"
        } else if (fileType.webFile.includes(filenameExtension)) {
            fileTypeValue = "webFile"
        } else if (fileType.xmlFile.includes(filenameExtension)) {
            fileTypeValue = "xmlFile"
        } else if (fileType.adobeFile.includes(filenameExtension)) {
            fileTypeValue = "adobeFile"
        } else {
            fileTypeValue = "otherFile"
        }
        return fileTypeValue
    }
}

const filenameExtensionTyep = (fileNameString) => {
    const pointPos = fileNameString.lastIndexOf('.')
    return fileNameString.slice(pointPos, fileNameString.length + 1)
}