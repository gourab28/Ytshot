const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const slugify = require('slugify');

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
const port = 8001;

app.get("/", (req, res) => {
  res.send("Working")
})


app.get('/download', async (req, res) => {
        var url = req.query.url;
        let info = await ytdl.getInfo(url);
        //console.log(info.videoDetails.title);
        let name = info.videoDetails.title;
       
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        let videf = ytdl.chooseFormat(info.formats, { format: 'mp4',
            quality: 'highestvideo',
            filter: 'audioandvideo' });
        let filemp = videf.url;

        //Response
        res.status(200).json({title: name , mp3: audioFormats[1].url , videolink: filemp, direct: url , statu: "30"})
    })
    
  app.get('/video', async (req, res) => {
    try {
        var url = req.query.url;
        if (!ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }
        let info = await ytdl.getInfo(url);
        const title = slugify(info.videoDetails.title, {
            replacement: ' ',
            remove: /[*+~.()'"!:@||]/g,
            lower: true,
            strict: false
        });
        const ttel = encodeURI(title);
         //console.log(ttel);
        res.header('Content-Disposition', `attachment; filename="${ttel}.mp4"`);
        ytdl(url, {
            format: 'mp4',
            quality: 'highestvideo',
            filter: 'audioandvideo'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});
app.get('/audio', async (req, res) => {
    try {
        var url = req.query.url;
        if (!ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }
        let info = await ytdl.getInfo(url);
        console.log(info.videoDetails.title);
        const title = slugify(info.videoDetails.title, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: false
        });
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highestaudio'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});

    
app.listen(port, () => console.log(`Server is listening on port ${port}.`));
