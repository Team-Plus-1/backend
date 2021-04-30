const express = require("express");
const firestore_client = require("./firestore_client");
const structures = require("./structures");

const app = express();
const port = 3000;

function save_new() {
    global.new_vid = new structures.Video("url2");
}

app.get('/api', (req, res) => {
    if (req.data) {

    }

    res.json("hello world");
});

app.get('/update', (req, res) => {
    save_new();
    res.send('sending new vals');
});
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});