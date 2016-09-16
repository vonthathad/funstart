var arr = [];
var diem = 0;
var level = 1;
var dem = 1;
var count = 0;

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
num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121];
color = ['#a52a2a', '#e86298', '#8a2be2', '#9acd32', '#2e8b57', '#b8860b', '#663399', '#cd853f', '#800080', '#cd5c5c', 'black', '#2e8b57', '#6b8e23', '#008b8b', '#ff6347', '#ffa500'];

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
var isPaused = false;
function Countdown(options) {
    var timer,
        instance = this,
        seconds = options.seconds || 10,
        fullTime = seconds,

        updateStatus = options.onUpdateStatus || function () {
            },
        counterEnd = options.onCounterEnd || function () {
            };

    function decrementCounter() {
        if (!isPaused) {
            updateStatus(seconds);
            if (seconds <= 0) {
                counterEnd();
                instance.stop();
            }
            seconds--;
            // Decrease the bar width:
            var w = ( seconds / fullTime ) * 100;
            $('.timer-bar').css({'width': w + '%'});

        }
    }

    this.changeTime = function () {
        seconds = seconds - 20;
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
    seconds: 120, // number of seconds to count down

    onUpdateStatus: function (sec) {
        $('.tg').html(sec / 10 + 's');
    }, // callback for each second
    onCounterEnd: function () {
        $('#' + dem).addClass('animated shake');
        setTimeout(function () {
            result();
        }, 1000);
    }
})

var myCounter2 = new Countdown({
    seconds: 140, // number of seconds to count down
    onUpdateStatus: function (sec) {
        $('.tg').html(sec / 10 + 's');
    }, // callback for each second
    onCounterEnd: function () {
        $('#' + dem).addClass('animated shake');
        setTimeout(function () {
            result();
        }, 1000);
    }
})

function result() {
    $('.so').html(diem);
    $('.des').html('<span class="dam">Game tìm số kinh điển thời học sinh!<br></span>' + 'Bạn đã tìm được đến số ' + dem + '. Hãy cố gắng click thật nhanh để được cộng thêm điểm nhé!');
    if (count < 121) {
        $('.nd').html('<span class="td"> Bạn tìm đến số thứ ' + dem + '</span><br>Tổng điểm: ' + diem);
    } else {
        $('.nd').css('top', '114px');
        $('.nd').html('<span class="td">Quá xuất sắc!</span><br>Bạn đã tìm hết được các số<br>Tổng điểm:' + diem);

    }
    $(".part01").css("display", "none");

    fsGame.gameOver(diem);
    fsGame.setResultHtml($(".total_game").html());
    fsGame.createShare({
        share: false,
        htmlTag: "#canvanImg",
        name: "Bạn là người nhanh tay nhanh mắt nhất Việt Nam?",
        des: fsGame.user.name + " đạt được " + diem + '. Còn bạn thì sao? Nhấn vào chơi ngay!!!'
    });
}

$(document).on('click touchstart', '.box', function () {
    var id_now = $(this).attr('id');
    arr.push(id_now);

    if (arr[count] == num[count]) {
        var cr_time = parseFloat($('.tg').text());
        if ((cr_time <= 12 && cr_time >= 9) || (cr_time <= 14 && cr_time >= 10)) {
            diem = diem + 10;

        } else if (cr_time < 8 && cr_time >= 6) {
            diem = diem + 8;
        } else if (cr_time < 6 && cr_time >= 4) {
            diem = diem + 6;
        } else if (cr_time < 4 && cr_time >= 2) {
            diem = diem + 4;
        } else {
            diem = diem + 2;

        }

        if ((cr_time <= 12 && cr_time >= 9) || (cr_time <= 14 && cr_time >= 11)) {
            $('#txt').fadeIn('fast').fadeOut(400);
            myCounter.stop();
            myCounter2.stop();
            myCounter2.start();
        } else {
            myCounter.stop();
            myCounter2.stop();
            myCounter.start();
        }
        $('.levelGame').addClass('animated wobble');
        $('#' + num[count]).css('border', '2px solid crimson');
        $('.levelGame').html(diem);
        setTimeout(function () {
            $('.levelGame').removeClass('animated wobble');
        }, 500);
        count++;
        dem++;
        $('.gnum').html(dem);

    } else {
        //soundError.play();
        arr.pop(arr[count]);
    }


    if (count == 121) {
        myCounter.stop();
        myCounter2.stop();

        result();
    }

});
$(document).ready(function () {
    $('.popup-btn').click(function (e) {
        $('.popup-wrap').fadeIn(250);
        $('.popup-box').removeClass('transform-out').addClass('transform-in');
        e.preventDefault();
        $('.tm').html($('.tg').text());
        $('.gl').html(dem);
        $('.sc').html(diem);
        e.preventDefault();
        isPaused = true;
    });

    $('.popup-close').click(function (e) {
        $('.popup-wrap').fadeOut(500);
        $('.popup-box').removeClass('transform-in').addClass('transform-out');
        setTimeout(function () {
            e.preventDefault();
            isPaused = false;
        }, 1000);
        e.preventDefault();
    });

    $('.playNow').click(function () {
        $(".start_box").css("display", "none");
        $('.part01').fadeIn();
        myCounter.start();
    });

    fsGame.gameStart(function(){
        startGame()
    });

    function startGame() {
        diem = 0;
        level = 1;
        dem = 1;
        count = 0;
        arr = [];
        var gameContainer = $('.gr');

        gameContainer.html("");
        shuffle(num);
        for (var i = 0; i < num.length; i++) {
            var r = Math.floor(Math.random() * color.length);
            gameContainer.append('<div id="' + num[i] + '" class="box box' + num[i] + '">' + num[i] + '</div>');
            $('.box' + num[i]).css('color', color[r]);
        }
        num.sort(sortNumber);

        setTimeout(function () {
            $('.st').fadeIn(650);
        }, 3500);
        $(".show_first").css('display', 'none');
        $(".start_box").css("display", "block");
    }
});