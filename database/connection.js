const mongoose = require('mongoose');


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb+srv://abhatt2811:JqOsTrG35kNHULdG@cluster0.jm9xhsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then((res)=>{
    console.log("Database Connected");
}).catch((res)=>{
    console.log("Database Not Connected");
})