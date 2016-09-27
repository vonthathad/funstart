var user_name = '';
var arr = [];
var lv = [];
var level = 1;
var dem = 1;
var count = 0;
var soundGameOver = new Howl({
    urls: ['/sources/game/7/sound/clap.wav']
});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
function sortNumber(a, b) {
    return a - b;
}
cp = [
    'Thánh lại hút nhiều thuốc rồi, bình tĩnh và chiến lại nào',
    'Đừng buồn nhé người anh em, có đến 60% số người cũng chung tình cảnh với bạn cơ mà. Lú mà vẫn quyến rũ thì cũng có ối người theo thôi, lo gì.',
    'Đạt đến trình độ này thì hẳn người anh em đây cũng phải dạng vừa đâu, luyện tập thêm tí là đủ tiêu chuẩn làm việc cho Google rồi đấy',
    'Công nhận não bạn có rất nhiều nếp nhăn. Bạn nằm trong top 10% số người chơi tốt nhất rồi đấy.',
    'Ôi chao, sao thế gian lại có người thông minh thế này. 99% số người chơi game này không ai giỏi như bạn đâu!!',
    'Bấy lâu nay thiên tài ẩn dật sống ở đâu đấy, xuất hiện cứu thế giới đi nhanh lên!'
];
data_nx = ['Xuất sắc!', 'Bá đạo!', 'Quá kinh!', ' Hoàn Hảo!', 'Tuyệt vời!', 'WOW!', 'Tiếp nào!', 'Yeah!'];
color = ['red', 'blueviolet', 'blue', 'chocolate', 'crimson', 'darkblue'];
lv[1] = [0, 1, 2, 4, 5, 6, 7, 8, 9];
lv[2] = [0, 2, 3, 4, 6, 7, 8, 9, 10];
lv[3] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[4] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[5] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[6] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[7] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[8] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[9] = [getRandomInt(0, 1), getRandomInt(2, 3), getRandomInt(4, 5), getRandomInt(6, 7), getRandomInt(8, 9), getRandomInt(10, 11), getRandomInt(12, 13), getRandomInt(14, 15), getRandomInt(16, 17)];
lv[10] = [getRandomInt(0, 2), getRandomInt(3, 5), getRandomInt(6, 8), getRandomInt(9, 11), getRandomInt(12, 14), getRandomInt(15, 17), getRandomInt(18, 20), getRandomInt(21, 23), getRandomInt(24, 26)];

lv[11] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[12] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[13] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[14] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[15] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[16] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[17] = [getRandomInt(0, 4), getRandomInt(5, 9), getRandomInt(10, 14), getRandomInt(15, 19), getRandomInt(20, 24), getRandomInt(25, 29), getRandomInt(30, 34), getRandomInt(35, 39), getRandomInt(40, 44)];
lv[18] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[19] = [getRandomInt(0, 2), getRandomInt(15, 17), getRandomInt(19, 21), getRandomInt(33, 35), getRandomInt(36, 38), getRandomInt(66, 68), getRandomInt(70, 72), getRandomInt(80, 83), getRandomInt(97, 99)];
lv[20] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];

lv[21] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];
lv[22] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];
lv[23] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];
lv[24] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];
lv[25] = [getRandomInt(0, 8), getRandomInt(9, 17), getRandomInt(18, 26), getRandomInt(27, 35), getRandomInt(36, 42), getRandomInt(43, 51), getRandomInt(52, 60), getRandomInt(61, 69), getRandomInt(70, 78)];
lv[26] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[27] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[28] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[29] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[30] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];

lv[31] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[32] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[33] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[34] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[35] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[36] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[37] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[38] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[39] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];
lv[40] = [getRandomInt(0, 3), getRandomInt(4, 9), getRandomInt(10, 20), getRandomInt(21, 30), getRandomInt(31, 40), getRandomInt(41, 50), getRandomInt(51, 60), getRandomInt(61, 70), getRandomInt(71, 80)];

lv[41] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[42] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[43] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[44] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[45] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[46] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[47] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[48] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[49] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];
lv[50] = [getRandomInt(15, 21), getRandomInt(30, 37), getRandomInt(50, 59), getRandomInt(70, 78), getRandomInt(80, 86), getRandomInt(87, 89), getRandomInt(90, 92), getRandomInt(93, 95), getRandomInt(96, 99)];


var arrG = [];
var timeG = 30;
var countTime = 30;
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function Countdown(options) {
    var timer,
        instance = this,
        seconds = options.seconds || 10,
        fullTime = seconds,
        warn = fullTime / 2,
        almost = warn / 2,

        updateStatus = options.onUpdateStatus || function () {
            },
        counterEnd = options.onCounterEnd || function () {
            };

    function decrementCounter() {
        updateStatus(seconds);
        if (seconds <= 0) {
            counterEnd();
            instance.stop();
        }
        seconds--;
        // Decrease the bar width:
        var w = ( seconds / fullTime ) * 100;

        $('.timer-bar').css({'width': w + '%'});

        // Manipulate bar according to the value:
        if (seconds == warn) $('.timer-bar').addClass('timer-warn');
        if (seconds == almost) $('.timer-bar').addClass('timer-almost');
    }


    this.start = function () {
        clearInterval(timer);
        timer = 0;
        seconds = options.seconds;
        timer = setInterval(decrementCounter, 100);
    };

    this.stop = function () {
        clearInterval(timer);
    };
}
var myCounter = new Countdown({
    seconds: 60, // number of seconds to count down

    onUpdateStatus: function (sec) {
        $('.timeGame').html(sec / 10 + 's');
    }, // callback for each second
    onCounterEnd: function () {
        result();
    }
})

var myCounter2 = new Countdown({
    seconds: 80, // number of seconds to count down

    onUpdateStatus: function (sec) {
        $('.timeGame').html(sec / 10 + 's');
    }, // callback for each second
    onCounterEnd: function () {
        result();
    }
})


function new_lv(level) {
    var rand_bg = Math.floor(Math.random() * color.length);
    if (level <= 10) {
        myCounter.start();
    } else {
        myCounter2.start();
    }

    $('.timer-bar').removeClass('timer-warn').removeClass('timer-almost');
    count = 0;
    dem = 1;
    $('.to').html(level);
    arr.splice(0, arr.length);
    //console.log(arr);
    var a = $('.box');
    a.css('background-color', color[rand_bg]);
    a.attr('id', '');
    a.text('');
    a.css('opacity', '1');
    shuffle(lv[level]);
    for ( var i = 0; i < lv[level].length; i++) {
        $('.box' + i).html(lv[level][i]);
        $('.box' + i).attr('id', lv[level][i]);
    }
    lv[level].sort(sortNumber);
}
function result() {
    console.log('show result' + level);

    myCounter.stop();
    myCounter2.stop();

    soundGameOver.play();
    $('.so').html(level);
    if (level <= 10) {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[0]);
    } else if (level > 10 && level <= 20) {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[1]);
    } else if (level > 21 && level <= 30) {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[2]);
    } else if (level > 31 && level <= 40) {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[3]);
    } else if (level > 41 && level < 50) {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[4]);
    } else {
        $('.nd').html('<span class="td">Level ' + level + '</span><br>' + cp[5]);
    }

    fsGame.gameOver(level);
    fsGame.setResultHtml($("#showResult").html());
    fsGame.createShare({
        share: false,
        name: fsGame.user.name + " đã đạt số điểm là: " + level,
        des : "Bạn có phải là người nhanh tay nhanh mắt nhất Việt Nam?"
    });

}
$(document).ready(function () {

    $("body").off().on('click', '.box', function () {
        var soundSuccess = new Howl({
            urls: ['/sources/game/7/sound/' + dem + '.wav']
        });
        id_now = $(this).attr('id');
        arr.push(id_now);

        if (arr[count] == lv[level][count]) {
            soundSuccess.play();
            $('#' + arr[count]).css('opacity', '0');
            count++;
            dem++;
        } else {
            //soundError.play();
            arr.pop(arr[count]);

            $(".timeGame").css('color', 'red');
            setTimeout(function() {
                $(".timeGame").css('color', '#201f56');
            }, 500)
        }

        if (arr.length == 9) {
            myCounter.stop();
            myCounter2.stop();
            $('#txt').html(data_nx[Math.floor(Math.random() * data_nx.length)]);
            $('#txt').fadeIn().fadeOut();
            //soundNextLevel.play();
            level++;
            if (level == 50) {
                myCounter.stop();
                myCounter2.stop();
                result();
            }
            setTimeout(function () {
                new_lv(level);
            }, 1000);
        }


    });

    user_name = fsGame.user.name;

    fsGame.gameStart(function(){
        arr = [];
        level = 1;
        dem = 1;
        count = 0;

        shuffle(lv[1]);
        for (i = 0; i < lv[1].length; i++) {
            $('.box' + i).html(lv[1][i]);
            $('.box' + i).attr('id', lv[1][i]);
        }
        lv[1].sort(sortNumber);

        myCounter.stop();
        myCounter2.stop();

        new_lv(level);
    });

});