const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date');
const PORT = process.env.PORT || 3000;

const app = express();

let toDos = [];
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.render('index', {date: date(), toDos: toDos});
})

app.post('/', (req, res) => {
    let newTask = req.body.newTask;
    if (newTask.length){
        toDos.push(req.body.newTask);
    }
    res.redirect('/');
})
app.listen(PORT, () => {
    console.log("Server Started on port " + PORT);
})