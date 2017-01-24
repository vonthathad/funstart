/**
 * Created by andh on 8/17/16.
 */
formidable = require('formidable');
var dir = 'uploaded/results/';
var fs = require('fs');
// var phantom = require('phantom');
var webshot = require('webshot');
var Game = require('mongoose').model('Game');
var Config = require('../config/config');
// exports.uploadResult = function(req,res){
//     Game.findByIdAndUpdate(parseInt(req.params.game),{$inc: {shares: 1}},function(){
//     });
//     var form = new formidable.IncomingForm();
//     form.uploadDir = __dirname + '/../../public/' + dir;
//     console.log(form.uploadDir);
//     form.keepExtensions = true;
//     form.maxFields = 0;
//     form.maxFieldsSize = 0;
//     var count = 0;
//     form.on('progress', function(bytesReceived) {
//        
//         if (bytesReceived > 300000) {
//             form._error();
//             console.log('Loi nhan');
//             return res.status(400).send();
//         }
//     });
//     form.on('file', function(name, file) {
//         console.log(file);
//         count++;
//         if(file.type=='image/jpeg'&&file.size<300000&&count==1){
//             if(req.user == 'guest'){
//                 var path = Date.now() + '_' + req.params.game + '.jpg';
//                 console.log(path);
//             } else {
//                 var path = req.user._id + '_' + req.params.game + '.jpg';
//             }
//
//             fs.renameSync(file.path, form.uploadDir + path);
//             res.json({data: C/results/' + path});
//         } else {
//             fs.unlink(file.path);
//             console.log('loi dinh dang');
//             return res.status(400).send();
//         }
//     });
//     form.parse(req, function(err, fields, files) {
//     });
//
// }

exports.captureResult = function(req,res){
    console.log(req.user);
    var shotOptions = {
        siteType:'html',
        screenSize: { width: 960, height: 500 },
        shotSize: { width: 960, height: 500 }
    };
    var uploadDir = __dirname + '/../../public/' + dir;

    if(req.user._id) {
        var Finder = require('fs-finder');
        var files = Finder.from(uploadDir).findFiles(req.user._id + '_'+req.game._id+'_<[0-9]{13}>.png');
        files.forEach(function(e){
            fs.unlink(e);
        });
    }
    if(req.body.image){
        var domHTML = '<div style="position: absolute;top: 0;left: 0">';
        domHTML +=
            '<img style="width: 100%;height: 100%" src="'+Config.server.host+'/sources/thumb/'+req.game.thumbResult+'"/>'+
            '<div style="font-family:sans-serif;position:absolute;bottom:0;padding: 20px;left:0;width: 100%;height: 100%;color: #fff;text-transform: uppercase;font-size: 2em;font-weight: bold;text-align: center;">'+
            req.body.score +
            '</div></div>';
    } else {
        var domHTML = '<div style="position: absolute;top: 0;left: 0">';
        domHTML +=
            '<img style="width: 100%;height: 100%" src="'+Config.server.host+'/thumb/'+req.game.thumbResult+'"/>'+
            '<div style="font-family:sans-serif;position:absolute;bottom:0;padding: 20px;left:0;width: 100%;height: 100%;color: #fff;text-transform: uppercase;font-size: 2em;font-weight: bold;text-align: center;">'+
            req.body.score +
            '</div></div>';
    }
    var path;
    // if(req.user == 'guest'){
    if(req.user._id){
        path = req.user._id + '_'+req.game._id+'_' + Date.now() + '.png';
    } else {
        path = 'guest/' + Date.now() + '_' + req.game._id + '.png';
    };
    // } else {
    //     path = req.user._id + '_' + req.game._id + '.jpg';
    // }
    // var domHTML2 = ;
    webshot(domHTML,uploadDir + '/' + path,shotOptions, function(err) {
            if(err){
                console.log(err);
                res.status(400).send();
            } else {
                console.log(Date.now());
                res.json({data: Config.server.host + '/results/' + path});
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