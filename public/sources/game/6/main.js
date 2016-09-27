var lv = 1;
var level = 1;
var elW;

data = [
    "Bạn quả thật là thiên tài!Bạn có khả năng tập trung siêu cao độ và khả năng nhìn nhận tổng quan của vấn đề rất tốt. Mức độ thiên tài của bạn cao hơn người bình thường đến 50 lần!<br>SHARE ĐỂ THÁCH ĐỐ BẠN BÈ NHÉ",
    "Bạn có khả năng tập trung siêu cao độ và khả năng nhìn nhận tổng quan của vấn đề rất tốt. Mức độ thiên tài của bạn cao hơn người bình thường đến 50 lần!<br>SHARE ĐỂ THÁCH ĐỐ BẠN BÈ NHÉ",
    "Bạn có khả năng phân tích và tập trung ngang ngửa với một thiên tài, chỉ cần trau dồi hơn về sự cẩn thận, và tỷ mỹ thì chắc chắn bạn nằm trong top 1% những người thông minh lanh lợi nhất thế giới!<br>SHARE ĐỂ THÁCH ĐỐ BẠN BÈ NHÉ",
    "Bạn có khả năng tập trung cao hơn người bình thường! Chỉ cần bạn nhìn ra thế mạnh lanh lợi và tinh mắt của mình và ngày càng phát triển nó, sớm muộn gì bạn cũng trở thành một thiên tài không ai sánh bằng!<br>SHARE ĐỂ THÁCH ĐỐ BẠN BÈ NHÉ",
    "Bạn đã không tập trung trong lúc chơi đúng không? Thử lại lần nữa nào, đảm bảo bạn sẽ nghiện luôn trò chơi này đấy<br>SHARE ĐỂ THÁCH ĐỐ BẠN BÈ NHÉ"
];
data_nx = ['Xuất sắc!', 'Bá đạo!', 'Quá kinh!', ' Hoàn Hảo!', 'Tuyệt vời!', 'WOW!'];

var dataM = [];
dataM[0] = ['<img src="/sources/game/6/images/1.jpg">', '<img src="/sources/game/6/images/1_2.jpg">'];
dataM[1] = ['<img src="/sources/game/6/images/3.jpg">', '<img src="/sources/game/6/images/3_2.jpg">'];
dataM[2] = ['<img src="/sources/game/6/images/4_2.jpg">', '<img src="/sources/game/6/images/4.jpg">'];
dataM[3] = ['<img src="/sources/game/6/images/5.jpg">', '<img src="/sources/game/6/images/5_2.jpg">'];
dataM[4] = ['<img src="/sources/game/6/images/16_2.jpg">', '<img src="/sources/game/6/images/16.jpg">'];
dataM[5] = ['<img src="/sources/game/6/images/7.jpg">', '<img src="/sources/game/6/images/7_2.jpg">'];
dataM[6] = ['<img src="/sources/game/6/images/8_2.jpg">', '<img src="/sources/game/6/images/8.jpg">'];
dataM[7] = ['<img src="/sources/game/6/images/9.jpg">', '<img src="/sources/game/6/images/9_2.jpg">'];
dataM[8] = ['<img src="/sources/game/6/images/10.jpg">', '<img src="/sources/game/6/images/10_2.jpg">'];
dataM[9] = ['<img src="/sources/game/6/images/11.jpg">', '<img src="/sources/game/6/images/11_2.jpg">'];
dataM[10] = ['<img src="/sources/game/6/images/13.jpg">', '<img src="/sources/game/6/images/13_2.jpg">'];
dataM[11] = ['<img src="/sources/game/6/images/15.jpg">', '<img src="/sources/game/6/images/15_2.jpg">'];
dataM[12] = ['<img src="/sources/game/6/images/6.jpg">', '<img src="/sources/game/6/images/6_2.jpg">'];


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
    }

    this.changeTime = function () {
        seconds = seconds - 30;
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
    seconds: 200,  // number of seconds to count down
    onUpdateStatus: function (sec) {
        $('.timeGame').html(sec / 10 + 's');
    }, // callback for each second
    onCounterEnd: function () {

        myCounter.stop();

        $('.nd1').html('Bạn đạt Level ' + level);
        if (level < 5) {
            $('.nd2').html(data[4]);
        } else if (level >= 5 && level <= 9) {
            $('.nd2').html(data[3]);
        } else if (level >= 10 && level <= 16) {
            $('.nd2').html(data[2]);
        } else if (level >= 17 && level <= 24) {
            $('.nd2').html(data[1]);
        } else {
            $('.nd2').html(data[0]);
        }

        $('.nd1,.nd2,.gameBg').css('display', 'block');

        fsGame.gameOver(level);
        fsGame.setResultHtml($("#showResult").html());
        fsGame.createShare({
            share: true,
            name : "Tìm hình khác biệt [90% người chơi không thể vượt qua level 30]",
            des : 'Còn bạn thì sao? Nhấn vào chơi ngay!!!',
        });

    }
});

newLevel = function (lIndex, lv) {

    for (var i = 0; i < ((lv + 1) * (lv + 1) - 1); i++) {
        arrG.push(dataM[lIndex][1]);
    }

    arrG.insert(Math.floor(Math.random() * arrG.length), dataM[lIndex][0]);
    elW = $('.gBox').width() / (lv + 1);
    elH = $('.gBox').height() / (lv + 1);

    for (var i = 0; i <= lv; i++) {
        for (var j = 0; j <= lv; j++) {
            var ind = (lv + 1) * i + j;
            $('.gBox').append('<div class="boxElem" style="width:' + elW + 'px;height:' + elH + 'px;float: left">' + arrG[ind] + '</div>');

        }

    }

}

var count = 0;
$(window).ready(function () {

    $("body").off().on('click', '.boxElem', function () {
        console.log('click 2 times');
        if ($(this).html().split(/"/)[1] == dataM[lIndex][0].split(/"/)[1]) {

            $('#txt').html(data_nx[Math.floor(Math.random() * data_nx.length)]);
            $('#txt').fadeIn('fast').fadeOut('fast');
            $('.gBox').empty();
            level++;
            count++;
            if (count == 3 * lv) {
                lv++;
            }

            setupNewLevel();

        } else {

            $('.gBox2').fadeIn('fast').fadeOut('slow');
            myCounter.changeTime();
        }
        var b = window.innerWidth;
        if (b < 750) {

            if (level >= 6 && level < 8) {
                $('.gBox img').css('width', '20vw');
            } else if (level >= 8 && level < 12) {
                $('.gBox img').css('width', '16vw');
            } else if (level >= 12 && level < 17) {
                $('.gBox img').css('width', '12vw');
            } else if (level >= 17) {
                $('.gBox img').css('width', '8vw');
            }
        } else {
            if (level >= 10 && level < 19) {
                $('.gBox img').css('width', '80px');
            } else if (level >= 19 && level < 22) {
                $('.gBox img').css('width', '63px');
            } else if (level >= 22 && level < 34) {
                $('.gBox img').css('width', '48px');
            } else if (level >= 34 && level < 40) {
                $('.gBox img').css('width', '38px');
            } else if (level >= 40) {
                $('.gBox img').css('width', '33px');
            }
        }
    });
    fsGame.gameStart(function(){
        $('.gBox').empty();

        level = 1;
        lv = 1;
        count = 0;
//        $('.levelGame').html('Lv.<span class="to">' + level + '</span>');

        setupNewLevel()
    });

    function setupNewLevel() {
        $('.levelGame').html('Lv.<span class="to">' + level + '</span>');

        arrG = [];
        lIndex = Math.floor(Math.random() * dataM.length);
        newLevel(lIndex, lv);

        myCounter.stop();
        myCounter.start();
    }
})