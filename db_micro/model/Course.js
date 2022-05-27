const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseName: {
        type: String,
        // require: true
    },
    geolocationId: {
        type: mongoose.Types.ObjectId,
        // require: true
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
        // require:true
    },
    studentsInCourse: [
        {
            type: String,
    
            // require:true
        }
    ],
    lecturesForSemester: [
        {
            lectureForSemesterId: {
                type: mongoose.Types.ObjectId,
                // require: true
            },
            // weekday: {
            //     type: String,
            //     require: true,
            //     enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            // },
            startDateAndTime: {
                type: Date,
                // require: true
            },
            endDateAndTime: {
                type: Date,
                // require: true
            }
        }
    ]
})

const Course = mongoose.model("course", courseSchema);

module.exports = Course;