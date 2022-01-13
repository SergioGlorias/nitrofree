/*eslint complexity: ["error", 13]*/
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import fastifyFavicon from "fastify-favicon";
import path from "path";
import escapeHTML from "escape-html";
import { fileURLToPath } from "url";
import { encode } from "punycode";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({
    logger: true,
    trustProxy: true
});


function linkRandom(geo = "") {
    let num = (Math.random()).toFixed(3);

    if (["T1"].includes(geo)) {return "https://youtu.be/SN5awaBMkuY";}
    else if (num <= 0.01) {return "https://youtu.be/vfjnUgToHnA";}
    else if (num <= 0.15) {return "https://youtu.be/XDFFvsXqJJk";}
    else if (num <= 0.25) {return "https://youtu.be/v1POP-m76ac";}
    else if (num <= 0.30 && ["BR", "PT"].includes(geo)) {return "https://youtube.com/clip/UgyI6DhZfLywdxJ8jN14AaABCQ";}
    else if (num <= 0.40) {return "https://youtu.be/MO7bRMa9bmA?t=37";}
    else if (num <= 0.45) {return "https://youtu.be/K7XHy8nppf4";}
    else if (0.666 === num && ["BR", "PT"].includes(geo)) {return "https://youtu.be/wUHKpxtWvUQ";}
    else if (0.666 === num && !["BR", "PT"].includes(geo)) {return "https://youtu.be/EzN9u2xBBVY?t=5";}
    else {return "https://youtu.be/dQw4w9WgXcQ";}
}

server.register(fastifyStatic, {
    root: path.join(__dirname, "i"),
    prefix: "/i/"
});
server.register(fastifyFavicon);

server.get("/", async (request, reply) => {

    let link = encodeURI(linkRandom(request.headers["cf-ipcountry"]));
    let html = `<!DOCTYPE html>
<meta charset="utf-8">
<meta property="og:site_name" content="Um presente selvagem apareceu apareceu!">
<meta property="og:title" content="Free Nitro">
<meta property="og:image" content="/i/Nitro.png">
<meta property="og:description" content="Expira em 48 horas">
<meta name="theme-color" content="#FFFFFF">
<title>Você recebeu uma assinatura de presente!</title>
<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["disableCookies"]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//analytics.serginho.dev/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '4']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->
<meta http-equiv="refresh" content="0; URL=${link}">
<link rel="canonical" href="${link}">`;

    return reply.type("text/html").send(html);

});


server.get("/:name", async (request, reply) => {

    let sec = escapeHTML(request.params.name);
    if (sec.length > 50) {return reply.status(400).send("Invalid link");}

    let link;
    switch (sec.toLocaleLowerCase()) {
        case "\ud83d\udc27":
        case "pinguim":
        case "pinguin":
        case "tux":
            link = "https://youtu.be/vfjnUgToHnA";
            break;
        case "ravena":
        case "raven":
        case "666":
            link = "https://www.youtube.com/watch?v=qgbF4WI49jE";
            break;
        default:
            link = linkRandom(request.headers["cf-ipcountry"]);
            break;
    }

    link = encodeURI(link);

    let html = `<!DOCTYPE html>
    <meta charset="utf-8">
    <meta property="og:site_name" content="Um presente selvagem de ${sec} apareceu!">
    <meta property="og:title" content="Free Nitro">
    <meta property="og:image" content="/i/Nitro.png">
    <meta property="og:description" content="Expira em 48 horas">
    <meta name="theme-color" content="#30bf00">
    <title>Você recebeu uma assinatura de presente!</title>
    <!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["disableCookies"]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//analytics.serginho.dev/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '4']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->
<meta http-equiv="refresh" content="0; URL=${link}">
<link rel="canonical" href="${link}">`;

    return reply.type("text/html").send(html);
});

server.setNotFoundHandler(function (request, reply) {
    reply.redirect("/");
});

const start = async () => {
    try {
        await server.listen(3002, "0.0.0.0");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();