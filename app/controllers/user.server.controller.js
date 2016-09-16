/**
 * Created by andh on 8/4/16.
 */
var User = require('mongoose').model('User');
var Jwt = require('jsonwebtoken');
var Config = require('../config/config');
var privateKey = Config.key.privateKey;
var https = require('https');
var paging = 7;
var getErrorMessage = function(err) {
    var message = 'Xảy ra lỗi. Vui lòng thử lại sau';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Email đã tồn tại';
                break;
        }
    }
    return message;
};
exports.authFacebookSuccess = function(req,res){
    res.json(req.user);
};
exports.authFacebookFail = function(req,res){
    res.status(400).send();
};
exports.authSignin = function(req,res){
    firebase.auth().verifyIdToken(req.body.token).then(function(decodedToken) {
        // console.log(decodedToken);
        User.findById(decodedToken.sub,'-salt -password', function(err, user) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                // console.log(req.body.password);
                // firebase.apps[0].v.databaseAuthVariableOverride.uid = decodedToken.sub;
                if(req.body.password || user.isVerified!=decodedToken["email_verified"]){
                    if(req.body.password) user.password = req.body.password;
                    if(user.isVerified!=decodedToken["email_verified"]) {
                        user.isVerified = decodedToken["email_verified"];
                        firebase.database().ref("users").child(decodedToken.sub).update({"isVerified": decodedToken["email_verified"]},function(err){
                            // console.log(err);
                        });
                    }
                    user.save();
                }
                User.find({exp : {$gt : user.exp}}).count(function (err,count){
                    var rank = 0;
                    if(!err) rank = count + 1;
                    user.rank = rank;
                    return res.json({data:user});
                });
            }
        });
    }).catch(function(error) {
        res.status(400).send();
        // Handle error
    });

};
exports.authSignup = function(req,res){
    //firebase.apps[0].v.databaseAuthVariableOverride.uid = req.body.uid;
    // console.log(req.body.token);
    firebase.auth().verifyIdToken(req.body.token).then(function(decodedToken) {
        // console.log(decodedToken);
        var uid = decodedToken.uid;
        var email = decodedToken.email;
        var username = locdau(email.split("@")[0]);
        // console.log(username);
        // ...
        var tokenData = {
            uid: uid
        };
        var userToken = Jwt.sign(tokenData, privateKey);
        var profile = {
            _id: uid,
            email: email,
            password: req.body.password,
            avatar: 'http://www.funstart.net/sources/avatar.jpg',
            username: username,
            displayName: username,
            token: userToken,
            isVerified: false,
            provider: 'email'
        };
        User.findUniqueUsername(profile.username, null, function(availableUsername){
            profile.username = availableUsername;
            user = new User(profile);
            user.save(function(err,user) {
                if (err) {
                    return res.status(400).send({message: getErrorMessage(err)});
                };
                delete user.salt;
                delete user.password
                return res.json({data: user});
            });
        });
    }).catch(function(error) {
        res.status(400).send();
        // Handle error
    });

};
exports.loadUsers = function(req,res){
    var page = parseInt(req.query.page),
        skip = page > 0 ? ((page - 1) * paging) : 0;
    if(req.query.suggest){
        if(req.query.suggest == 'mutual'){
            User.aggregate([
                { "$match": { "_id":{$in: req.user.friends}}},
                { "$unwind": "$friends" },
                { "$group": {
                    "_id": "$friends",
                    "count": { $sum: 1 }
                }},
                { "$match": {$and:[{"_id":{$nin: req.user.friends}},{_id: {$ne: req.user._id}}] }},
                { "$sort": { "count": -1 } },
                {"$skip": skip},
                { "$limit": (paging + 1) }
            ],function(err,results){
                if(err){
                    // console.log(err);
                    res.json(err);
                } else{
                    // console.log(results);
                    results = results.map(function(doc) {
                        return new User(doc)
                    });
                    //res.json(results);
                    User.populate(results,{"path": "_id", "select": "displayName username avatar provider"}, function(err,dt) {
                        if (err) throw err;
                        data = [];
                        for(var i = 0 ; i < dt.length ; i++){
                            data.push(dt[i]._id);
                        }
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
                    });
                }

            })
        } else if (req.query.suggest = 'facebook'){
            if(req.user.providerData && req.user.providerData.token){
                // console.log('token',req.user.providerData.token)
                var options = {
                    host: 'graph.facebook.com',
                    path: '/me/friends?limit=100&access_token=' + req.user.providerData.token
                };
                https.get(options,function(resp){

                    var data = '';
                    resp.on('data', function (chunk) {
                        data += chunk;

                    });

                    resp.on('end', function() {
                        var idArr = [];
                        results = JSON.parse(data);
                        // console.log(results);
                        for(var i = 0 ; i < results.data.length ; i++){
                            idArr.push(results.data[i].id);
                        }
                        // console.log(idArr);
                        User.find({$and:[{providerId:{$in: idArr}},{_id: {$nin: req.user.friends}}]}, 'username displayName avatar exp level friends', {
                            skip: skip,
                            limit: (paging+1),
                            sort: getSortType(req.query.order)
                        }, function(err, users) {
                            if (err) {
                                res.json(err);
                            } else {

                                var isNext = false;
                                if(users.length==(paging+1)){
                                    isNext = true;
                                    users.pop();
                                }
                                resdata = {
                                    data: users,
                                    isNext: isNext
                                }
                                res.json(resdata);
                            }
                        });
                    });
                });
            } else {
                res.json({});
            }
        } else {
            res.json({});
        }
    } else {
        var conds = [];
        var match = {};
        if(req.query.friend) {
            User.findById(req.query.friend,function(err,user){
                if(user){
                    conds.push({_id: { $in: user.friends}});
                }
                if(req.query.text) conds.push({$or:[
                    {email: { $regex: req.query.text, $options: 'i' }},
                    {username: {$regex: req.query.text,$options: 'i'}},
                    {displayName: {$regex: req.query.text,$options: 'i'}}
                ]});
                if(!conds.length){
                    match = {};
                } else if(conds.length==1){
                    match = conds.pop();
                } else {
                    match = {$and: conds};
                }
                // console.log(match);
                var sortType = getSortType(req.query.order);
                User.find(match, 'username displayName avatar exp level friends')
                    .skip(skip)
                    .limit(paging+1)
                    .sort(sortType)
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
            })

        }

    }

};
var getSortType = function(sortType){
    if(sortType==="username"){
        return {username : -1} ;
    }
    if(sortType==="exp"){
        return {exp : -1} ;
    }
    return {created : -1} ;
};

exports.authToken = function(req,res){
    User.find({exp : {$gt : req.user.exp}}).count(function (err,count){
        var rank = 0;
        if(!err) rank = count + 1;
        req.user.rank = rank;
        res.json({data:req.user});
    });
    req.user.active = Date.now();
    req.user.update(function(){})
};
exports.loadUser = function(req,res,next){
    User.find({exp : {$gt : req.selectedUser.exp}}).count(function (err,count){
        // console.log(req.selectedUser);
        var rank = 0;
        if(!err) rank = count + 1;
        req.selectedUser.rank = rank;
        res.json({data: req.selectedUser});
    });
};
exports.followUser = function (req,res) {
    if(req.query.action =='follow'){
        User.findByIdAndUpdate(req.user._id,{$addToSet: { "friends": req.selectedUser._id }},function(){
            res.status(200).send();
        });
    } else if(req.query.action =='unfollow') {
        User.findByIdAndUpdate(req.user._id,{$pull: { "friends": req.selectedUser._id }},function(){
            res.status(200).send();
        });
    }
}
exports.updateUser = function(req,res,next){
    var dataChange = {};
    if(req.body.avatar) dataChange.avatar = req.body.avatar;
    if(req.body.username) dataChange.username = req.body.username;
    if(req.body.displayName) dataChange.displayName = req.body.displayName;
    if(req.body.mobile) dataChange.mobile = req.body.mobile;
    req.user.update(dataChange,function(){
        res.status(200).send();
    })
};
exports.userByUsername = function(req, res, next, id) {
    User.findOne({username: id},'-password -salt -token -isVerified -providerData')
        .exec(function(err, user){
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('Failed to load user ' + id));
            }
            req.selectedUser = user;
            next();
        });
};
exports.renderAction = function (req,res) {
    var app = {
        id: '244448985929177',
        name: 'Fun Start',
        description: 'Game hay thử tài!',
        url: 'http://www.funstart.net',
        image: 'http://www.funstart.net/sources/ads.jpg'
    };
    res.render('index', {app: app});
};
exports.requiresLogin = function(req, res, next) {
    if (req.user === 'guest' || !req.isAuthenticated()) {
        return res.status(401).send({
            message: 'Người dùng chưa đăng nhập'
        });
    } else if(req.user === 'ban') {
        return res.status(401).send({
            message: 'Tài khoản đã bị khóa do nghi ngờ vi phạm'
        });
    }
    next();
};
exports.isDeveloper = function(req, res, next) {
    if (req.user.role !== 1) {
        return res.status(401).send({
            message: 'Phải có quyền mới xem được nội dung trang'
        });
    }
    next();
};