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
        type: Number,
        ref: 'User',
        required: 'Must have user'
    },
    created: {
        type: Date,
        default: Date.now
    },
    image: String,
    score: {
        type: Number,
        required: 'Must have score'
    }
})
ActivitySchema.set('toJSON',{getters: true,virtuals: true});
mongoose.model('Activity',ActivitySchema);