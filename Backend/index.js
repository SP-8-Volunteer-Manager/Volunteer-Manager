const express = require("express");
const app = express();

app.get("/api", (req,res) =>{
    res.json({ f:["a",'b']});

});

app.listen(8080,()=>{
    console.log("Server is running on port 8080")
});
