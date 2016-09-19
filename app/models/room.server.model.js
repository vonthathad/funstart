var mongoose = require('mongoose');
Schema = mongoose.Schema;
var RoomSchema = new Schema({
    players: {},
    mode: {
        type: String,
        enum: ["room","find"]
    },
    people: {
        type: Number,
        default: 1
    },
    ready: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [0,1],
        default: 0
    }
})
RoomSchema.set('toJSON',{getters: true,virtuals: true});
mongoose.model('Room',RoomSchema);