const firestore_client = require("./firestore_client");

class Reports {
    remove_report(video_id, report_id) {
        firestore_client.db.collection("videos")
        .doc(video_id)
        .collection("reports")
        .doc(report_id).delete();
    }

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
    reduce_upvote(video_id, report_id, success_callback, error_callback) {
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
                    current_data.num_upvotes -= 1;
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
    reduce_downvote(video_id, report_id, success_callback, error_callback) {
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
                    current_data.num_downvotes -= 1;
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

    async get_videos(callback) {
        let snapshot = await firestore_client.db.collection("videos").get();
        let docs = await snapshot.docs;
        await docs.forEach((video) => {
            callback(video);
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

    get_reports(video_id, success_callback, error_callback) {
        let reports = [];
        firestore_client.db
            .collection("videos")
            .doc(video_id)
            .collection("reports")
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach((report) => {
                    try {
                        let report_data = {...report.data()};
                        reports.push({report_data , reportId: report.id });
                    } catch(error) {

                    }
                });
                success_callback(reports);
            })
            .catch(error_callback());
    }
}

class Users {
    async is_report_voted_on(user_id, video_id, report_id, callback) {
        let found = false;
        let upvoted_reports = await firestore_client.db.collection("users")
        .doc(user_id).collection("upvoted_reports").get();
        let upvoted_docs = await upvoted_reports.docs;
        await upvoted_docs.forEach((vote) => {
            if (vote.data()['video_id'] == video_id && vote.data()['report_id'] == report_id) {
                console.log(`found upvote ${vote.id}`);
                found = true;
                callback(true, "upvoted_reports", vote.id);
            }
        });
        if (!found) {
            let downvoted_reports = await firestore_client.db.collection("users")
            .doc(user_id).collection("downvoted_reports").get();
            let downvoted_docs = await downvoted_reports.docs;
            await downvoted_docs.forEach((vote) => {
                if (vote.data()['video_id'] == video_id && vote.data()['report_id'] == report_id) {
                    found = true;;
                    console.log(`found downvote ${vote.id}`);
                    callback(true, "downvoted_reports", vote.id);
                }
            });
        }
        if (!found) {
            callback(false, null, null);
        }
    }

    async is_user_there(email_id, callback) {
        let snapshot = await firestore_client.db.collection("users").get();
        let found = false;
        let docs = snapshot.docs;
        await docs.forEach((user) => {
            if (user.data()["emailId"] == email_id) {
                console.log(`found user ${user.id}`);
                found = true;
                callback(true, user.id);
            }
        });
        if (!found) {
            console.log("not found");
            callback(false, null);
        }
    }
// collection = upvoted_reports || downvoted_reports
    add_vote(user_id, collection, video_id, report_id) {
        this.is_report_voted_on(user_id, video_id, report_id, (report_is_voted_on, voted_collection, vote_id) => {
            if (!report_is_voted_on) {
                firestore_client.db.collection("users").doc(user_id).collection(collection).add({
                    video_id: video_id,
                    report_id: report_id
                });
                return [true, "added vote"]        
            } else if (voted_collection == collection) {
                return [false, "already voted"];
            } else {
                firestore_client.db.collection("users").doc(user_id)
                .collection(voted_collection).doc(vote_id).delete();

                firestore_client.db.collection("users").doc(user_id).collection(collection).add({
                    video_id: video_id,
                    report_id: report_id
                });
                return [true, "vote switched"]
            }
        });
    }
}

let report = new Reports();
let video = new Videos();
let user = new Users();
module.exports.users = user;
module.exports.reports = report;
module.exports.videos = video;
