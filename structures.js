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

    is_video_there(url) {
        this.get_video_id(url);
        if (this.url_is_present) {
            return [true, this.id];
        } else {
            return [false, null];
        }
    }
    
    get_video_id(url) {
            let a = firestore_client.db.collection("videos").get().then(snapshot => {
            snapshot.docs.forEach(video => {
                if (video.data()["url"] == url) {
                    let video_id = video.id;
                    this.id = video_id;
                    this.url_is_present = true;
                }
            });
        });
        return this;
    }

    get_reports(video_id, callback) {
        reports = [];
        firestore_client.db.collection("videos").doc(video_id)
        .collection("reports").get().then(snapshot => {
            snapshot.docs.forEach(report => {
                let report_string = report.data()['report_string'];
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

let report = new Reports();
let video = new Videos();
module.exports.reports = report;
module.exports.videos = video;
