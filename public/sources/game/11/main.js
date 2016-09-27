var gameId = 11, userIdNow;
var competitorInfo = {};
var arSymbol = {};
arSymbol["x"] =  "<span class='xTich'>x</span>";
arSymbol["o"] =  "<span class='oTich'>o</span>";

var roomID
    //fbGameData = firebase.database().ref('gameRealtime/' + gameId);
var arPositionPlayer = [], arPositionCompetitor = [];

var comCounter = new Countdown({
    seconds: 180,
    dom: $(".play02 .countDownLine div")
});

var gameCaro = function (object) {
    var userId = object.userId,
        funcGameOver = object.gameOver || function () {}

    var domMessage = $(".messageGame h3");

    var symbolMe,
        symbolCom,
        xPos, yPos,
        isWin = false,
        isTurn = true,
        arResult = [];

    var gameContainer = $(".game-frame"),
        gameBody = $(".gameMain"),
        gameResult = $(".showResult"),

        playerDomInfo = $(".play01"),
        CompetitorDomInfo = $(".play02"),

    // heightScreen = gameContainer.width();
        maxGameBox = 40,
        widthScreen = 30 * maxGameBox,
        heightScreen = 30 * maxGameBox

    this.start = function() {
        $(".btn-pg").click();
        console.log('start Game');
        createMap();
    };

    this.setSymbol = function(data) {
        symbolMe = data;
    }

    this.setComSymbol = function(data) {
        symbolCom = data;
    }

    this.updatePosition = function() {
        $(".gameBox").html("");
        for (var x in arPositionPlayer) {
            $("#"+arPositionPlayer[x]).html(arSymbol[symbolMe])
        }
        for (var x in arPositionCompetitor) {
            $("#"+arPositionCompetitor[x]).css('background-color','inherit').html(arSymbol[symbolCom])
        }

        $("#"+arPositionCompetitor[arPositionCompetitor.length - 1]).css('background-color','rgba(212, 36, 36, 0.12)')

    };

    this.click = function (dom) {
        var div = $(dom);
        console.log("check win" + isWin + " -- is turn:" + this.isTurn);
        if (!isWin && this.isTurn) {
            if (div.html() == "") {
                div.append(arSymbol[symbolMe]);

                var position = div.attr("id");
                xPos = position.split("_")[0];
                yPos = position.split("_")[1];

                if (checkWinVertical() || checkHorizontal() || checkDiagonalLeft() || checkDiagonalRight()){
                    isWin = true;
                } else {
                    console.log("not win");
                }
                updateGame(xPos,yPos);
            } else {
                notiError(div)
            }
        } else {
            effectErrorMessage()
            console.log('data co nguoi win hoac ko phai luat cuar ban');
        }
    };

    this.gameOver = function(playerId){
        showResult(playerId);
        for (var x in arResult) {
            arResult[x].addClass("gameBox-win");
        }
        funcGameOver()
    };

    this.replay = function () {
        console.log('replay game');
        isWin = false;
        $(".gameBox").html("").removeClass("gameBox-win");
        hideResult();
    };

    this.randomPosition = function() {
        console.log('random position');
        var strSymbol = arSymbol[symbolMe];
        $(".gameBox").each(function(){
            if($(this).text() != "") {
                console.log($(this).prev() + "--" + strSymbol);
                $(this).prev().click();
                return false
            }
        })
    };

    this.callMessageNoti = function(data) {
        domMessage.html(data);
    }

    this.setupCenterMap = function () {
        setCenterMap()
    }

    function effectErrorMessage() {
        domMessage.css('background-color', 'rgb(212, 50, 50)');
        setInterval(function(){
            domMessage.css('background-color', '#FFF');
        }, 500)

    }

    function hideResult() {
        gameResult.css('display','none');
    }

    function showResult(playerId) {
        gameResult.css('display','block');
        gameResult.find("h2").html("Người chiến thắng là: " + playerId)
    }

    function createMap() {
        for ( var x = 0; x < widthScreen/30; x ++) {
            for (var y =0; y < heightScreen/30; y++) {
                var leftBox = x * 30;
                var rightBox = y * 30;
                gameBody.append("<div class='gameBox' id='"+x+"_"+y+"' style='left: "+ leftBox +"px; top: "+ rightBox +"px;'></div>")
            }
        }
        setCenterMap()
    }

    function setCenterMap() {
        console.log('set center map');
        var a = maxGameBox / 2
        var p = $( "#" + a + "_" + a );
        p.css({
            'background': 'url("img/logofunstart.svg") no-repeat',
            'background-size': '200%',
            'background-position': '-24px 7px'
        });

        var widthDocument = gameContainer.width();
        var setLeft = parseInt(p.css('left')) - widthDocument / 2 + 15;
        var setTop = parseInt(p.css('top')) - ($( window ).height() - 56) / 2 + 15;

        gameBody.scrollTop( setTop ).scrollLeft( setLeft );

    }


    function notiError(div) {
        div.css({
            'background-color' : 'rgba(255, 0, 0, 0.40)',
            "color" : "#FFF"
        });
        setTimeout(function() {
            div.css({
                'background-color': 'INHERIT',
                'color': '#201f56'
            });
        }, 500)
    }

    function updateGame(x,y) {
        var strPos = x + "_" + y;
        arPositionPlayer.push(strPos);
        console.log('vao update',isWin);
        var objAr = {
            array: arPositionPlayer
        };
        if (isWin) {
            fsGame.updateObj({
                value : JSON.stringify(objAr),
                isWin : isWin
            });
        } else {
            fsGame.updateObj({
                value : JSON.stringify(objAr)
            });
        }
        
        
    }
    function checkWinGameBox(div) {
        var text = div.text();
        console.log(text + "--" + symbolMe);
        if(text == symbolMe) arResult.push(div); else arResult = [];
        return (arResult.length == 5)
    }

    function checkWinVertical() {
        arResult = [];
        for (var y = parseInt(yPos) - 4; y < parseInt(yPos) + 5; y++) {
            var div = $("#" + xPos + "_" + y);
            if (checkWinGameBox(div)) break
        }
        return (arResult.length == 5)
    }


    function checkHorizontal() {
        arResult = [];
        for (var x = parseInt(xPos) - 4; x < parseInt(xPos) + 5; x++) {
            var div = $("#" + x + "_" + yPos);
            if (checkWinGameBox(div)) break
        }
        return (arResult.length == 5)
    }

    function checkDiagonalLeft() {
        arResult = [];
        for (var x = parseInt(xPos) - 4; x < parseInt(xPos) + 5; x++) {
            var y = parseInt(yPos) - (parseInt(xPos) - x);
            var div = $("#" + x + "_" + y);
            if (checkWinGameBox(div)) break
        }
        return (arResult.length == 5)
    }
    function checkDiagonalRight() {
        arResult = [];
        for (var x = parseInt(xPos) - 4; x < parseInt(xPos) + 5; x++) {
            var y = parseInt(yPos) + (parseInt(xPos) - x);
            var div = $("#" + x + "_" + y);
            if (checkWinGameBox(div)) break
        }
        return (arResult.length == 5)
    }

};


$(window).ready(function () {

    var caro = new gameCaro({
        userId : userIdNow,
        symbol : 'x',
        gameOver: function () {
            fsGame.setResultHtml($('.showResult').html());
            fsGame.gameOver(1);
            fsGame.createShare({
                share: false,
                htmlTag: "#canvan",
                name: fsGame.user.displayName + " đã ",
                des: fsGame.user.displayName + " fuck"
            },function (res) {
                console.log('res:',res);
            });

            console.log('call back gameover');
            myCounter.stop();
            comCounter.stop();
        }
    });

    var myCounter = new Countdown({
        seconds: 180,
        dom: $(".play01 .countDownLine div"),
        onCounterEnd: function () {
            caro.randomPosition()
            console.log('end time')
        }
    });

    var checkWinTotal = false;
    var isPlayGame = false, countPlayers = 0, isFullRoom = true;
    var userWin = "";
    //select competitor
    
    fsGame.gameStart(function(){
        if(fsGame.isHost){
            caro.setSymbol("x");
            fsGame.updateObj({
                "symbol" : "x"
            });
        }
    });
    fsGame.fetchPlayers(function(data){
        console.log('data in game: ', data);
        userIdNow = fsGame.user._id;
        countPlayers = 0;
        if (data) {
            var ar = data;
            isPlayGame = true;
            for (var x in ar) {
                countPlayers++;
                if (x == userIdNow) {
                    arPositionPlayer = convertStringToObject(ar[x]['value'])

                    if (ar[x]['symbol']) {
                        caro.setSymbol(ar[x]['symbol'])
                    } else {
                        caro.setSymbol("o")
                        fsGame.updateObj({
                            "symbol" : "o"
                        });
                    }

                    if (ar[x]['isWin']) {
                        checkWinTotal = true;
                        userWin = userIdNow;
                    }
                    caro.isTurn = (ar[x]['turn'] == 0);
                } else {
                    competitorInfo.id = x;
                    arPositionCompetitor = convertStringToObject(ar[x]['value'])
                    caro.setComSymbol(ar[x]['symbol']);

                    if (ar[x]['isWin']) {
                        checkWinTotal = true;
                        userWin = x;
                    }
                }
            }
        }

        //setup when room full
        console.log(countPlayers + "---" + isFullRoom);
        if (countPlayers == 2 && isFullRoom) {
            caro.start();
            isFullRoom = false;
        }

        console.log("checkWinTotal" + checkWinTotal);
        if (isPlayGame) {

            createCountDownTime(caro.isTurn);

            if (arPositionPlayer == undefined) arPositionPlayer = [];
            if (arPositionCompetitor == undefined) arPositionCompetitor = [];

            if (checkWinTotal) {
                caro.gameOver(userWin);
                isPlayGame = false;
            }

            console.log(arPositionPlayer);
            console.log(arPositionCompetitor);

            caro.updatePosition()
        }
    });
    
    

    $("body").off().on("click", '.gameBox', function () {
        caro.click(this);
    });

    function createCountDownTime(a) {
        if (a) {
            caro.callMessageNoti("Lượt đánh của bạn.");
            comCounter.stop();
            myCounter.reStart();
        } else {
            caro.callMessageNoti("Lượt đánh của đối thủ.");
            myCounter.stop();
            comCounter.reStart();
        }
    }

    function convertStringToObject(str) {
        if (str) {
            arJson = JSON.parse(str);
            return arJson.array
        } else {
            return []
        }
    }
});

function Countdown(options) {
    var timer,
        instance = this,
        seconds = options.seconds || 10,
        dom = options.dom,
        updateStatus = options.onUpdateStatus || function () {
            },
        counterEnd = options.onCounterEnd || function () {
            };

    this.changeTime = function () {
        seconds = seconds - 20;
    };

    this.start = function () {
        clearInterval(timer);
        //timer = 0;
        seconds = options.seconds;
        timer = setInterval(decrementCounter, 100);
        dom.css('background-color','#00A800')
    };

    this.stop = function () {
        clearInterval(timer);
    };

    this.reStart = function() {
        this.stop();
        this.start();
    };

    function decrementCounter() {
        updateStatus(seconds);
        effect();
        if (seconds <= 0) {
            counterEnd();
            instance.stop();
        }
        seconds--;
    }

    function effect() {
        var widthLine = seconds * 100 / options.seconds;
        dom.css('width',widthLine + '%');
        if (widthLine < 40) dom.css('background-color','red')
    }
}