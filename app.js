const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const slugify = require('slugify');

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
const port = 8000;

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
    
app.listen(port, () => console.log(`Server is listening on port ${port}.`));