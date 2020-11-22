module.exports = function (){
    let date = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleString('en-IN', options);
}