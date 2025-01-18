const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed',],
        default: 'To Do'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


// Automatically update the `updatedAt` field whenever the document is updated
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model("Task", taskSchema)