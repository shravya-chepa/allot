const mongoose = require('mongoose');

// Schema for StudentItem
const studentItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    professor_id: {
        type: String,
        required: true
    },
    professor_item_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    student_name: {
        type: String,
        required: true
    },
    student_last_name: {
        type: String,
        required: true
    },
    student_email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
    }
});

const StudentItem = mongoose.model('StudentItem', studentItemSchema);

module.exports = StudentItem;