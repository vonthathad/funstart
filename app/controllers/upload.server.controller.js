/**
 * Created by andh on 8/17/16.
 */
formidable = require('formidable');
var dir = 'uploaded/results/';
var fs = require('fs');
// var phantom = require('phantom');
var webshot = require('webshot');
var Game = Game = require('mongoose').model('Game');
exports.uploadResult = function(req,res){
    Game.findByIdAndUpdate(parseInt(req.params.game),{$inc: {shares: 1}},function(){
    });
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/' + dir;
    console.log(form.uploadDir);
    form.keepExtensions = true;
    form.maxFields = 0;
    form.maxFieldsSize = 0;
    var count = 0;
    form.on('progress', function(bytesReceived) {
        
        if (bytesReceived > 300000) {
            form._error();
            console.log('Loi nhan');
            return res.status(400).send();
        }
    });
    form.on('file', function(name, file) {
        console.log(file);
        count++;
        if(file.type=='image/jpeg'&&file.size<300000&&count==1){
            if(req.user == 'guest'){
                var path = Date.now() + '_' + req.params.game + '.jpg';
                console.log(path);
            } else {
                var path = req.user._id + '_' + req.params.game + '.jpg';
            }

            fs.renameSync(file.path, form.uploadDir + path);
            res.json({data: 'http://www.funstart.net/uploaded/results/' + path});
        } else {
            fs.unlink(file.path);
            console.log('loi dinh dang');
            return res.status(400).send();
        }
    });
    form.parse(req, function(err, fields, files) {
    });

}
exports.captureResult = function(req,res){
    Game.findByIdAndUpdate(req.game._id,{$inc: {shares: 1}},function(){
    });
    var shotOptions = {
        siteType:'html',
        screenSize: { width: 960, height: 500 },
        shotSize: { width: 960, height: 500 }
    };

    var result = {};
    result.title = req.body.title || 'GAME OVER';
    result.des = req.body.des || req.game.des;
    var avatar = req.user.avatar || 'https://www.funstart.net/sources/ninja.png';
    result.image = req.body.image || avatar;
    var domHTML =
        '<div style="position:absolute;top:0;left:0;">' +
            '<img style="width: 100%;height: 100%" src="https://www.funstart.net/'+req.game.thumbResult+'"/>'+
            '<div style="font-family:Open Sans,sans-serif;position:absolute;top:0;left:0;width: 100%;height: 100%;font-size: 1.5em;color: #fff;text-transform: uppercase;font-size: 2em;font-weight: bold;text-align: center;">'+
                '<div style="position: absolute; top: 0;left: 0; width: 35%; height: 100%;">'+
                    '<div style="position: absolute; top: 0;left: 0;width: 100%;height: 60%;"></div>'+
                    '<div style="padding: 20px;font-size: 1.15em;position: absolute; top: 60%;left: 0; width: calc(100% - 40px); height: calc(40% - 40px);">'+
                        '<p>'+req.game.title+'</p>'+
                    '</div>'+
                '</div>'+
                '<div style="background: rgba(0,0,0,0.1);position: absolute; top: 0;left: 35%; width: 65%; height: 100%;">'+
                    '<div style="position: absolute; top: 0;left: 0;width: 100%;height: 60%;">';

    if(req.body.opponent && req.user){
        result.status = req.body.status || 'VS';
        domHTML+=
                        '<div style="position: absolute; top: 12.5%;left: 0;width: calc(35% - 40px);height: calc(100% - 40px);text-align: center;padding: 20px">' +
                            '<img style="border-radius: 50%;width: 100%;" src="'+result.image+'">' +
                        '</div>' +
                        '<div style="position: absolute; top: 20%;left: 35%;width: 30%;height: 100%;text-align: center;">' +
                            '<h1>'+result.status+'</h1>' +
                        '</div>' +
                        '<div style="position: absolute; top: 12.5%;right: 0;width: calc(35% - 40px);height: calc(100% - 40px);text-align: center;padding: 20px">' +
                            '<img style="border-radius: 50%;width: 100%;"  src="'+req.body.opponent+'">' +
                        '</div>';
    } else {
        domHTML+=
                        '<div style="position: absolute;top: 12.5%;left: 0;width: calc(35% - 40px);height: calc(100% - 40px);text-align: center;padding: 20px">'+

                                '<img style="border-radius: 50%;width: 100%;" src="'+result.image+'"/>'+

                        '</div>'+
                        '<div style="position: absolute;left: 35%;width: calc(65% - 20px);height: calc(100% - 40px);padding: 20px 20px 20px 0;">';
        if(req.user.displayName){
            domHTML+=       '<div style="width: 100%;padding: 10px;background: rgba(0,0,0,0.1);height: 80px"><p>'+req.user.displayName+'</p></div>';
        }
        domHTML+=
                            '<div style="width: 100%;padding: 10px;background: rgba(0,0,0,0.1)"><p>'+result.title+'</p></div>' +
                        '</div>';
    }
    domHTML+=
                    '</div>'+
                    '<div style="background: rgba(0,0,0,0.1);position: absolute; top: 60%;left: 0;width: calc(100% - 40px);height: calc(40% - 40px);line-height: 1.5em; padding: 20px;font-size: 0.75em;text-transform: none;font-weight: normal">'+result.des+'</div>'+
                '</div>'+
            '</div>'+
        '</div>';
    console.log(Date.now());
    var uploadDir = __dirname + '/../../public/' + dir;
    var path;
    if(req.user == 'guest'){
        path = Date.now() + '_' + req.game._id + '.jpg';
        console.log(path);
    } else {
        path = req.user._id + '_' + req.game._id + '.jpg';
    }
    webshot(domHTML,uploadDir + '/' + path,shotOptions, function(err) {
            if(err){
                res.status(400).send();
            } else {
                console.log(Date.now());
                res.json({data: 'http://www.funstart.net/uploaded/results/' + path});
            }
        });
    // phantom.create(function(ph) {
    //     ph.createPage(function(page) {
    //         page.setContent(domHTML);
    //         page.set("viewportSize", {
    //             width: 960,
    //             height: 500
    //         });
    //         page.set('onLoadFinished', function() {
    //             page.render(uploadDir + '/' + path,function(){
    //                 return res.json({data: 'http://www.funstart.net/uploaded/results/' + path});
    //             });
    //             ph.exit();
    //         });
    //     });
    // });
}