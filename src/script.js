import $ from "jquery";
import {createApp} from "vue";

const DAILY_C = 'DAILY'
const ALL_C = 'ALL'
const BAN = 'BAN';
const USD = 'USD';
var timeoutCloseNotif;
var lastConversionFrom;





$(function () {
    let inputField = $('#input_id');
    inputField.on('keypress', function (e) {
        let key = e.which;
        if (key === 13) fetchBananoUserStats();
    });
    $("#btn_submit").on('click', () => fetchBananoUserStats());


    let storedUserID = localStorage.getItem("user");
    inputField.val(storedUserID);
    if (storedUserID) fetchBananoUserStats();


    setConversionInputListeners();


    let savedList = localStorage.getItem("currentList");
    app4.currentList = savedList ? savedList : app4.DAILY;


});


function setConversionInputListeners() {
    let inputField = $('#ban_amount');
    inputField.on('keypress', function (e) {
        var key = e.which;
        if (key === 13) doConversion(BAN);
    });

    let inputUSD = $('#usd_amount');
    inputUSD.on('keypress', function (e) {
        var key = e.which;
        if (key === 13) doConversion(USD);
    });

    let inputExchangeRate = $('#exchange_rate');
    inputExchangeRate.on('keypress', function (e) {
        var key = e.which;
        if (key === 13) doConversion(lastConversionFrom ? lastConversionFrom : BAN);
    });

    inputField.on('paste', () => {
        doConversion(BAN);
    });
    inputUSD.on('paste', () => {
        doConversion(USD);
    });
    inputExchangeRate.on('paste, keyup', () => {
        doConversion(lastConversionFrom ? lastConversionFrom : BAN);
    });
    return inputField;
}


var app4 = createApp({
    data() {
        return {
            DAILY: DAILY_C,
            ALL: ALL_C,

            currentList: this.DAILY,
            todos: [],
            dailyData: [],
            isLoadingStats: false,
            badInput: false,
            fetchDate: '',
        }
    },

    methods: {
        switchList: function () {
            this.currentList = this.currentList === this.DAILY ? this.ALL : this.DAILY;
            localStorage.setItem("currentList", this.currentList);
        },
    }
});
app4.mount('#app-4')


var app3 = createApp({
    data() {
        return {
            exchange_rate: 0.04826,
        }
    },

    methods: {
        convertt: function (from) {
            doConversion(from);
        }
    }
});
app3.mount('#app-3')


var app2 = createApp({
    data() {
        return {
            ranges: [{text: 'Past week', intVal: 7}, {text: 'Past 30 days', intVal: 30}, {text: 'All time', intVal: -1}],
            rangeIndex: 1,


            averagePaymentsPerDay: 0,
            averageWUs: 0,
            averagePoints: 0,
            banPerPoint: 0,
            totalAmount: 0,
            userID: -1,
            userName: '',
        }
    },

    computed: {
        currentIndex: function () {
            return this.rangeIndex;
        },

        currentItem: function () {
            return this.ranges[this.currentIndex];
        }
    },

    methods: {
        copyText: function (text) {
            copyText(text);
        },

        changeRange: function (index) {
            this.rangeIndex = index;
            calcStats(this.currentItem);
        },
    }
});
app2.mount('#app-2')


var app_notification = createApp({
    data() {
        return {
            notificationText: '',
        }
    },
    methods: {
        emptyNotificationText: function () {
            this.notificationText = '';
        },

        setText: function (text) {
            this.notificationText = text;
        }
    }
});
app_notification.mount("#app_notification");


function notify(text, duration = 5000) {
    //prevent dismiss of other messages. e.g., user closes notification but it is scheduled to be closed in 2s.
    if (timeoutCloseNotif) clearTimeout(timeoutCloseNotif);
    app_notification.emptyNotificationText();

    app_notification.setText(text);
    timeoutCloseNotif = setTimeout(app_notification.emptyNotificationText, duration);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(function () {
        notify("Copied to clipboard!");
        //console.log('Async: Copying to clipboard was successful!');


    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function getRate(from) {
    let exchangeRate = $('#exchange_rate').val();
    if (!exchangeRate) {
        exchangeRate = app3.exchange_rate;
        $('#exchange_rate').val(exchangeRate);
    }


    if (from === 2) exchangeRate = 1 / exchangeRate;

    return exchangeRate;
}


function doConversion(from) {
    let exchangeRate = getRate(from);
    let amountFrom = $((from === 1) ? '#ban_amount' : '#usd_amount').val();
    let conversionResult = amountFrom * exchangeRate;

    //console.log('amountBAN ' + amountFrom + ', exchangeRate ' + exchangeRate + ', conversionResult ' + conversionResult);

    $((from === 2) ? '#ban_amount' : '#usd_amount').val(conversionResult.toFixed(2));

    // let headers = new Headers();
    // headers.append('Accepts', 'application/json');
    // headers.append('X-CMC_PRO_API_KEY', 'X');
    // headers.append('Access-Control-Allow-Origin', 'http://localhost:5500');
    //
    //
    // fetch('http://coinmarketcap.com/currencies/banano', {headers: headers})
    //     .then(res => res.json()).then((out) => {
    //     console.log("json " + out)
    // }).catch(err => alert("HTTP-Error: " + err));


    lastConversionFrom = from;
}


function checkFetchingTooSoon() {
    var fetchTime = localStorage.getItem("last_fetch");
    if (!fetchTime) fetchTime = "01.01.1970 00:01"
    let fetchDate = new Date(fetchTime);
    var timeNow = Date.now();


    var diff = timeNow - fetchDate;
    var diffMinutes = diff / 60000;
    console.log("diffMins " + diffMinutes)

    //dont fetch too often!
    app4.isLoadingStats = true; //to change button to loading
    if (diffMinutes < 2 && diffMinutes !== 0) {
        app4.fetchDate = fetchDate.toDateString() + ' ' + fetchDate.toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});

        app4.todos = JSON.parse(localStorage.getItem("list"));
        notify("Please wait a few minutes before making a new request. Restored list from cache", 8000);

        createDailyList();
        calcStats(app2.currentItem)
        return true;
    }

    return false;
}


function fetchBananoUserStats() {
    var userID = $('#input_id').val();
    if (!userID) {
        app4.badInput = true;
        setTimeout(() => app4.badInput = false, 500);
        notify("Please enter your user ID")
        return;
    }


    var url = 'https://bananominer.com/user_name/' + userID;
    app2.userID = userID;

    let storedUserID = localStorage.getItem("user");
    if (storedUserID === userID) {
        let tooSoon = checkFetchingTooSoon();
        if (tooSoon) return; //fetching too soon, user has to wait a bit

    } else {
        //fetching info for different user than before
        //no need to check time diff then
    }

    app2.userName = localStorage.getItem('user_name');


    fetch(url)
        .then(res => res.json())
        .then((out) => {
            if (out.error != null) {
                alert(out.error)
                return;
            }

            let reversedList = out.payments.reverse();

            let previousScore = 0;
            let previousWUs = 0;
            app4.todos.splice(0); //clear existing data before adding new
            $.each(reversedList, function (key, val) {
                let score = val.score - previousScore;
                let wus = val.work_units - previousWUs;

                //console.log('val.amount ' + val.amount + ', score ' + score + ', wus ' + wus);

                app4.todos.push({
                    amount: val.amount,
                    points: score,
                    work_units: wus,
                    created_at: new Date(val.created_at).toISOString().slice(0, 10)
                })

                previousScore = val.score;
                previousWUs = val.work_units;
            });


            app4.todos = app4.todos.reverse();

            createDailyList();
            calcStats(app2.currentItem);


            app2.userName = out.user.name.toString();


            let date = new Date(Date.now());
            app4.fetchDate = date.toDateString() + ' ' + date.toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});

            localStorage.setItem("last_fetch", date);
            localStorage.setItem("list", JSON.stringify(app4.todos));
            localStorage.setItem("user", userID.toString());
            localStorage.setItem("user_name", out.user.name.toString());


            notify("Updated 🍌!");

        }).catch(err => console.log(err));


}


function createDailyList() {
    var myList = app4.todos;
    let myMap = new Map();

    $.each(myList, function (key, val) {
        var createdAt = new Date(val.created_at);

        var myDate = new Date(createdAt.setHours(0, 0, 0, 0)); //remove time
        let dateKey = myDate.toString();
        if (myMap.has(dateKey)) {

            let existingItem = myMap.get(dateKey);
            let myNewVal = {amount: val.amount, work_units: val.work_units, points: val.points, created_at: val.created_at};

            let prevAmount = existingItem.amount;
            myNewVal.amount += prevAmount;

            let prevWU = existingItem.work_units;
            myNewVal.work_units += prevWU;

            let prevPoints = existingItem.points;
            myNewVal.points += prevPoints;


            myMap.set(dateKey, myNewVal);

        } else {
            myMap.set(dateKey, val);
        }

    });


    app4.dailyData.splice(0);
    myMap.forEach(function (value) {
        app4.dailyData.push({
            amount: value.amount,
            points: value.points,
            work_units: value.work_units,
            created_at: value.created_at,
        });
    });
}


function calcStats(range) {
    let maxDaysAgo = range.intVal;

    let dataForCalc = [];
    app4.dailyData.forEach(function (value) {
        //console.log('fe',value);
        if (maxDaysAgo !== -1) { //if it were -1, then we know that is all data, the full list of payments

            let dateNow = new Date(Date.now());
            let diff = dateNow - new Date(value.created_at);
            let daysDiff = diff / (1000 * 60 * 60 * 24);
            if (daysDiff > maxDaysAgo) return false; //dont want older data than maxDays old
        }

        dataForCalc.push(value);
    });


    app2.averagePaymentsPerDay = dataForCalc.reduce((total, next) => total + next.amount, 0) / dataForCalc.length;
    app2.averageWUs = dataForCalc.reduce((total, next) => total + next.work_units, 0) / dataForCalc.length;
    app2.averagePoints = dataForCalc.reduce((total, next) => total + next.points, 0) / dataForCalc.length;


    let banPerPointList = [];
    dataForCalc.forEach((value) => banPerPointList.push({bpp: value.amount / value.points}));
    app2.banPerPoint = banPerPointList.reduce((total, next) => total + next.bpp, 0) / banPerPointList.length;


    app2.totalAmount = dataForCalc.reduce((prev, next) => prev + next.amount, 0);


    setTimeout(() => {
        app4.isLoadingStats = false;
    }, 600);
}


