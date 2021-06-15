const express = require('express')
const app = express()
let port = 3000
var escape = require('escape-html');
var ua = require('universal-analytics');
app.set('trust proxy', 1)
app.use(ua.middleware("", { cookieName: "_ga",  }))

var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

app.use(limiter);

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
})
app.get('/:name', (req, res) => {

    let sec = escape(req.params.name)
    if (sec.length > 50) return res.status(401).send("User invalido");
        
    req.visitor.event({
        dp: req.originalUrl,
        ec: 'nitro-links',
        ea: sec,
        ua: req.headers['user-agent'],
        uip: req.headers['cf-connecting-ip'],
        dr: req.headers['referer'],
        geoid: req.headers['cf-ipcountry'],
        dh: req.headers['host'],
    }).send()
    let html = `
<!DOCTYPE html>
<meta charset="utf-8">
<meta property="og:site_name" content="Um presente de ${sec} apareceu!">
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


app.listen(port, "127.0.0.1", () => {
    console.log(`http://localhost:${port}`)
})
