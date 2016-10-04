/**
 * Created by andh on 7/28/16.
 */
var Activity = require('mongoose').model('Activity'),
    User = require('mongoose').model('User'),
    Game = require('mongoose').model('Game'),
    paging = 12;
var getSortType = function(sortType){
    if(sortType==="score"){
        return {score : -1} ;
    }
    return {created : -1} ;
};
exports.loadActivities = function(req,res){
    var page = parseInt(req.query.page),
        skip = page > 0 ? ((page - 1) * paging) : 0;
    var conds = [];
    var match = {};
    if(req.query.user) conds.push({user: req.query.user});
    if(req.query.user) conds.push({user: req.query.user});
    if(req.query.game) conds.push({game: parseInt(req.query.game)});
    if(!conds.length){
        match = {};
    } else if(conds.length==1){
        match = conds.pop();
    } else {
        match = {$and: conds};
    }
    console.log(match);
    var sortType = getSortType(req.query.order);
    Activity.find(match)
        .skip(skip)
        .limit(paging+1)
        .sort(sortType)
        .populate('user','displayName username avatar')
        .populate('game','title thumb')
        .exec(function(err,data){
            if(err) {
                res.status(400).send();
            } else {
                var isNext = false;
                if(data.length==(paging+1)){
                    isNext = true;
                    data.pop();
                }
                resdata = {
                    data: data,
                    isNext: isNext
                }
                res.json(resdata);
            }

        })
};
exports.createActivity = function (req,res,next) {
    if(req.user){
        var newActivity = new Activity({
            game: req.body.game,
            user: req.user._id,
            score: req.body.score,
            exp: req.body.score
        });
        Game.findByIdAndUpdate(parseInt(req.body.game),{$inc: { plays: 1}},function(err,game){

            newActivity.save(function (err,data) {
                if(err){
                    return res.status(400).send();
                } else {
                    var el = 0;
                    if(req.body.score>30000){
                        el = 1000;
                    } else {
                        el = parseInt(req.body.score*1/30);
                    }
                    switch (game.topic){
                        case 0: req.user.quick = (req.user.quick==0)?el:parseInt((el+req.user.quick)/2);break;
                        case 1: req.user.flex = (req.user.flex==0)?el:parseInt((el+req.user.flex)/2);break;
                        case 2: req.user.memory = (req.user.memory==0)?el:parseInt((el+req.user.memory)/2);break;
                        case 3: req.user.focus = (req.user.focus==0)?el:parseInt((el+req.user.focus)/2);break;
                        case 4: req.user.wit = (req.user.wit==0)?el:parseInt((el+req.user.wit)/2);break;
                    }
                    var isPlayGame = false;
                    req.user.gameList.forEach(function(e){
                        if(e == parseInt(req.body.game)){
                            isPlayGame = true;
                            return true;
                        }
                    });
                    if(!isPlayGame) req.user.gameList.push(parseInt(req.body.game));
                    req.user.exp += parseInt(req.body.score/100);
                    req.user.games++;
                    req.user.active = Date.now();
                    req.user.save(function(err,user){
                        User.find({exp : {$gt : user.exp}}).count(function (err,count){
                            var rank = 0;
                            if(!err) rank = count + 1;
                            user.rank = rank;
                            return res.json({data:user});
                        });
                    });

                }

            })
        });

    } else {
        res.status(400).send();
    }

;}