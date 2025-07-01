const mongoose = require('mongoose');

// Schema for ProfessorItem
const professorItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    professor_id: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    recurring: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    active: {
        type: String
    },
    parent_id: {
        type: String,
        required: true
    }
});

const ProfessorItem = mongoose.model('ProfessorItem', professorItemSchema);

module.exports = ProfessorItem;