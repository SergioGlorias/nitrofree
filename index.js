const express = require('express')
const app = express()
let port = 3000
const ExpressGA = require("express-universal-analytics")

app.use(ExpressGA({
    uaCode: "",
    autoTrackPages: true,
    cookieName: '_ga'
}))

app.get('/', (req, res) => {
    req.visitor.event({
        dp: req.originalUrl,
        ec: 'nitro',
        ea: 'visit',
        ua: req.headers['user-agent'],
        uip: req.headers['cf-connecting-ip'],
        dr: req.headers['referer'],
        geoid: req.headers['cf-ipcountry'],
        dh: req.headers['host'],
    }).send()
    res.sendFile("./index.html", { root: __dirname })
    console.log(req.headers)
})
app.get('/:name', (req, res) => {
    req.visitor.event({
        dp: req.originalUrl,
        ec: 'nitro-links',
        ea: req.params.name,
        ua: req.headers['user-agent'],
        uip: req.headers['cf-connecting-ip'],
        dr: req.headers['referer'],
        geoid: req.headers['cf-ipcountry'],
        dh: req.headers['host'],
    }).send()
    let html =`
<!DOCTYPE html>
<meta charset="utf-8">
<meta property="og:site_name" content="Um presente de ${req.params.name} apareceu!">
<meta property="og:title" content="Free Nitro">
<meta property="og:image" content="https://static.wikia.nocookie.net/discord/images/b/b8/Nitro_badge.png">
<meta property="og:description" content="Expira em 48h">
<meta name="theme-color" content="#30bf00">
<title>Nitro Free</title>
<meta http-equiv="refresh" content="0; URL=https://youtu.be/dQw4w9WgXcQ">
<link rel="canonical" href="https://youtu.be/dQw4w9WgXcQ">
`
    res.send(html)
})

app.use(function (req, res) {
    res.status(404).redirect("/");
})


app.listen(port, "0.0.0.0", () => {
    console.log(`http://localhost:${port}`)
})
