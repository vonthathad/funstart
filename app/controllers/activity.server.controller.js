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
exports.loadChallengeGame = function(req,res){
    Game.findOneRandom({$and: [{_id: {$ne: parseInt(req.query.game)}},{plays: {$gt: 100}},{public: true}]},{},{},function(err,game){
        if(err){
            return res.status(400).send();
        } else {
            if(game){
                Activity.find({game: game._id})
                    .sort({score : -1}).limit(1)
                    .populate('user','displayName username avatar')
                    .populate('game','title thumb')
                    .exec(function(err,activities){
                        if(err){
                            return res.status(400).send();
                        } else {
                            if(activities.length){
                                var activity = activities[0];
                                res.json({data: activity});
                            } else {
                                return res.status(400).send();
                            }
                        }
                    })
            } else {
                return res.status(400).send();
            }
        }
    })
};
exports.loadRanks = function(req,res){
    Activity.find({game: parseInt(req.query.game)})
        .limit(3)
        .sort('-score')
        .populate('user','displayName username avatar')
        .exec(function(err,activities){
            if(err) return res.status(400).send();
            Activity.findOne({game: parseInt(req.query.game),user: req.query.user})
                .populate('user','displayName username avatar')
                .exec(function(err,activity){
                    if(err) return res.status(400).send();
                    if(activity){
                        activities.push(activity);
                    }
                    return res.json({data: activities});
                });
        })
};
exports.loadActivities = function(req,res){
    var page = parseInt(req.query.page),
        skip = page > 0 ? ((page - 1) * paging) : 0;
    var conds = [];
    var match = {};
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
                console.log(data);  
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
    // console.log('activity',JSON.stringify(req.body) + "ff" + req.user._id);
    if(req.user._id && req.body.game != null && req.body.score != null && req.body.pictureUrl != null){
        Game.findByIdAndUpdate(parseInt(req.body.game),{$inc: { plays: 1}},function(err,game){
            Activity.findOne({user: req.user._id,game: parseInt(req.body.game)})
                .sort({created : -1})
                .limit(1)
                .exec(function(err,data){
                    if(err) return res.status(400).send();
                    if(data){
                        data.score = req.body.score;
                        data.created = Date.now();
                        data.image = req.body.image;
                        data.save();
                    } else {
                        var newActivity = new Activity({
                            game: parseInt(req.body.game),
                            user: req.user._id,
                            score: req.body.score,
                            image : req.body.pictureUrl
                        });
                        newActivity.save();
                    }
                });
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
                if(err) return res.status(400).send();
                return res.json({data:user});
                // User.find({exp : {$gt : user.exp}}).count(function (err,count){
                //     if(err) return res.json({data:user});
                //     var rank = 0;
                //     if(!err) rank = count + 1;
                //     user.rank = rank;
                //     return res.json({data:user});
                // });
            });
        });

    } else {
        return res.status(400).send();
    }

};