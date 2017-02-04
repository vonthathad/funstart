/**
 * Created by andh on 7/19/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    config = require('../config/config.js'),
    connection = mongoose.createConnection(config.db);
autoIncrement.initialize(connection);
var random = require('mongoose-simple-random');
var GameSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title game is required'
    },
    des: {
        type: String,
        trim: true
    },
    thumb: {
        type: String,
        trim: true,
        required: 'Thumb game is required'
    },
    thumbVideo: String,
    thumbAds: String,
    thumbResult: String,
    link: {
        type: String,
        trim: true,
        required: 'Link game is required'
    },
    topic: {
        type: Number,
        enum: [0,1,2,3,4,5]
    },
    shares: {
        type: Number,
        default: 0
    },
    plays: {
        type: Number,
        default: 0
    },
    top: Number,
    hot: Number,
    created: {
        type: Date,
        default: Date.now
    },
    publish: {
        type: Boolean,
        default: false
    }
});
GameSchema.plugin(autoIncrement.plugin, {
    model: 'Game',
    startAt: 1
});
GameSchema.plugin(random);
GameSchema.index({ title: 'text',des: 'text'});
GameSchema.set('toJSON',{getters: true,virtuals: true});
mongoose.model('Game',GameSchema);