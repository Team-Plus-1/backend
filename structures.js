const firestore_client = require("./firestore_client");

class Reports {
    add_report(video_id, report, categories, success_callback, error_callback) {
        firestore_client.db
            .collection("videos")
            .doc(video_id)
            .collection("reports")
            .add({
                report_string: report,
                num_upvotes: 0,
                num_downvotes: 0,
                categories: categories,
            })
            .then(success_callback)
            .catch(error_callback);
    }

    get_report(video_id, report_id) {
        firestore_client.db
            .collection("videos")
            .doc(video_id)
            .collection("reports")
            .doc(report_id)
            .get()
            .then((doc) => {
                let data = doc.data();
                return data;
            });
    }
    upvote(video_id, report_id, success_callback, error_callback) {
        try {
            firestore_client.db
                .collection("videos")
                .doc(video_id)
                .collection("reports")
                .doc(report_id)
                .get()
                .then(async (doc) => {
                    let current_data = await doc.data();
                    if (current_data === undefined) {
                        try {
                            console.log(current_data.num_upvotes);
                        } catch (error) {
                            error_callback(error);
                        }
                        return;
                    }
                    current_data.num_upvotes += 1;
                    firestore_client.db
                        .collection("videos")
                        .doc(video_id)
                        .collection("reports")
                        .doc(report_id)
                        .set(current_data)
                        .then(success_callback)
                        .catch((error) => {
                            error_callback(error);
                        });
                });
        } catch (error) {
            error_callback(error);
        }
    }

    downvote(video_id, report_id, success_callback, error_callback) {
        try {
            firestore_client.db
                .collection("videos")
                .doc(video_id)
                .collection("reports")
                .doc(report_id)
                .get()
                .then(async (doc) => {
                    let current_data = await doc.data();
                    if (current_data === undefined) {
                        try {
                            console.log(current_data.num_upvotes);
                        } catch (error) {
                            error_callback(error);
                        }
                        return;
                    }
                    current_data.num_downvotes += 1;
                    firestore_client.db
                        .collection("videos")
                        .doc(video_id)
                        .collection("reports")
                        .doc(report_id)
                        .set(current_data)
                        .then(success_callback)
                        .catch((error) => {
                            error_callback(error);
                        });
                });
        } catch (error) {
            error_callback(error);
        }
    }
}

class Videos {
    add_video(url) {
        firestore_client.db
            .collection("videos")
            .add({
                url: url,
            })
            .then((docRef) => {
                console.log(docRef.id);
                return docRef.id;
            })
            .catch((error) => {
                console.log("error while adding video ", error);
            });
    }

    async is_video_there(url, callback) {
        let snapshot = await firestore_client.db.collection("videos").get();
        let found = false;
        let docs = await snapshot.docs;
        await docs.forEach((video) => {
            if (url.includes(video.data()["url"])) {
                console.log(`found ${video.id}`);
                callback(true, video.id);
                found = true;
            }
        });
        if (!found) {
            console.log("not found");
            callback(false, null);
        }
    }

    get_reports(video_id, callback) {
        let reports = [];
        firestore_client.db
            .collection("videos")
            .doc(video_id)
            .collection("reports")
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach((report) => {
                    let report_string = report.data()["report_string"];
                    reports.push(report_string);
                });
                console.log(reports);
                callback(reports);
            });
    }
}

class Users {
    constructor(uname) {
        this.uname = uname;
        this.upvoted_reviews = null;
        this.downvoted_reviews = null;
        this.karma = 0;
    }
}

async function name() {}

let report = new Reports();
let video = new Videos();
module.exports.reports = report;
module.exports.videos = video;
