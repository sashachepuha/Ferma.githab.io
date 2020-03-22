var cvs = document.getElementById('game')
var ctx = cvs.getContext('2d')
var width = 1500, height = 1500

cvs.width = width
cvs.height = height

// персонажи на старте
var cowAmount = 5
var chickenAmount = 6
var wheatAmount = 3

// сторона игрового поля
var fieldSize = 8

var resource = []
var products = []

var milkSum = 0
var eggSum = 0
var money = 0

// объект сущности
class Essence {
    constructor(name, x, y, src) {
        this.name = name
        this.x = x
        this.y = y
        this.img = new Image()
        this.img.src = src
        this.selected = false
        this.progres = 0
        this.progresValue = 0
        this.isEmpty = true
        if (this.name == 'chicken'){
            this.step = 10
            this.time = 0
        }
        if (this.name == 'cow'){
            this.step = 20
            this.time = 0
        }
        if (this.name == 'wheat'){
            this.step = 10
            this.time = 10
        }
    }
    draw () {
        ctx.drawImage(this.img, this.x, this.y)
    }
    getResource(){
        if (this.name == 'cow'){
            this.time += 20
        }
        if (this.name == 'chicken'){
            this.time += 30
        }
    }
    giveProduct(name, arr){
        if (name == 'egg') {
            arr.push(new Essence(name, this.x, this.y, 'img/egg.png'))
        }
        if (name == 'milk') {
            arr.push(new Essence(name, this.x, this.y, 'img/milk.png'))
        }
        if (name == 'wheat') {
            arr.push(new Essence(name, this.x, this.y, 'img/wheat1.png'))
        }
    }
    timer(name, arr){
        if (this.time >= this.step && this.time%this.step == 0){
            var interval = setInterval(() => {
                if (this.time != 0){
                    this.time -= 1
                    this.progres += 1
                    this.progresValue = this.progres / this.step * 100
                }
                if (this.progres%this.step == 0) {
                    this.progres = 0
                    this.progresValue = 0
                    clearInterval(interval)
                    this.giveProduct(name, arr)
                    this.timer(name, arr)
                }
            }, 1000);
        }
    }
}

// игровое поле
var stepX = 100, stepY = -100, j=0
var i = 0, field = []
for(; i<(fieldSize * fieldSize); i++) {
    if (i%fieldSize == 0){
        stepY += stepX
        j = 0
    }
    field.push(new Essence('field', j * stepX, stepY, 'img/field.png'))
    j += 1
}

// создаем сушности
var essences = []
var Cow = new Essence('cow', 0, 0, 'img/cow.png')
var Chicken = new Essence('chicken', 0, 0, 'img/chicken.png')
var Wheat = new Essence('wheat', 0, 0, 'img/wheat.png')

var makeEssence = function(Amount, obj){
    var j = 0
    for (i in field){
        if(field[i].isEmpty == true){
            obj.x = field[i].x
            obj.y = field[i].y
            essences.push(new Essence(obj.name, obj.x, obj.y, obj.img.src))
            essences[i].timer('wheat', resource)
            field[i].isEmpty = false
            j += 1
            if (j == Amount) {
                break
            }
        }
    }
}

makeEssence(cowAmount, Cow)
makeEssence(chickenAmount, Chicken)
makeEssence(wheatAmount, Wheat)

var sell = function() {
    money += (eggSum * 5) + (milkSum * 10)
    eggSum = 0,
    milkSum = 0
} 

var bay = function(price, obj){
    if(money >= price){
        var essence = new Essence(obj.name, mouse.x, mouse.y, obj.img.src)
        selected = essence
        essences.push(essence)
        selected.timer('wheat', resource)
        money -= price
    }
    else {
        alert('Не хватает монеток')
    }
}

// работа с курсором
var mouse = {
    x : 0,
    y : 0
}
// выделеный объект
var selected = false

// проверка находится ли курсор над обьектом
var isCursorIn = function (essence) {
    return mouse.x > essence.x && mouse.x < essence.x + essence.img.width &&
    mouse.y > essence.y && mouse.y < essence.y + essence.img.height
}
// отрисовка
setInterval(function(){
    document.getElementById('egg__val').innerText = "x " + eggSum
    document.getElementById('milk__val').innerText = "x " + milkSum
    document.getElementById('money').innerText = money + " монет"
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    for (i in field) {
        field[i].draw()
    }
    for (i in essences) {
        ctx.fillText("Ресурс: " + essences[i].time, essences[i].x + 5, essences[i].y + 10);
        ctx.fillRect(essences[i].x, essences[i].y + 95, Math.floor(essences[i].progresValue), 5)
        essences[i].draw()
    }
    for (i in resource) {
        resource[i].draw()
    }
    for (i in products) {
        products[i].draw()
    }
    if (selected) {
        selected.x = mouse.x - selected.img.width / 2
        selected.y = mouse.y - selected.img.height / 2
    }
}, 30)

// события мыши
window.onmousemove = function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
}

var itemX, itemY
window.onmousedown = function() {
    // сбор продуктов
    for (i in products) {
        if (isCursorIn(products[i])&&products[i].name == 'milk') {
            milkSum += 1
            products.splice(i, 1)
        }
    }
    for (i in products) {
        if (isCursorIn(products[i])&&products[i].name == 'egg') {
            eggSum += 1
            products.splice(i, 1)
        }
    }
    // перемешение объекта
    if(!selected) {
        for (i in essences) {
            if (isCursorIn(essences[i])) {
                selected = essences[i]
                itemX = essences[i].x
                itemY = essences[i].y
            }
        }
        for (i in resource) {
            if (isCursorIn(resource[i])) {
                selected = resource[i]
                resource[i].selected = true
                itemX = resource[i].x
                itemY = resource[i].y
            }
        }
        for (i in essences) {
            if (isCursorIn(essences[i]) && essences[i].name == 'wheat') {
                if(essences[i].time ==0){
                    essences[i].time = 10
                    essences[i].timer('wheat', resource)
                }
            }
        }
        for (i in field){
            if(field[i].x==itemX&&field[i].y==itemY){
                field[i].isEmpty = true
            }
        }
    }
}

window.onmouseup = function() {
    // постоянный рост пшеницы
    for (i in essences) {
        if (isCursorIn(essences[i])&&selected.name == 'wheat'&&essences[i].name == 'chicken') {
            essences[i].getResource()
            essences[i].timer('egg', products)
        }
        if (isCursorIn(essences[i])&&selected.name == 'wheat'&&essences[i].name == 'cow') {
            essences[i].getResource()
            essences[i].timer('milk', products)
        }
    }
    // перемешение объекта
    for (i in field) {
        if (isCursorIn(field[i])) {
            selected.x = field[i].x
            selected.y = field[i].y
        }
        if (isCursorIn(field[i])&& field[i].isEmpty == false) {
            selected.x = itemX
            selected.y = itemY
        }
    }
    for (i in field){
        if(field[i].x==selected.x&&field[i].y==selected.y){
            field[i].isEmpty = false
        }
    }
    for (i in resource) {
        if (resource[i].selected){
            resource.splice(i, 1)
        }
    }
    selected = false
}
