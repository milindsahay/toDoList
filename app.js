const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + '/date');
const PORT = process.env.PORT || 3000;
const app = express();

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

const listsSchema = {
    name: String,
    items: [itemSchema]
}
const List = mongoose.model('List', listsSchema);
app.get("/", (req, res) => {
    Item.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("DB updated successfully");
                    }
                })
            }
            res.render('index', {date: date(), toDos: result, type: "Today"});
        }
    })

})
app.get('/:category', (req, res) => {
    const listName = _.capitalize(req.params.category);
    List.findOne({name: listName}, (err, result) => {
        if (!err) {
            if (result) {
                res.render('index', {date: date(), toDos: result.items, type: listName})
            } else {
                const list = new List({
                    name: listName,
                    items: defaultItems
                })
                list.save();
                res.redirect('/' + listName);
            }

        }
    })
})
app.post('/', (req, res) => {
    let newTask = req.body.newTask;
    const newItem = new Item({item: newTask});
    if (newTask.length) {
        if (req.body.button == "Today") {
            newItem.save();
            res.redirect('/');
        }
        else{
            const category = req.body.button;
            List.findOne({name:category}, (err, result)=>{
                if(!err){
                    result.items.push(newItem);
                    result.save();
                    console.log(result);
                }
                else {
                    console.log(err);
                }
                res.redirect('/'+category);
            })
        }
    }
})
app.post('/delete', (req, res) => {
    const listName = req.body.listName;
    const itemID = req.body.checkbox;
    if (listName === "Today") {
        Item.findByIdAndDelete(itemID, (err) => {
            if (!err) {
                console.log("Successfully deleted the entry");
            }
            res.redirect('/');
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, (err, result) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/' + listName);
        })
    }

})
app.listen(PORT, () => {
    console.log("Server Started on port " + PORT);
})