const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    email: {
        type: String,
        // require: true
    },
    password: {
        type: String,
        // require: true
    },
    coursesForTeacher: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            // require: true
        }
    ]
})

const Teacher = mongoose.model("teacher", teacherSchema);

module.exports = Teacher;