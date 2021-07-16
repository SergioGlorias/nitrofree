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

function linkRandom(geo = "") {
    let num = (Math.random()).toFixed(3)
    console.log(num)

    if (["T1"].includes(geo)) return "https://youtu.be/SN5awaBMkuY"
    else if (num <= .01) return "https://youtu.be/vfjnUgToHnA"
    else if (num <= .15) return "https://youtu.be/XDFFvsXqJJk"
    else if (num <= .25) return "https://youtu.be/v1POP-m76ac"
    else if (num <= .30 && ["BR", "PT"].includes(geo)) return "https://youtube.com/clip/UgyI6DhZfLywdxJ8jN14AaABCQ"
    else if (num <= .40) return "https://youtu.be/MO7bRMa9bmA?t=37"
    else if (num <= .45) return "https://youtu.be/K7XHy8nppf4"
    else if (.666 === num && ["BR", "PT"].includes(geo)) return "https://youtu.be/wUHKpxtWvUQ"
    else if (.666 === num && !["BR", "PT"].includes(geo)) return "https://youtu.be/EzN9u2xBBVY?t=5"
    else return "https://youtu.be/dQw4w9WgXcQ"
}

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

    let link = linkRandom(req.headers['cf-ipcountry'])
    let html = `<!DOCTYPE html>
<meta charset="utf-8">
<meta property="og:site_name" content="Um presente apareceu!">
<meta property="og:title" content="Free Nitro">
<meta property="og:image" content="https://cdn.discordapp.com/app-assets/521842831262875670/store/633877574094684160.webp?size=1024">
<meta property="og:description" content="Expira em 48 horas">
<meta name="theme-color" content="#FFFFFF">
<title>>Você recebeu uma assinatura de presente!</title>
<meta http-equiv="refresh" content="0; URL=${link}">
<link rel="canonical" href="${link}">`
    
    res.send(html).end()
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
    let link
    switch (sec) {
        case "\ud83d\udc27":
        case "pinguim":
        case "pinguin":
        case "tux":
            link = "https://youtu.be/vfjnUgToHnA"
            break;
        default:
            link = linkRandom(req.headers['cf-ipcountry'])
            break;
    }
    let html = `<!DOCTYPE html>
<meta charset="utf-8">
<meta property="og:site_name" content="Um presente de ${sec} apareceu!">
<meta property="og:title" content="Free Nitro">
<meta property="og:image" content="https://cdn.discordapp.com/app-assets/521842831262875670/store/633877574094684160.webp?size=1024">
<meta property="og:description" content="Expira em 48 horas">
<meta name="theme-color" content="#30bf00">
<title>Você recebeu uma assinatura de presente!</title>
<meta http-equiv="refresh" content="0; URL=${link}">
<link rel="canonical" href="${link}">`
    res.send(html).end()
})

app.use(function (req, res) {
    res.status(404).redirect("/");
})


app.listen(port, "127.0.0.1", () => {
    console.log(`http://localhost:${port}`)
})
