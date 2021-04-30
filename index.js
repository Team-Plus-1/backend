const express = require("express");
const firestore_client = require("./firestore_client");
const structures = require("./structures");

const app = express();
const port = 3000;

function save_new() {
    let new_vid = structures.videos;
    new_vid.add_video("url");
}

function upvote() {
    let new_report = structures.reports;
    new_report.downvote("FkUnPFruRMSaLaX2s1k0", "egJbMbtolXa6NZ92aVZG");
    console.log(new_report);
}

/*
JSON STRUCTURE

*/

app.get('/api', (req, res) => {
    if (req.data) {

    }

    res.json("hello world");
});

app.get('/upvote', (req, res) => {
    upvote();
    res.send("upvoted");
});

app.get('/update', (req, res) => {
    save_new();
    res.send("updated");
});
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});