const mysql = require("mysql");
console.log("SERVER")
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"nodejs_posts"
});

db.connect((err)=>{
    if(err){
        console.log(err)
    }
})

exports.db = db ;