const firestore_client = require("./firestore_client");


class Review {
    constructor(review_str, video_id) {
        this.updated = false;
        this.video_id = video_id;
        this.id = null;
        this.review_str = review_str;
        this.no_upvotes = 0;
        this.no_downvotes = 0;
    }
    
    upvote() {
        this.no_upvotes += 1;
        firestore_client.db.collection("videos").doc(this.video_id)
        .collection("reviews").doc("no_upvotes") = this.no_upvotes;
    }

    downvote() {
        this.no_downvotes += 1;
        firestore_client.db.collection("videos").doc(this.video_id)
        .collection("reviews").doc("no_upvotes")
    }
}

class Video {
    constructor(url) {
        this.url = url;
        this.reviews = [];
        firestore_client.db.collection("videos").add({
            url: this.url
        }).then((docRef) => {
            global.id = docRef.id;
            console.log(`global id inside this ${global.id}`);
        }).catch((error) => {
            console.log("error while adding video");
        });

        console.log(`global id outside this ${global.id}`);
        this.id = global.id;
    }

    get_id() {
        return this.id;
    }

    update() {
        this.reviews.forEach(review => {
            if (review.updated != true) {
                firestore_client.db.collection("videos").doc(this.id)
            }
        });
    }

    add_review(review_str) {
        review = new Review(review_str);
        this.reviews.push(review);
        update();
    }

    is_video_there(url) {
        let a = firestore_client.db.collection("videos").get().then(snapshot => {
            snapshot.docs.forEach(video => {
                if (video.data()['url'] == url) {
                    return true;
                }
            });
            return false;
        });
    }    
}

class User {
    constructor(uname) {
        this.uname = uname;
        this.upvoted_reviews = 0;
        this.downvoted_reviews = 0;
        this.karma = 0;
    }
}


module.exports.Review = Review;
module.exports.Video = Video;
