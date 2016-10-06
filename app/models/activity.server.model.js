/**
 * Created by andh on 7/19/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var ActivitySchema = new Schema({
    game: {
        type: Number,
        ref: 'Game',
        required: 'Must have game'
    },
    user: {
        type: String,
        ref: 'User',
        required: 'Must have user'
    },
    time: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        required: 'Must have score'
    },
    isWin: Boolean,
    opponent: [{
        type: Number,
        ref: 'User'
    }],
    exp: {
        type: Number,
        required: 'Must have experience'
    }
})
ActivitySchema.set('toJSON',{getters: true,virtuals: true});
mongoose.model('Activity',ActivitySchema);