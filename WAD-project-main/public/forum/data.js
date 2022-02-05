var dateTime = (new Date()).toDateString()



// Ryan's firebase

const firebaseConfig = {
    apiKey: "AIzaSyAuj6iX0Hqp9owZpvWyZRVEiQYLfnKbT2o",
    authDomain: "wadii-project-7c7dd.firebaseapp.com",
    projectId: "wadii-project-7c7dd",
    storageBucket: "wadii-project-7c7dd.appspot.com",
    messagingSenderId: "987135629921",
    appId: "1:987135629921:web:50fd77c89ec38592682820",
    measurementId: "G-PZBNMH36L8"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Variable to access database collection
const db = firebase.database().ref("forum")



const app = Vue.createApp({

    data() {
        return {
            loggedUser : "empty",
            forum : [],
            postCategory:"Office Chair",
            postHeader:"",
            postBody:"",
            postCaption:"",
            upvotes: "",
            downvotes: "",
            comments: "",
            postComment:"",
            currentCategory:"all",
        };

    },

    created() {
        this.getDatabase()
        if (localStorage.loggedUser) {
            this.loggedUser = localStorage.loggedUser;
        } 
    },


    methods: {

        logout() {
            this.loggedUser = "empty";
            localStorage.removeItem("loggedUser");
            alert("Logged Out Successfully")
            window.location.href = "../index.html"
        },


        getDatabase() {db.once("value").then((snapshot) => {
            if(snapshot.exists()) {
                this.categoryfilter(this.currentCategory)
            }
        })
        },

        categoryfilter(x) {
            this.currentCategory = x;
            db.once("value").then((snapshot) => {
                    this.forum = snapshot.val();
                    if (x == "all") {
                        console.log(this.forum)
                    }
                    else{
                        for (i=0;i<this.forum.length;i++){
                            if (this.forum[i].category != x){
                                this.forum.splice(i,1)
                                i = i-1
                            }
                       }
           
                }
            })
        },

        newPost(){
            //Get Form Values
            if(this.loggedUser == "empty"){
                alert("You need to be login to post new thread!")
            }
            else{
                let postID = this.forum.length
                if(this.postHeader == "" || this.postCaption == "" || this.postBody == ""){
                    alert("Please fill up all the field")
                }
                else{
    
                //Save Form Data to Firebase
                firebase.database().ref("forum/" + postID).set({
                    postID: postID,
                    category:this.postCategory,
                    postDate: dateTime,
                    postHeader:this.postHeader,
                    postCaption:this.postCaption,
                    postBody:this.postBody,
                    pUserId:this.loggedUser,
                    upvotes:this.upvotes,
                    downvotes:this.downvotes,
                    comments:this.comments,
        
                }). then( () =>{
                    console.log("Data saved")
                    this.postCaption = ""
                    this.postCategory = "Office Chair"
                    this.postBody = ""
                    this.postHeader = ""
                }).catch((error) => {
                    console.log(error)
                })
                //Alert
                alert("Your post has been successfully created and posted")
                this.getDatabase()
                document.getElementById("overlay").style.display = "none";
                }
            }
            
    

        },
    
        addComment(x){            
            if(this.loggedUser == "empty"){
                alert("You need to be login to post comment!")
            }
            else{
                var postID = this.forum[x].postID
                if (this.postComment == "Comment" || this.postComment == "") {
                    alert("Please fill out the comment")
                }
                else{
                    var commentThread = this.forum[x].comments
                    if(commentThread == "") {
                        commentThread = []
                    }
                    commentThread.push([this.loggedUser,this.postComment,"less than a day ago","",""])
                    var commentRef = firebase.database().ref("forum").child(postID).child("comments");
                    commentRef.set(commentThread)
                    this.postComment = ""
                    this.getDatabase()
                }
            }
        },

        
        // Post upvote function
        checkDownvote(x){
            if(this.forum[x].downvotes.includes(this.loggedUser)){
                return true
            }
            else{
                return false
            }
        },

        checkUpvote(x){
            if(this.forum[x].upvotes.includes(this.loggedUser)){
                return true
            }
            else{
                return false
            }
        },
        
        upVote(x) {
            if(this.loggedUser == "empty"){
                alert("You need to be login to upvote!")
            }
            else{
                var postID = this.forum[x].postID
                if(this.forum[x].downvotes.includes(this.loggedUser)){
                    var downvotesRef = firebase.database().ref("forum").child(postID).child("downvotes");
                    var downvoteList = this.forum[x].downvotes
                    downvoteList.pop(this.loggedUser)
                    if(downvoteList.length >= 1){
                        downvotesRef.set(downvoteList)
                    }
                    else{
                        downvotesRef.set("")
                    }
                    this.checkDownvote(x)
                }

                var upvotesRef = firebase.database().ref("forum").child(postID).child("upvotes");

                var upvoteList = this.forum[x].upvotes
                if(upvoteList == "") {
                    upvoteList = []
                }
                if(upvoteList.includes(this.loggedUser)){
                        upvoteList.pop(this.loggedUser)
                        if(upvoteList.length >= 1){
                            upvotesRef.set(upvoteList)
                        }
                        else{
                            upvotesRef.set("")
                        }
                }
                else{
                    upvoteList.push(this.loggedUser)
                    upvotesRef.set(upvoteList)
                }
                this.getDatabase()
            }
        },

        downVote(x) {
            if(this.loggedUser == "empty"){
                alert("You need to be login to downvote!")
            }
            else{
                var postID = this.forum[x].postID
                if(this.forum[x].upvotes.includes(this.loggedUser)){
                    var upvotesRef = firebase.database().ref("forum").child(postID).child("upvotes");
                    var upvoteList = this.forum[x].upvotes
                    upvoteList.pop(this.loggedUser)
                    if(upvoteList.length >= 1){
                        upvotesRef.set(upvoteList)
                    }
                    else{
                        upvotesRef.set("")
                    }
                    this.checkUpvote(x)
                }

                var downvotesRef = firebase.database().ref("forum").child(postID).child("downvotes");
                var downvoteList = this.forum[x].downvotes
                if(downvoteList == "") {
                    downvoteList = []
                }
                if(downvoteList.includes(this.loggedUser)){
                        downvoteList.pop(this.loggedUser)
                        if(downvoteList.length >= 1){
                            downvotesRef.set(downvoteList)
                        }
                        else{
                            downvotesRef.set("")
                        }
                }
                else{
                    downvoteList.push(this.loggedUser)
                    downvotesRef.set(downvoteList)
                }
                this.getDatabase()
                }
        },


        // Comment upvote function
        checkCDownvote(x,y){
            if (this.forum[x].comments[y][4].includes(this.loggedUser)){
                return true
            }
            else{
                return false
            }
        },

        checkCUpvote(x,y){

            if (this.forum[x].comments[y][3].includes(this.loggedUser)){
                return true
            }
            else{
                return false
            }
        },
        
        upCVote(x,y) {
            if(this.loggedUser == "empty"){
                alert("You need to be login to upvote!")
            }
            else{
                var postID = this.forum[x].postID
                if(this.forum[x].comments[y][4].includes(this.loggedUser)){
                    var downvotesRef = firebase.database().ref("forum").child(postID).child("comments").child(y).child(4);
                    var downvoteList = this.forum[x].comments[y][4]

                    downvoteList.pop(this.loggedUser)
                    if(downvoteList.length >= 1){
                        downvotesRef.set(downvoteList)
                    }
                    else{
                        downvotesRef.set("")
                    }
                    this.checkCDownvote(x,y)
                }

                var upvotesRef = firebase.database().ref("forum").child(postID).child("comments").child(y).child(3);
                var upvoteList = this.forum[x].comments[y][3]
                if(upvoteList == "") {
                    upvoteList = []
                }
                if(upvoteList.includes(this.loggedUser)){
                        upvoteList.pop(this.loggedUser)
                        if(upvoteList.length >= 1){
                            upvotesRef.set(upvoteList)
                        }
                        else{
                            upvotesRef.set("")
                        }
                }
                else{
                    upvoteList.push(this.loggedUser)
                    upvotesRef.set(upvoteList)
                }
                this.getDatabase()
            }
        },

        downCVote(x,y) {
            if(this.loggedUser == "empty"){
                alert("You need to be login to upvote!")
            }

            else{
                var postID = this.forum[x].postID
                if(this.forum[x].comments[y][3].includes(this.loggedUser)){
                    var upvotesRef = firebase.database().ref("forum").child(postID).child("comments").child(y).child(3);
                    var upvoteList = this.forum[x].comments[y][3]
                    upvoteList.pop(this.loggedUser)
                    if(upvoteList.length >= 1){
                        upvotesRef.set(upvoteList)
                    }
                    else{
                        upvotesRef.set("")
                    }
                    this.checkCUpvote(x,y)
                }

                var downvotesRef = firebase.database().ref("forum").child(postID).child("comments").child(y).child(4);
                var downvoteList = this.forum[x].comments[y][4]
                if(downvoteList == "") {
                    downvoteList = []
                }
                if(downvoteList.includes(this.loggedUser)){
                        downvoteList.pop(this.loggedUser)
                        if(downvoteList.length >= 1){
                            downvotesRef.set(downvoteList)
                        }
                        else{
                            downvotesRef.set("")
                        }
                }
                else{
                    downvoteList.push(this.loggedUser)
                    downvotesRef.set(downvoteList)
                }
                this.getDatabase()
            }
        },
        
        checkLoggedIn(){
            if(this.loggedUser == "empty"){
                return false
            }
            else{
                return true
            }
        }

    },
})


const vm = app.mount("#forum");

