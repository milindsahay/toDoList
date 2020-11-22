const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date');
const PORT = process.env.PORT || 3000;
const app = express();

let toDos = [];
let workToDos = [];
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/toDoListDB', {useNewUrlParser: true});
const itemSchema = {
    item: String
}
const Item = mongoose.model('Item', itemSchema);
const item1 = new Item({item: "Welcome to your To do list"});
const item2 = new Item({item: "Hit + to add new item"});
const item3 = new Item({item: "<-- hit this to delete this item"});
const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB updated successfully");
    }
})
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