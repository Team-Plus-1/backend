const express = require("express");
const structures = require("./structures");

const app = express();
const port = process.env.PORT || 5000;
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let videos = structures.videos;
let reports = structures.reports;

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

app.get("/api/reports", (req, res) => {
    const url = req.query.url;
    console.log(`checking ${url}`);
    videos.is_video_there(url, (is_there, id) => {
        console.log(is_there, id);
        if (is_there) {
            videos.get_reports(
                id,
                (reports) => {
                    console.log(reports);
                    if (reports.length > 0) {
                        res.status(200).json({
                            reply: true,
                            data: reports,
                        });
                    } else {
                        res.status(400).json({
                            reply: false,
                            data: null,
                        });
                    }
                },
                (error) => {
                    console.log(error);
                    res.status(500).json({
                        reply: false,
                        data: null,
                    });
                }
            );
        } else {
            res.json({
                reply: false,
                data: null,
            });
        }
    });
});

app.post("/api/vote", (req, res) => {
    let url, report_id, score;
    try {
        console.log(req.body);
        url = req.body.url;
        report_id = req.body.reportId;
        score = req.body.score;
        if (
            url === undefined ||
            report_id === undefined ||
            score === undefined
        ) {
            res.status(400).json({
                message: "Ensure that body has all required parameters",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Ensure that body has all required parameters",
        });
    }

    videos.is_video_there(url, (is_there, video_id) => {
        if (is_there) {
            console.log("Video Found", url);
            if (score === 1) {
                reports.upvote(
                    video_id,
                    report_id,
                    () => {
                        // Success Callback
                        res.status(200).json({
                            message: "Successfully Upvoted",
                        });
                    },
                    (error) => {
                        // Error Callback
                        console.log(error);
                        res.status(500).json({ message: error.message });
                    }
                );
            } else if (score === -1) {
                reports.downvote(
                    video_id,
                    report_id,
                    () => {
                        // Success Callback
                        res.status(200).json({
                            message: "Successfully Downvoted",
                        });
                    },
                    (error) => {
                        // Error Callback
                        console.log(error);
                        res.status(500).json({ message: error.message });
                    }
                );
            } else {
                res.status(400).json({
                    message: "Invalid Score. Score should be +1/-1",
                });
            }
        } else {
            res.status(400).json({ message: "No Such Video found" });
        }
    });
});

app.post("/api/report", (req, res) => {
    /*{
        url: url,
        report_string: report_string,
    }*/
    let url, report_string, categories;
    try {
        console.log(req.body);
        url = req.body.url;
        report_string = req.body.report_string;
        categories = req.body.categories;
        if (
            url === undefined ||
            report_string === undefined ||
            categories === undefined
        ) {
            res.status(400).json({
                message: "Ensure that body has all required parameters",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Ensure that body has all required parameters",
        });
    }
    videos.is_video_there(url, (is_present, video_id) => {
        if (is_present) {
            reports.add_report(
                video_id,
                report_string,
                categories,
                () => {
                    res.status(200).json({
                        message: "Successfully added report",
                    });
                },
                (error) => {
                    console.log(error);
                    res.status(500).json({ message: error.message });
                }
            );
        } else {
            videos.add_video(url);
            videos.is_video_there(url, (is_present, video_id) => {
                if (is_present) {
                    reports.add_report(
                        video_id,
                        report_string,
                        categories,
                        () => {
                            res.status(200).json({
                                message: "Successfully added report",
                            });
                        },
                        (error) => {
                            console.log(error);
                            res.status(500).json({ message: error.message });
                        }
                    );
                } else {
                    res.status(500).json({ message: "Unable to add video" });
                }
            });
        }
    });
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
