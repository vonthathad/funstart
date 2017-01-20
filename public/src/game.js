
/////////////////////////////////////
//////////// GAME SHARE
/////////////////////////////////////
function Share(share) {
    this.version = share.version;
    this.sheetId = share.sheetId;
    this.descr = {};

    this.share = function (result) {
        switch (this.version) {
            case "0.0.1":
            case "0.0.2":
                this.getDescr(result, function (result) {
                    var i;
                    // fsGame.gameOver({score: data.score});
                    // var obj = {
                    //     title: data.title,
                    //     descr: data.descr,
                    //     image: fsGame.user.avatar
                    // };
                    // fsGame.setResultObj(obj, false);
                    // fsGame.createShare({
                    //     share: false,
                    //     title: data.title,
                    //     descr: data.descr,
                    //     capture: true
                    // });
                    console.log("Score " + result.score);
                    console.log("Descr " + result.descr);
                    console.log("Title " + result.title);
                    // console.log("THUS" + (JSON.stringify(_this)));

                });
                break;
        }
    }
    this.getDescr = function (result, callback) {
        // console.log("game Over" + JSON.stringify(result) + this.sheetId + this.version);
        var version = this.version;
        this.pourDescrFromSheet(result, function (result) {
            switch (version) {
                case "0.0.1":
                    // setTimeout(function () {
                    //     $('.recommend-btn:eq(0) > span').text(' Tiếp tục');
                    // }, 100);
                    callback(result);
                    break;
                case "0.0.2":
                    var status = result.status;
                    var score = result.score;
                    var level = result.level;
                    // setTimeout(function () {
                    //     $('.recommend-btn:eq(0) > span').text(status == "won" ? ' Tiếp tục' : ' Chơi lại');
                    // }, 100);
                    console.log("status" + status);
                    var title = (status == "won" ? "Hoành thành" + " level " : "Dừng lại" + " ở level ") + level;
                    if (status == "lost") score = 0;
                    result.score = score;
                    result.title = title;
                    callback(result);
                    break;
                default:
                    console.log("No version?");
            }
        });
    }


    this.pourDescrFromSheet = function (data, callback) {
        var getRandomChild = this.getRandomChild;
        var descr = this.descr;
        //  console.log(JSON.stringify(descr));
        //  console.log(JSON.stringify(data));
        var randomDescr;
        switch (this.version) {
            case "0.0.1":
                // console.log("DES" + _descr);
                Object.keys(descr).forEach(function (scoreRange) {
                    // console.log("Score" + scoreRange);
                    var scores = scoreRange.split("-");
                    var minScore = parseInt(scores[0]);
                    var maxScore = parseInt(scores[1]);
                    if (data.score >= minScore && data.score <= maxScore) {
                        randomDescr = getRandomChild(descr[scoreRange].congratulations);
                    }
                });
                data.descr = randomDescr;
                break;
            case "0.0.2":
                var getRandomChild = this.getRandomChild;
                var score;
                console.log("STATUS" + data.status);
                Object.keys(descr).forEach(function (levelRange) {
                    console.log("Level" + levelRange);
                    var levels = levelRange.split("-");
                    var minLevel = parseInt(levels[0]);
                    var maxLevel = parseInt(levels[1]);
                    if (data.level >= minLevel && data.level <= maxLevel) {
                        randomDescr = data.status == "won" ? getRandomChild(descr[levelRange].congratulations) : getRandomChild(descr[levelRange].encouragements);
                        score = descr[levelRange].score;
                    }
                });
                // console.log(descr + " " + score);
                data.descr = randomDescr;
                data.score = score;
                break;
            default:
                console.log("No version?");
        }
        callback(data);
    }
   
    ////////// GET DES FROM GOOGLE SHEET
    this.getDescrFromSheet = function () {
        var _this = this;
        this.getJSON("https://spreadsheets.google.com/feeds/list/" + this.sheetId + "/od6/public/values?alt=json&gid=154710158", function (data) {
            // console.log(JSON.stringify(data));
            switch (_this.version) {
                case "0.0.1":
                    var scoresDescr = {}
                    // console.log("Descr" + JSON.stringify(data.feed.entry));
                    data.feed.entry.forEach(function (row) {
                        // console.log("row" + JSON.stringify(row));
                        var scores = row.gsx$scores.$t;
                        var congratulation = row.gsx$congratulations.$t;
                        if (!scoresDescr[scores]) {
                            scoresDescr[scores] = {};
                        }
                        if (!scoresDescr[scores].congratulations) {
                            scoresDescr[scores].congratulations = [];
                        }
                        if (congratulation != "") {
                            scoresDescr[scores].congratulations.push(congratulation);
                        }
                    });
                    _this.descr = scoresDescr;
                    // callback(scoresDescr);
                    break;
                case "0.0.2":
                    var levelsDescr = {};
                    data.feed.entry.forEach(function (row) {
                        var congratulation = row.gsx$congratulations.$t;
                        var encouragement = row.gsx$encouragements.$t;
                        var score = row.gsx$scores.$t;
                        var level = row.gsx$levels.$t;

                        if (!levelsDescr[level]) {
                            levelsDescr[level] = {};
                        }
                        if (!levelsDescr[level].congratulations) {
                            levelsDescr[level].congratulations = [];
                        }
                        if (!levelsDescr[level].encouragements) {
                            levelsDescr[level].encouragements = [];
                        }

                        if (congratulation != "") {
                            levelsDescr[level].congratulations.push(congratulation);
                        }
                        if (encouragement != "") {
                            levelsDescr[level].encouragements.push(encouragement);
                        }
                        if (score != "") {
                            levelsDescr[level].score = score;
                        }
                    });
                    _this.descr = levelsDescr;
                    // callback(levelsDescr);
                    break;
                default: console.log("No share version");
            }

        });
    }
    this.getJSON = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";
        xhr.onload = function () {
            var status = xhr.status;
            // console.log(JSON.stringify(xhr.response));
            if (status == 200) {
                callback(xhr.response);
            } else {
                callback(status);
                console.error("Status " + status);
            }
        };
        xhr.send();
    };

    this.getRandomChild = function (array) {
        var r = Math.floor(Math.random() * array.length);
        console.log(array.length + " " + r);
        return array[r];
    }
}

/////////////////////////////////////
//////////// PHASER HELPER
/////////////////////////////////////
function _Phaser(phaser) {
    this.version = phaser.version;
    this.width = phaser.width;
    this.height = phaser.height;

    this.state = phaser.state;

    this.game = {};
    // CREATE PHASER GAME
    this.init = function (game, callback) {
        this.game = game;
        // console.log(JSON.stringify(game));
        var i;
        for (i = 0; i < this.state.list.length; i++) {
            this.game.state.add(this.state.list[i][0], this.state.list[i][1]);
        }

        window.addEventListener("hashchange", function () {
            alert(2134);
        }, false);
        callback(this.game);
    };
    this.preload = function(){
        this.game.state.start(this.state.preload);
    }
    this.start = function(){
        this.game.state.start(this.state.start);
    }
    this.continue = function () {
        this.game.paused = false;
        this.game.state.start(this.state.continue);
    }
    // HELPING WITH SIZE ISSUE
    this.setSize = function (_this) {
        var height = this.height,
            width = this.width;
        var size = {
            height: height,
            width: width
        }
        _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // set setSize function
        var _calculateSize = this.calculateSize;
        var calculateSize = function () {
            _calculateSize(_this, size);
        }
        calculateSize();

        if (_this.scale.setScreenSize) _this.scale.setScreenSize(true);
        _this.scale.setShowAll();
        _this.scale.refresh();

        if (_this.scale.setResizeCallback) {
            _this.scale.setResizeCallback(function () {
                calculateSize();
            }, this);
        } else if (_this.scale.hasResized) {
            _this.scale.hasResized.add(function () {
                calculateSize();
            }, this);
        }

        if (!_this.game.device.desktop) {
            var isLandscape = width > height;
            var enterIncorrectOrientation = this.enterIncorrectOrientation;
            var leaveIncorrectOrientation = this.leaveIncorrectOrientation;

            _this.game.scale.forceOrientation(isLandscape, !isLandscape);
            _this.game.scale.enterIncorrectOrientation.add(function () {
                enterIncorrectOrientation(_this, calculateSize);
            }, this);
            _this.game.scale.leaveIncorrectOrientation.add(function () {
                leaveIncorrectOrientation(_this, calculateSize)
            }, this);
        }
    }
    this.calculateSize = function (_this, size) {
        var containerWidth = $('.game-area').get(0).clientWidth,
            containerHeight = $('.game-area').get(0).clientHeight,
            height = size.height,
            width = size.width,
            matchedHorizon = width / height > containerWidth / containerHeight;
        if (matchedHorizon) {
            _this.game.scale.minWidth = containerWidth - 3;
            _this.game.scale.minHeight = containerWidth / width * height - 3;
            _this.game.scale.maxWidth = containerWidth;
            _this.game.scale.maxHeight = containerWidth / width * height;
        } else {
            _this.game.scale.minWidth = containerHeight / height * width - 3;
            _this.game.scale.minHeight = containerHeight - 3;
            _this.game.scale.maxWidth = containerHeight / height * width;
            _this.game.scale.maxHeight = containerHeight;
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
}
function Game() {
    console.log("href " + window.location.href);
    this.init = function (info, callback) {
        //set absolute url
        this.prelink = '/sources/games/' + window.location.href.split("game/")[1] + '/';
        // this.type = game.type;
        // this.prelink =  this.prelink ("?")[0] + '/';
        if (this.prelink.indexOf("?") !== -1) {
            this.prelink = this.prelink.split("?")[0] + '/';
        }
        // console.log(JSON.stringify( window.location.href.split("game/")))
        // this.prelink = this.prelink.split("?")[0];
        console.log("prelink " + this.prelink);
        this.game = {};
        if (info.phaser) {
            this._phaser = new _Phaser(info.phaser);
        }

        if (info.share) {
            this.share = new Share(info.share);
            // this.share.game = this.game;
        } else {
            console.error("No game share");
        }
        callback();
    }
};
window.game = new Game();
