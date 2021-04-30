const express = require("express");
const firestore_client = require("./firestore_client");
const structures = require("./structures");

const app = express();
const port = 3000;

function save_new() {
    global.new_vid = new structures.Video("url2");
}

app.get('/api', (req, res) => {
    res.send("hello world");
});

app.get('/check', (req, res) => {
    global.msg = "";
    let a = firestore_client.db.collection('videos').get().then(snapshot => {
        snapshot.docs.forEach(video => {
            console.log(video.data()['url']);
            global.msg.concat(video.data()['url'])});
    });

    console.log(global.msg);
    res.send("hey".concat(msg));
});

app.get('/review', (req, res) => {

});

app.get('/update', (req, res) => {
    save_new();
    res.send('sending new vals');
});
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});