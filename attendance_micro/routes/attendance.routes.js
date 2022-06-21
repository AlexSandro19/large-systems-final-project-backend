require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const axios = require('axios').default;

const studentUrl = "http://localhost:5000/db/getStudent";
const teacherUrl = "http://localhost:5000/db/getTeacher";
const studentUpdateUrl = "http://localhost:5000/db/updateStudent";
const studentsUrl = "http://localhost:5000/db/getStudents";
const courseUrl = "http://localhost:5000/db/getCourse";

const router = Router();

router.post("/addAttendance", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { attendance, token } = req.body;
        //const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
        console.log("check token: ", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        console.log("email: ", email)
        const student = await axios
            .post(studentUrl, { email })
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });
        if (!student) {
            return res.status(400).json({
                message: "Invalid authorization data",
                errors: [{ value: email, msg: "Student not found", param: "email" }],
            });
        }


        const { lectureForSemesterId, courseId, courseName, startDateAndTime, endDateAndTime, presence } = attendance
        console.log("req.body: ", req.body);
        // NOTE: token should be in headers -> so you need to create a function that would extract the token from header
        console.log("message after axios", student)

        student.attendance.push({ lectureForSemesterId, courseId, courseName, startDateAndTime, endDateAndTime, presence })
        console.log("updated student", student)
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);

        const studentUpdateSent = await axios
            .post(studentUpdateUrl, { student })
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });
        const { studentUpdated } = studentUpdateSent;
        if (studentUpdated) {
            return res.status(200).json({ attendanceAdded: true });
        } else {
            return res.status(500).json({ attendanceAdded: false, message: "Internal Error" });
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "JWT token has expired, please login to obtain a new one",
            });
        }
        // res.status(401).json({ message: "Unauthorized access" });
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
});

router.post("/getAttendance", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { startDate, finalDate, token } = req.body;
        //const token = req.headers.random.split(" ")[1]; // "Bearer TOKEN"
        console.log("check token: ", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        console.log("email: ", email)
        const student = await axios
            .post(studentUrl, { email })
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });
        if (!student) {
            return res.status(400).json({
                message: "Invalid authorization data",
                errors: [{ value: email, msg: "Student not found", param: "email" }],
            });
        }

        console.log(student);
        const receivedStartDate = new Date(startDate)
        const receivedFinalDate = new Date(finalDate)

        console.log("req.body: ", req.body);

        const getAttendanceBetweenDates = student.attendance.filter(lecture => {
            const lectureStartDateAndTime = new Date(lecture.startDateAndTime)
            return ((lectureStartDateAndTime.getMonth() >= receivedStartDate.getMonth() && lectureStartDateAndTime.getDate() >= receivedStartDate.getDate()) &&
                (lectureStartDateAndTime.getMonth() <= receivedFinalDate.getMonth() && lectureStartDateAndTime.getDate() <= receivedFinalDate.getDate()))
        })
        console.log("message after axios", getAttendanceBetweenDates)

        return res.status(200).json({ attendanceBetweenDates: { startDate, finalDate, attendance: getAttendanceBetweenDates } });
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);

        // const studentUpdateSent = await axios
        //     .post(studentUpdateUrl, { student })
        //     .then((response) => response.data)
        //     .catch((error) => {
        //         throw error.response;
        //     });
        // const { studentUpdated } = studentUpdateSent;
        // if (studentUpdated) {
        //     return res.status(200).json({ attendanceAdded: true });
        // } else {
        //     return res.status(500).json({ attendanceAdded: false, message: "Internal Error" });
        // }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "JWT token has expired, please login to obtain a new one",
            });
        }
        // res.status(401).json({ message: "Unauthorized access" });
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
});

router.post("/getAttendanceForLecture", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { course_id, lecture_id, token } = req.body;
        //const token = req.headers.random.split(" ")[1]; // "Bearer TOKEN"
        console.log("attendance.routes > /getAttendanceForLecture > req.body: ", req.body);
        console.log("check token: ", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        console.log("attendance.routes > /getAttendanceForLecture > email: ", email)
        const teacher = await axios
            .post(teacherUrl, { email })
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });
        if (!teacher) {
            return res.status(400).json({
                message: "Invalid authorization data",
                errors: [{ value: email, msg: "Teacher not found", param: "email" }],
            });
        }

        const course = await axios
            .post(courseUrl, { course_id })
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });
        console.log("attendance.routes > /getAttendanceForLecture > course: ", course)
        const request = { students: course.studentsInCourse }
        console.log("attendance.routes > /getAttendanceForLecture > request: ", request)
        const studentsInCourse = await axios
            .post(studentsUrl, request)
            .then((response) => response.data)
            .catch((error) => {
                throw error.response;
            });

        console.log("attendance.routes > /getAttendanceForLecture > studentsInCourse: ", studentsInCourse)
        const studentsPresentInLecture = []
        const studentsNotPresentInLecture = []
        if (studentsInCourse != undefined && studentsInCourse.length > 0) {
            studentsInCourse.forEach(student => {
                if (student.attendance != undefined && student.attendance.length > 0) {
                    student.attendance.forEach(lecture => {
                        if (lecture.lectureForSemesterId == lecture_id) {
                            if (lecture.presence == "Present") {
                                studentsPresentInLecture.push({ studentEmail: student.email })
                            } else if (lecture.presence == "Not Present") {
                                studentsNotPresentInLecture.push({ studentEmail: student.email })
                            } else {
                                throw Error
                            }
                        }
                    })

                }
            })

        } else {
            throw Error
        }
        return res.status(200).json({ studentsPresentInLecture, studentsNotPresentInLecture });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "JWT token has expired, please login to obtain a new one",
            });
        }
        // res.status(401).json({ message: "Unauthorized access" });
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
});



module.exports = router;