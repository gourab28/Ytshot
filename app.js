const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const slugify = require('slugify');

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.send("Working")
})

app.get('/song', async (req, res) =>
  ytdl
    .getInfo(req.query.url)
    .then(info => {
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
      res.set('Cache-Control', 'public, max-age=20000'); //6hrs aprox
      res.json({link: audioFormats[1].url})
    })
    .catch(err => res.status(400).json(err.message))
)

app.get('/download', async (req, res) => {
        var url = req.query.url;
        let info = await ytdl.getInfo(url);
        //console.log(info.videoDetails.title);
        let name = info.videoDetails.title;
        
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        let videf = ytdl.chooseFormat(info.formats, { quality: '134' });

        //Response
        res.json({title: name , mp3: audioFormats[1].url , videolink: videf.url})
    })
    
  app.get('/video', async (req, res) => {
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
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(url, {
            format: 'mp4',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});
app.listen(port, () => console.log(`Server is listening on port ${port}.`));