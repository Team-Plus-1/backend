const express = require("express");
const firestore_client = require("./firestore_client");
const structures = require("./structures");

const app = express();
const port = 3000;

let videos = structures.videos;
let reports = structures.reports;

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
JSON STRUCTURES requests that can be made to /api

{
    "action" : "check_if_video_reported",
    "url": "http://<url>"
} => {
    "reply" : true/false,
    "data" : "tags"/null
}

{
    "action": "get_reports",
    "url": "http://<url>"
} => {
    "reports": {
        "report 1": {"report", num_upvote}
    }
}

{
    "action": "add_report",
    "url": "http://<url>",
    "report_string": "report" 
    "user_name": username
}

{
    "action": "upvote_report",
    "video_id": video_id,
    "report_id": report_id,
    "user_name": username
}

{
    "action": "downvote_report",
    "video_id": video_id,
    "report_id": report_id,
    "user_name": username
}
*/

app.get('/api/check', (req, res) => {
    const url = req.query.url;
    console.log(`checking ${url}`);
    let response = videos.is_video_there(url);
    let url_is_there = response[0];
    let id = response[1];
    if (url_is_there) {
        videos.get_reports(id, (reports) => {
            console.log(reports);
            res.json({
                "reply": true,
                "data": reports
            });
        });
    } else {
        res.json({
            "reply": false,
            "data": null
        });
    }
});

app.get('/test', (req, res) => {
    let response = videos.is_video_there("url");

    if (response[0]) {
        res.json({"it's there": response[1]}); 
    }
    res.json({"helddo": "world"});
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