const mongoose = require('mongoose');

const universitySchema = mongoose.Schema({
    teacherEmails: [
        {
            type: String,
            // require: true
        }
    ],
    studentEmails: [
        {
            type: String,
            // require: true
        }
    ],
    coursesID: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            // require: true
        }
    ],
    emailSuffix: {
        type: String,
        // require: true
    },
    geolocations: [
        {
            geolocationId: {
                type: mongoose.Types.ObjectId,
                // require: true
            },
            longitude: {
                type: String,
                // require: true,
            },
            latitude: {
                type: String,
                // require: true,
            },
            radius: {
                type: Number,
                // require: true, 
            }
        }
    ]
})

const University = mongoose.model("university", universitySchema);

module.exports = University;