
const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading files directory");
            return;
        }
        console.log(files);
        res.render("index", { files: files });
    });
});
app.get('/files/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render("new",{filename: req.params.filename , filedata: filedata})
    })
})

app.get('/edit/:filename', function(req, res) {
    
        
        res.render("edit", { filename: req.params.filename});
   
});

app.post('/edit',function(req,res){
    fs.rename(`./edit/${req.body.old}`,`./edit/${req.body.new}`,function(err){
        res.redirect("/")
    })
})


app.post('/create', function (req, res) {
    const filename = `${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(`./files/${filename}`, req.body.details, function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
            return;
        }
        res.redirect("/");
    });
});



app.listen(3000, () => {
    console.log("Server is running on localhost:3000");
});