const express = require('express')
const core = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT

const service = require('./service/service')

console.log("Bot Token:" ,process.env.BOT_TOKEN);

app.use(core())
app.use(express.json())
app.use(express.static('dist'))


app.get('/getGuildChannels', async (req, res) => {
  // @ts-ignore
  const channelsObject = await service.getGuildChannels(process.env.GUILD_ID)
  res.json({
    channelsObject: channelsObject.data
  })
})

app.get('/imageUrlToBase64/:url', async function (req, res) {
  // const channelsObject = await service.getGuildChannels(process.env.GUILD_ID)
  res.send(req.params.url)
  // res.json({
  //   imageBase64Code: `${res}`
  // })
})

app.post('/getSelectedChannelMessage', async (req, res) => {
  // @ts-ignore
  const channelsObject = await service.getSelectedChannelMessage(req.body.channelId, process.env.MAX_MESSAGES_COUNT)
  if(channelsObject.data.status === 200){
    res.json({
      messageObject: channelsObject.data
    })
  }else{
    res.sendStatus(429)
  }
})

app.post('/getSelectedChannelGoalTypeFile', async (req, res) => {
  // @ts-ignore
  const messageObject = await service.getSelectedChannelGoalTypeFile(req.body.channelId, process.env.MAX_MESSAGES_COUNT , req.body.fileType, req.body.oldestMessageId)
  if(messageObject.status === 200){
    res.json({
      messageObject: messageObject
    })
  }else{
    res.sendStatus(429)
  }
})

app.post('/imageUrlToBase64', async (req, res) => {
  const imageBase64Code = await service.urlToBase64(req.body.imageUrl)
  res.json({
    imageBase64Code: imageBase64Code
  })
})

app.listen(port, () => {
  console.log(`PhotoClassic app listening on port ${port}`)
})