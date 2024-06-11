const mongoose = require('mongoose');


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/StudentPortal').then((res)=>{
    console.log("Database Connected");
}).catch((res)=>{
    console.log("Database Not Connected");
})