/**
 * Created by dat on 20/09/2016.
 */

/**
 *
 * @param array
 * @returns {Array}
 */
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


Array.prototype.shuffle = function () {
    var copy = [],
        n = this.length,
        i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math
            .floor(Math.random() * this.length);

        // If not already shuffled, move it to the new array.
        if (i in this) {
            copy
                .push(this[i]);
            delete this[i];
            n--;
        }
    }
    return copy;
};
/**
 *
 * @param id
 * @returns {Element}
 * @constructor
 */
var HTMLObject = function (id) {
    return document.getElementById(id);
};
/**
 *
 * @param _class
 * @returns {NodeList}
 * @constructor
 */
var HTMLObjects = function (_class) {
    return document.getElementsByClassName(_class);
};
/**
 *
 * @param HTMLObject
 */
var removeAllChildHTMLObject = function (HTMLObject) {
    while (HTMLObject.firstChild) {
        HTMLObject.removeChild(HTMLObject.firstChild);
    }
};

// load framework library and game javascript file
this.loadSequence = function (framework_library, game_library) {


    // this.prelink = './sources/game/' + window.location.href.split("game/")[1] + '/';
    // // this.prelink =  this.prelink ("?")[0] + '/';
    // if(this.prelink.indexOf("?") !== -1){
    //    this.prelink = this.prelink.split("?")[0] + '/';
    // }

    var prelink = './sources/game/' + window.location.href.split("game/")[1] + '/';
    if(prelink.indexOf("?") !== -1){
        prelink = prelink.split("?")[0] + '/';
    }
    console.log(prelink);
    $.getScript('/js/' + framework_library, function () {
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.src = prelink + game_library; // file contains alert("hello!");
        document.body.appendChild(s);
    })
}

// phaser help init
var _des = {};

function GameData(gameData) {
    this.version = gameData.version;
    this.width = gameData.width;
    this.height = gameData.height;
}

function GameState(stateData) {
    // console.log("In GameState");
    this.version = stateData.version;
    this.states = stateData.states;
    this.veryFirstState = stateData.veryFirstState;
    this.afterShareState = stateData.afterShareState;
}

function GameShare(shareData) {
    this.version = shareData.version;
    this.desSheetId = shareData.desSheetId;
    this.share = function (data) {

        var _this = this;
        switch (_this.version) {
            case "0.0.1":
            case "0.0.2":
                this.getDes(data, _this, function (data) {
                    var i;
                    fsGame.gameOver({score: data.score});
                    var obj = {
                        title: data.title,
                        des: data.des,
                        image: fsGame.user.avatar
                    };
                    fsGame.setResultObj(obj, false);
                    fsGame.createShare({
                        share: false,
                        title: data.title,
                        des: data.des,
                        capture: true
                    });
                    console.log("Score " + data.score);
                    console.log("Des " + data.des);
                    console.log("Title " + data.title);
                    console.log("THUS" + (JSON.stringify(_this)));
                    _this.game.paused = true;
                });
        }
    }
    this.getDes = function (data, _this, callback) {
        console.log("game Over" + JSON.stringify(data) + _this.desSheetId + _this.version);
        switch (_this.version) {
            case "0.0.1":
                _this.getDesFromGoogleSheet(data, _this, function (data) {
                    setTimeout(function () {
                        $('.recommend-btn:eq(0) > span').text(' Tiếp tục');
                    }, 100);
                    callback(data);
                });
                break;
            case "0.0.2":
                _this.getDesFromGoogleSheet(data, _this, function (data) {
                    var status = data.status;
                    var score = data.score;
                    var level = data.level;
                    setTimeout(function () {
                        $('.recommend-btn:eq(0) > span').text(status == "won" ? ' Tiếp tục' : ' Chơi lại');
                    }, 100);
                    console.log("status" + status);
                    var title = (status == "won" ? "Hoành thành" + " level " : "Dừng lại" + " ở level ") + level;
                    if (status == "lost") score = 0;
                    data.score = score;
                    data.title = title;
                    callback(data);
                });
                break;
            default:
                console.log("No version?");
        }

    }
    this.getDesFromGoogleSheet = function (data, _this, callback) {
        var getOneRandomChild = _this.getOneRandomChild;
        var des;
        switch (_this.version) {
            case "0.0.1":
                // console.log("DES" + _des);
                Object.keys(_des).forEach(function (scoreRange) {
                    // console.log("Score" + scoreRange);
                    var scores = scoreRange.split("-");
                    var minScore = parseInt(scores[0]);
                    var maxScore = parseInt(scores[1]);
                    if (data.score >= minScore && data.score <= maxScore) {
                        des = getOneRandomChild(_des[scoreRange].congratulations);
                    }
                });
                console.log("DES" + data.des);
                data.des = des;
                break;
            case "0.0.2":
                var getOneRandomChild = this.getOneRandomChild;
                var des, score;
                var levelsDes = _des;
                console.log("STATUS" + data.status);
                Object.keys(_des).forEach(function (levelRange) {
                    console.log("Level" + levelRange);
                    var levels = levelRange.split("-");
                    var minLevel = parseInt(levels[0]);
                    var maxLevel = parseInt(levels[1]);
                    if (data.level >= minLevel && data.level <= maxLevel) {
                        des = data.status == "won" ? getOneRandomChild(_des[levelRange].congratulations) : getOneRandomChild(_des[levelRange].encouragements);
                        score = _des[levelRange].score;
                    }
                });
                // console.log(des + " " + score);
                data.des = des;
                data.score = score;
                break;
            default:
                console.log("No version?");
        }
        callback(data);
    }
    this.preGetDes = function (desData, callback) {
        $.getJSON("https://spreadsheets.google.com/feeds/list/" + desData.desSheetId + "/od6/public/values?alt=json&gid=154710158", function (data) {
            switch (desData.version) {
                case "0.0.1":
                    var scoresDes = {}
                    // console.log("Des" + JSON.stringify(data.feed.entry));
                    data.feed.entry.forEach(function (row) {
                        // console.log("row" + JSON.stringify(row));
                        var scores = row.gsx$scores.$t;
                        var congratulation = row.gsx$congratulations.$t;
                        if (!scoresDes[scores]) {
                            scoresDes[scores] = {};
                        }
                        if (!scoresDes[scores].congratulations) {
                            scoresDes[scores].congratulations = [];
                        }
                        if (congratulation != "") {
                            scoresDes[scores].congratulations.push(congratulation);
                        }
                    });
                    callback(scoresDes);
                    break;
                case "0.0.2":
                    var levelsDes = {};
                    data.feed.entry.forEach(function (row) {
                        var congratulation = row.gsx$congratulations.$t;
                        var encouragement = row.gsx$encouragements.$t;
                        var score = row.gsx$scores.$t;
                        var level = row.gsx$levels.$t;

                        if (!levelsDes[level]) {
                            levelsDes[level] = {};
                        }
                        if (!levelsDes[level].congratulations) {
                            levelsDes[level].congratulations = [];
                        }
                        if (!levelsDes[level].encouragements) {
                            levelsDes[level].encouragements = [];
                        }

                        if (congratulation != "") {
                            levelsDes[level].congratulations.push(congratulation);
                        }
                        if (encouragement != "") {
                            levelsDes[level].encouragements.push(encouragement);
                        }
                        if (score != "") {
                            levelsDes[level].score = score;
                        }
                    });
                    callback(levelsDes);
                    break;
            }

        });
    }
    this.getScoresDes = function (desSheetId, callback) {

    }


    this.getLevelsDes = function (desSheetId, callback) {
        $.getJSON("https://spreadsheets.google.com/feeds/list/" + desSheetId + "/od6/public/values?alt=json&gid=154710158", function (data) {
            var levelsDes = {};
            data.feed.entry.forEach(function (row) {
                var congratulation = row.gsx$congratulations.$t;
                var encouragement = row.gsx$encouragements.$t;
                var score = row.gsx$scores.$t;
                var level = row.gsx$levels.$t;
                // console.log(row);
                if (!levelsDes[level]) {
                    levelsDes[level] = {};
                }
                if (!levelsDes[level].congratulations) {
                    levelsDes[level].congratulations = [];
                }
                if (!levelsDes[level].encouragements) {
                    levelsDes[level].encouragements = [];
                }


                if (congratulation != "") {
                    levelsDes[level].congratulations.push(congratulation);
                }
                if (encouragement != "") {
                    levelsDes[level].encouragements.push(encouragement);
                }
                if (score != "") {
                    levelsDes[level].score = score;
                }
            });
            callback(levelsDes);
        });
    }


    this.getOneRandomChild = function (array) {
        var r = Math.floor(Math.random() * array.length);
        console.log(array.length + " " + r);
        return array[r];
    }
}
function GameAssist(assistData) {
    console.log("href " + window.location.href);
    //set absolute url
    this.prelink = './sources/game/' + window.location.href.split("game/")[1] + '/';
    // this.prelink =  this.prelink ("?")[0] + '/';
    if(this.prelink.indexOf("?") !== -1){
        this.prelink = this.prelink.split("?")[0] + '/';
    }
    // console.log(JSON.stringify( window.location.href.split("game/")))
    // this.prelink = this.prelink.split("?")[0];
    console.log("prelink " + this.prelink);
    this.game = {};
    if (assistData.gameData) {
        this.gameData = new GameData(assistData.gameData);
    }
    if (assistData.stateData) {
        this.gameState = new GameState(assistData.stateData);
        this.gameState.game = this.game;
    }
    if (assistData.shareData) {
        this.gameShare = new GameShare(assistData.shareData);
        this.gameShare.game = this.game;
    }

    // version 0.0.1 score phaser
    // version 0.0.2 level phaser
    this.runGame = function (callback) {
        var version = this.gameData.version;
        this.loaded = false;
        var _this = this;
        console.log("version" + version);
        switch (version) {
            case "0.0.1":
            case "0.0.2":
                this.loaded = false;
                var initPhaser = this.initPhaser;
                var setDesFromDesSheet = this.setDesFromDesSheet;
                var preGetDes = _this.gameShare.preGetDes;
                var getScoresDes = this.gameShare.getScoresDes;
                // var desSheetId = this.gameShare.desSheetId;
                var gameData = this.gameData;
                var type = this.gameData.type;
                var afterShareState = this.gameState.afterShareState;
                var desData = {
                    version: this.gameData.version,
                    desSheetId: this.gameShare.desSheetId
                }
                $('document').ready(function () {
                    fsGame.gameStart(function () {
                        if (!_this.loaded) {
                            _this.loaded = true;
                            initPhaser(_this, callback);
                            console.log(_this.game);
                            switch (version) {
                                case "0.0.1":
                                case "0.0.2":
                                    preGetDes(desData, function (des) {
                                        _des = des;
                                        console.log("here" + JSON.stringify(_des));
                                    });
                                    break;
                            }

                        } else {
                            console.log("GAME" + _this.game);
                            console.log("123451" + JSON.stringify(_this.gameState.afterShareState));
                            _this.game.paused = false;
                            _this.game.state.start(_this.gameState.afterShareState);
                        }
                    });
                });
                break;
            case "0.0.3":
                console.log("not write");
                break;
            default:
                console.log("version was not declare");
        }
    };
    this.initPhaser = function (_this, callback) {
        _this.game = new Phaser.Game(_this.gameData.width, _this.gameData.height, Phaser.AUTO, 'canvas');
        var i;
        for (i = 0; i < _this.gameState.states.length; i++) {
            _this.game.state.add(_this.gameState.states[i][0], _this.gameState.states[i][1]);
        }
        _this.game.state.start(_this.gameState.veryFirstState);

        window.addEventListener("hashchange", function(){
            alert(2134);
        }, false);

        callback(_this.game);
    };
    this.setFlexibleSize = function (_this) {

        switch (this.gameData.version) {
            case "0.0.1":
            case "0.0.2":

                var gameHeight = this.gameData.height,
                    gameWidth = this.gameData.width;
                var sizeData = {
                    gameHeight: gameHeight,
                    gameWidth: gameWidth
                }
                _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                // set setSize function
                var _setSize = this.setSize;
                var setSize = function () {
                    _setSize(_this, sizeData);
                }
                setSize();

                if (_this.scale.setScreenSize) _this.scale.setScreenSize(true);
                _this.scale.setShowAll();
                _this.scale.refresh();

                if (_this.scale.setResizeCallback) {
                    _this.scale.setResizeCallback(function () {
                        setSize();
                    }, this);
                } else if (_this.scale.hasResized) {
                    _this.scale.hasResized.add(function () {
                        setSize();
                    }, this);
                }

                if (!_this.game.device.desktop) {
                    var isLandscape = gameWidth > gameHeight;
                    var enterIncorrectOrientation = this.enterIncorrectOrientation;
                    var leaveIncorrectOrientation = this.leaveIncorrectOrientation;

                    _this.game.scale.forceOrientation(isLandscape, !isLandscape);
                    _this.game.scale.enterIncorrectOrientation.add(function () {
                        enterIncorrectOrientation(_this, setSize);
                    }, this);
                    _this.game.scale.leaveIncorrectOrientation.add(function () {
                        leaveIncorrectOrientation(_this, setSize)
                    }, this);
                }
                break;
        }
    }
    this.setSize = function (_this, sizeData) {
        var parentWidth = $('.game-area').get(0).clientWidth,
            parentHeight = $('.game-area').get(0).clientHeight,
            gameHeight = sizeData.gameHeight,
            gameWidth = sizeData.gameWidth,
            matchedHorizon = gameWidth / gameHeight > parentWidth / parentHeight;
        if (matchedHorizon) {
            _this.game.scale.minWidth = parentWidth - 3;
            _this.game.scale.minHeight = parentWidth / gameWidth * gameHeight - 3;
            _this.game.scale.maxWidth = parentWidth;
            _this.game.scale.maxHeight = parentWidth / gameWidth * gameHeight;
        } else {
            _this.game.scale.minWidth = parentHeight / gameHeight * gameWidth - 3;
            _this.game.scale.minHeight = parentHeight - 3;
            _this.game.scale.maxWidth = parentHeight / gameHeight * gameWidth;
            _this.game.scale.maxHeight = parentHeight;
        }
    }
    this.leaveIncorrectOrientation = function (_this, setSize) {
        _this.orientated = true;
        _this.game.paused = false;
        document.getElementById("orientation").style.display = "none"
        setSize();
    }
    this.enterIncorrectOrientation = function (_this, setSize) {
        _this.orientated = false;
        _this.game.paused = true;
        document.getElementById("orientation").style.display = "block"
        setSize();
    }
};