module.exports = function (){
    let date = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric' };
    console.log(date.toLocaleString());
    return date.toLocaleString('en-IN', options);
}