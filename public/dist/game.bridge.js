var keys = {};
window.addEventListener("keydown",
   function(e){
      keys[e.keyCode] = true;
      switch(e.keyCode){
         case 37: case 39: case 38:  case 40: // Arrow keys
         case 32: e.preventDefault(); break; // Space
         default: break; // do not block other keys
      }
   },
   false);
window.addEventListener('keyup',
   function(e){
      keys[e.keyCode] = false;
   },
   false);


/////////////////////////////////////
//////////// GAME SHARE
/////////////////////////////////////
function Share(share) {
    this.version = share.version;
    this.sheetId = share.sheetId;
    this.descr = {};

    this.updateResult = function(result) {
        switch (this.version) {
            case "0.0.1":
            case "0.0.2":
                this.getDescr(result, function(result) {
                    var i;
                    // console.log("Score " + result.score);
                    // console.log("Descr " + result.descr);
                    // console.log("Title " + result.title);
                    window.angularComponentRef.zone.run(function() {
                        window.angularComponentRef.updateResult(JSON.stringify(result))
                    });
                });
                break;
        }
    }
    this.getDescr = function(result, callback) {
        // console.log("game Over" + JSON.stringify(result) + this.sheetId + this.version);
        var version = this.version;
        this.pourDescrFromSheet(result, function(result) {
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
                    // console.log("status" + status);
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


    this.pourDescrFromSheet = function(data, callback) {
        var getRandomChild = this.getRandomChild;
        var descr = this.descr;
        //  console.log(JSON.stringify(descr));
        //  console.log(JSON.stringify(data));
        var randomDescr;
        switch (this.version) {
            case "0.0.1":
                // console.log("DES" + _descr);
                Object.keys(descr).forEach(function(scoreRange) {
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
                // console.log("STATUS" + data.status);
                Object.keys(descr).forEach(function(levelRange) {
                    // console.log("Level" + levelRange);
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
    this.getDescrFromSheet = function() {
        var _this = this;
        this.getJSON("https://spreadsheets.google.com/feeds/list/" + this.sheetId + "/od6/public/values?alt=json&gid=154710158", function(data) {
            // console.log(JSON.stringify(data));
            switch (_this.version) {
                case "0.0.1":
                    var scoresDescr = {}
                        // console.log("Descr" + JSON.stringify(data.feed.entry));
                    data.feed.entry.forEach(function(row) {
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
                    data.feed.entry.forEach(function(row) {
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
                default:
                    console.log("No share version");
            }

        });
    }
    this.getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";
        xhr.onload = function() {
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

    this.getRandomChild = function(array) {
        var r = Math.floor(Math.random() * array.length);
        // console.log(array.length + " " + r);
        return array[r];
    }
}

function Other() {

    this.startBoot = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startBoot(func)
        });
    }
    this.startPreload = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startPreload(func)
        });
    }
    this.preloadDone = function() {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.preloadDone()
        });
    }
    this.librariesLoadDone = function() {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.librariesLoadDone()
        });
    }
    this.startMenu = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startMenu(func)
        });
    }
    this.startGame = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startGame(func)
        });
    }
    this.startHelp = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startHelp(func)
        });
    }
    this.startCredit = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startCredit(func)
        });
    }
    this.resume = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.resume(func);
        });
    }
    this.pause = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.pause(func);
        });
    }
    this.continue = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.continue(func);
        });
    }
}

/////////////////////////////////////
//////////// PHASER HELPER
/////////////////////////////////////
function _Phaser(phaser) {
    this.width = phaser.width;
    this.height = phaser.height;

    this.state = phaser.state;

    this.game = {};
    // CREATE PHASER GAME
    this.init = function(game, callback) {
        this.game = game;
        var i;
        for (i = 0; i < this.state.length; i++) {
            this.game.state.add(this.state[i][0], this.state[i][1]);
        }
        callback(this.game);
    };

    this.state.startBoot = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startBoot(func)
        });
    }
    this.state.startPreload = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startPreload(func)
        });
    }
    this.state.preloadDone = function() {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.preloadDone()
        });
    }
   this.state.librariesLoadDone = function() {
      window.angularComponentRef.zone.run(function() {
         window.angularComponentRef.librariesLoadDone()
      });
   }
    this.state.startMenu = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startMenu(func)
        });
    }
    this.state.startGame = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startGame(func)
        });
    }
    this.state.startHelp = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startHelp(func)
        });
    }
    this.state.startCredit = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.startCredit(func)
        });
    }
    this.state.resume = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.resume(func);
        });
    }
    this.state.pause = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.pause(func);
        });
    }
    this.state.continue = function(func) {
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.continue(func);
        });
    }

    this._cropCanvas = function(originCanvas, cropX, cropY, cropWidth, cropHeight) {
        // create a temporary canvas sized to the cropped size
        var cropCanvas = document.createElement("canvas");
        var cropContext = cropCanvas.getContext("2d");
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        // use the extended from of drawImage to draw the
        // cropped area to the temp canvas
        cropContext.drawImage(originCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        // return canvas
        return cropCanvas;
    }

    this._resizeCanvas = function(originCanvas, resizeWidth, resizeHeight) {

        var originHeight = originCanvas.height;
        var originWeight = originCanvas.weight;
        // create a temporary canvas sized to the resize size
        var resizedCanvas = document.createElement("canvas");
        var resizedContext = resizedCanvas.getContext("2d");
        resizedCanvas.width = resizeWidth;
        resizedCanvas.height = resizeHeight;
        resizedContext.drawImage(originCanvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

        return resizedCanvas;
    }

    this.getScreenShotDataFrom = function(game, PIXI) {
        var _this = this;
        window.angularComponentRef.zone.run(function() {
            window.angularComponentRef.getScreenShotData(function() {
                if (game.renderer instanceof PIXI.CanvasRenderer) {
                    var originCanvas = game.canvas;
                    var top = Math.round(originCanvas.height / 2 - 150);
                    var cropCanvas = _this._cropCanvas(game.canvas, 0, 0, 480, 800);
                    var resizeCanvas = _this._resizeCanvas(cropCanvas, Math.round(480 / 800 * 300), 300);
                    return resizeCanvas.toDataURL();
                } else if (game.renderer instanceof PIXI.WebGLRenderer) {
                    var gl = game.renderer.gl;
                    var buf = new Uint8Array(game.width * game.height * 4);
                    gl.readPixels(0, 0, game.width, game.height, gl.RGBA, gl.UNSIGNED_BYTE, buf);
                    // console.log(buf);
                }
            });
        });
    }

    // HELPING WITH SIZE ISSUE
    this.setSize = function(_this) {
        var height = this.height,
            width = this.width;
        var size = {
                height: height,
                width: width
            }
            // _this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        _this.game.scale.scaleMode = 2;
        // set setSize function
        var _calculateSize = this.calculateSize;
        var calculateSize = function() {
            _calculateSize(_this, size);
        }
        calculateSize();

        if (_this.scale.setScreenSize) _this.scale.setScreenSize(true);
        _this.scale.setShowAll();
        _this.scale.refresh();

        if (_this.scale.setResizeCallback) {
            _this.scale.setResizeCallback(function() {
                calculateSize();
            }, this);
        } else if (_this.scale.hasResized) {
            _this.scale.hasResized.add(function() {
                calculateSize();
            }, this);
        }

        if (!_this.game.device.desktop) {
            // console.log(123);
            var isLandscape = width > height;
            var enterIncorrectOrientation = this.enterIncorrectOrientation;
            var leaveIncorrectOrientation = this.leaveIncorrectOrientation;

            _this.game.scale.forceOrientation(isLandscape, !isLandscape);
            _this.game.scale.enterIncorrectOrientation.add(function() {
                enterIncorrectOrientation(_this, calculateSize);
            }, this);
            _this.game.scale.leaveIncorrectOrientation.add(function() {
                leaveIncorrectOrientation(_this, calculateSize)
            }, this);
        }
    }
    this.calculateSize = function(_this, size) {
        var containerWidth = document.getElementById('iframe-game').clientWidth - 16,
            containerHeight = document.getElementById('iframe-game').clientHeight - 16,
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
    this.leaveIncorrectOrientation = function(_this, setSize) {
        // console.log("leaveIncorrectOrientation");
        _this.orientated = true;
        _this.game.paused = false;
       document.getElementById('iframe-game').contentWindow.document.getElementById("orientation").style.display = "none";
        setSize();
    }
    this.enterIncorrectOrientation = function(_this, setSize) {
       // console.log("enterIncorrectOrientation");
        _this.orientated = false;
        _this.game.paused = true;
       document.getElementById('iframe-game').contentWindow.document.getElementById("orientation").style.display = "block";
        setSize();
    }
}

function Game() {
    // console.log("href " + window.location.href);
    this.init = function(info, callback) {
        //set absolute url
        this.prelink = '/sources/games/' + window.location.href.split("game/")[1] + '/';
        // this.type = game.type;
        // this.prelink =  this.prelink ("?")[0] + '/';
        if (this.prelink.indexOf("?") !== -1) {
            this.prelink = this.prelink.split("?")[0] + '/';
        }
        // console.log(JSON.stringify( window.location.href.split("game/")))
        // this.prelink = this.prelink.split("?")[0];
        // console.log("prelink " + this.prelink);
        this.game = {};
        if (info.phaser) {
            this._phaser = new _Phaser(info.phaser);
        }

        if (info.share) {
            this.share = new Share(info.share);
        } else {
            console.error("No game share");
        }
        if (info.other) {
            this.other = new Other();
        }
        callback();
    }
};
window.game = new Game();