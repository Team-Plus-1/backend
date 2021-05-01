const firestore_client = require("./firestore_client");


class Reports {
    add_report(video_id, report) {
        firestore_client.db.collection("videos").doc(video_id)
        .collection("reports").add({
            report_string: report,
            num_upvotes: 0,
            num_downvotes: 0,
        }).then((docRef) => {
            console.log(docRef.id);
            return docRef.id;
        }).catch((error) => {
            console.log("error while adding video ", error);
        });
    }

    get_report(video_id, report_id) {
        firestore_client.db.collection("videos").doc(video_id)
        .collection("reports").doc(report_id).get().then((doc) => {
            let data = doc.data();
            return data;
        });
    }
    
    upvote(video_id, report_id) {
        let current_report = firestore_client.db.collection("videos").doc(video_id)
        .collection("reports").doc(report_id).get().then((doc) => {
           let current_data = doc.data();
           current_data.num_upvotes += 1;
           let new_report = firestore_client.db.collection("videos").doc(video_id)
           .collection("reports").doc(report_id).set(current_data);
        });
    }

    downvote(video_id, report_id) {
        let current_report = firestore_client.db.collection("videos").doc(video_id)
        .collection("reports").doc(report_id).get().then((doc) => {
           let current_data = doc.data();
           current_data.num_downvotes += 1;
           let new_report = firestore_client.db.collection("videos").doc(video_id)
           .collection("reports").doc(report_id).set(current_data);
        });
    }
}

class Videos {
    add_video(url) {
        firestore_client.db.collection("videos").add({
            url: url
        }).then((docRef) => {
            console.log(docRef.id);
            return docRef.id;
        }).catch((error) => {
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
            console.log('not found');
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

async function name() {
    
}

let report = new Reports();
let video = new Videos();
module.exports.reports = report;
module.exports.videos = video;
