const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date');
const PORT = process.env.PORT || 3000;
const app = express();

let toDos = [];
let workToDos = [];
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.render('index', {date: date(), toDos: toDos, type: "To Do"});
})
app.get('/work', (req, res) => {
    res.render('index', {date: date(), toDos: workToDos, type: "Work"})
})
app.post('/', (req, res) => {
    let newTask = req.body.newTask;
    if (newTask.length) {
        toDos.push(newTask);
    }
    res.redirect('/');
})
app.post('/work', (req, res) => {
    let newTask = req.body.newTask;
    if (newTask.length) {
        workToDos.push(newTask);
    }
    res.redirect('/work');
})
app.listen(PORT, () => {
    console.log("Server Started on port " + PORT);
})