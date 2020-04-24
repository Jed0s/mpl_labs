/*** ЗАПРОСЫ И НАЧАЛЬНЫЕ НАСТРОЙКИ ***/
/*** ----------------------------- ***/
const http = require("http");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let express = require('express');

let app = express();
app.set('views', __dirname + '/templates');
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
/*** ----------------------------- ***/
/*** ЗАПРОСЫ И НАЧАЛЬНЫЕ НАСТРОЙКИ ***/


/*** РАБОТЫ С БД ***/
/*** ----------- ***/
let db = new sqlite3.Database('db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Подключение к БД выполнено успешно.');
});

let groupArr = [];
let sqlGROUP = `SELECT * FROM 'group' ORDER BY id`;
db.all(sqlGROUP, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        groupArr.push(row);
    });
});
/*** ----------- ***/
/*** РАБОТЫ С БД ***/


/*** ОБРАБОТКА ЗАПРОСОВ ***/
/*** ------------------ ***/
let selectedOrder = 'id';
let selectedGroupID = 1;
let selectedGroupIDbyDefault = -1;

app.get('/', (req, res) => {
    res.render('./home', { groupList: groupArr })
});

function showStudents(res, arr) {
    res.render('./studentList', { studentsList: arr });
}
function loadData(req, res) {
    let studentsArr = [];
    let sqlShowCurrentGroup = `SELECT * FROM student WHERE groupID = ${selectedGroupID} ORDER BY ${selectedOrder}`;
    db.all(sqlShowCurrentGroup, [], (err, rows) => {
        if (err) { throw err; }
        rows.forEach((row) => {
            let isExist = 0
            for (let i = 0; i < studentsArr.length; i++) {
                if (studentsArr[i].id === row.id) { isExist = 1 }
            }
            if (!isExist) {
                studentsArr.push(row);
            }
        });
    });
    selectedGroupIDbyDefault = selectedGroupID;
    setTimeout(showStudents, 100, res, studentsArr);
}
app.post('/', (req, res) => {
    selectedGroupID = req.body.selectGroup;
    if (!(selectedGroupIDbyDefault === selectedGroupID)) {
        loadData(req, res)
    }
});

app.post('/toHomePage', (req, res) => {
    res.redirect('/');
});
app.post('/orderChoice', (req, res) => {
    selectedOrder = req.body.sortChoice;
    loadData(req, res);
})
/*** ------------------ ***/
/*** ОБРАБОТКА ЗАПРОСОВ ***/


/*** ЗАПУСК СЕРВЕРА ***/
/*** -------------- ***/
const httpServer = http.createServer(app);
httpServer.on('listening', () => {
    console.log("Сервер начал прослушивание запросов на порту 3000");
});
httpServer.listen(3000, 'localhost');
/*** -------------- ***/
/*** ЗАПУСК СЕРВЕРА ***/