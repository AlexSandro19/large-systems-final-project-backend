require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require('axios').default;
const { check, validationResult } = require("express-validator");

const studentUrl = "http://localhost:5000/db/getStudent";
const teacherUrl = "http://localhost:5000/db/getTeacher";
const createStudentUrl = "http://localhost:5000/db/createStudent";
const coursesUrl = "http://localhost:5000/db/getCourses";
const universityGeolocationsUrl = "http://localhost:5000/db/getUniversityGeolocations";
const checkStudentInUniveristyUrl = "http://localhost:5000/db/checkStudentInUniveristy";

const router = Router();

router.post(
    "/login",
    // [
    //     check("email").exists({ checkFalsy: true }).withMessage("Email not provided").trim()
    //         .normalizeEmail().isEmail().withMessage("Wrong email format"),
    //     check("password").exists({ checkFalsy: true }).withMessage("Password not provided"),
    // ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid authorization data",
                });
            }

            const { email, password } = req.body;
            console.log(req.body);
            console.log(`email: ${email}; password: ${password}`)
            console.log(req.body);
            const student = await axios
                .post(studentUrl, req.body)
                .then((response) => response.data)
                .catch((error) => {
                    console.log(error);
                    throw error.response;
                });
            if (!student) {
                return res.status(400).json({
                    message: "Invalid authorization data",
                    errors: [{ value: email, msg: "Student not found", param: "email" }],
                });
            }
            console.log("message after axios", student)

            const isMatch = await bcrypt.compare(password, student.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid authorization data",
                    errors: [
                        { value: "", msg: "Wrong password, try again", param: "password" },
                    ],
                });
            }

            //get all courses > lectures filter the lectures for the day
            const studentCourses = await axios
                .post(coursesUrl, { courses: student.coursesForStudent })
                .then((response) => response.data)
                .catch((error) => {
                    throw error.response;
                });
            const universityGeolocations = await axios
                .post(universityGeolocationsUrl, { universityAttended: student.universityAttended })
                .then((response) => response.data)
                .catch((error) => {
                    throw error.response;
                });


            if (studentCourses.length === 0) {
                return res.status(500).json({ message: "Student doesn't have any courses" })
            }

            console.log("/login > studentCourses: ", studentCourses)
            console.log("/login > universityGeolocations: ", universityGeolocations)

            const studentCoursesWithGeolocation = studentCourses.map(course => {
                const courseGeolocation = universityGeolocations.filter(geolocation => course.geolocationId === geolocation.geolocationId);
                return { ...course, geolocation: courseGeolocation }
            })
            const today = new Date() // hard-coded date for testing purposes - to check if lectures will be 
            // filtered on a specific date
            const todaysLectures = []
            studentCoursesWithGeolocation.forEach(course => {
                console.log("course object: ", course)
                const lecturesForSemester = course.lecturesForSemester.map(lecture => {
                    return { ...lecture, courseName: course.courseName, courseId: course._id, geolocation: course.geolocation }
                });
                console.log("lecturesForSemester: ", lecturesForSemester)
                const todaysLecturesForSpecificCourse = lecturesForSemester.filter(lecture => {
                    const lectureDate = new Date(lecture.startDateAndTime)
                    return (today.getMonth() === lectureDate.getMonth() && today.getDate() === lectureDate.getDate())
                })
                console.log("lecturesForSpecificCourse: ", todaysLecturesForSpecificCourse);
                todaysLectures.push(...todaysLecturesForSpecificCourse);
            })
            console.log("todaysLectures before sorting: ", todaysLectures)
            todaysLectures.sort((lecture1, lecture2) => {
                let lecture1Date = new Date(lecture1.startDateAndTime), lecture2Date = new Date(lecture2.startDateAndTime);
                return lecture1Date - lecture2Date;
            });
            console.log("todaysLectures after sorting: ", todaysLectures)
            // const lecturesForToday = studentCourses.forEach(course => {
            //     lecturesForCourse = course
            // })
            // console.log(typeof studentCourses[0].lecturesForSemester[0].startDateAndTime)
            //TODO 
            //lectures filter the lectures for the day
            // get university location through course > geolocation_id



            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: 60000, // value in milliseconds
            });
            return res.json({ token, email, exp: token.exp, todaysLectures });

        } catch (e) {
            console.log(e.message);
            if (e.status === 400) {
                res.status(400).json({ message: e.data.message })
            } else {
                res.status(500).json({ message: "Something went wrong, try again" });
            }
        }
    }
);

router.post(
    "/loginTeacher",
    // [
    //     check("email").exists({ checkFalsy: true }).withMessage("Email not provided").trim()
    //         .normalizeEmail().isEmail().withMessage("Wrong email format"),
    //     check("password").exists({ checkFalsy: true }).withMessage("Password not provided"),
    // ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid authorization data",
                });
            }

            const { email, password } = req.body;
            console.log("req.body: ", req.body);
            console.log(`email: ${email}; password: ${password}`)
            console.log(req.body);
            const teacher = await axios
                .post(teacherUrl, req.body)
                .then((response) => response.data)
                .catch((error) => {
                    console.log(error);
                    throw error.response;
                });
            if (!teacher) {
                return res.status(400).json({
                    message: "Invalid authorization data",
                    errors: [{ value: email, msg: "Teacher not found", param: "email" }],
                });
            }
            console.log("message after axios", teacher)

            // const isMatch = await bcrypt.compare(password, teacher.password);

            // if (!isMatch) {
            //     return res.status(400).json({
            //         message: "Invalid authorization data",
            //         errors: [
            //             { value: "", msg: "Wrong password, try again", param: "password" },
            //         ],
            //     });
            // }

            //get all courses > lectures filter the lectures for the day
            const courses = await axios
                .post(coursesUrl, { courses: teacher.coursesForTeacher })
                .then((response) => response.data)
                .catch((error) => {
                    throw error.response;
                });
            // const universityGeolocations = await axios
            //     .post(universityGeolocationsUrl, { universityAttended: teacher.universityAttended })
            //     .then((response) => response.data)
            //     .catch((error) => {
            //         throw error.response;
            //     });


            if (courses.length === 0) {
                return res.status(500).json({ message: "Teacher doesn't have any courses" })
            }

            console.log("/login > returnedCourses: ", courses)

            const teacherCourses = courses.map(course => {
                return { course: course.courseName, courseId: course._id, lecturesForSemester: course.lecturesForSemester }
            })

            // const studentCoursesWithGeolocation = returnedCourses.map(course => {
            //     const courseGeolocation = universityGeolocations.filter(geolocation => course.geolocationId === geolocation.geolocationId);
            //     return { ...course, geolocation: courseGeolocation }
            // })
            // const today = new Date() // hard-coded date for testing purposes - to check if lectures will be 
            // // filtered on a specific date
            // const todaysLectures = []
            // studentCoursesWithGeolocation.forEach(course => {
            //     console.log("course object: ", course)
            //     const lecturesForSemester = course.lecturesForSemester.map(lecture => {
            //         return { ...lecture, courseName: course.courseName, courseId: course._id, geolocation: course.geolocation }
            //     });
            //     console.log("lecturesForSemester: ", lecturesForSemester)
            //     const todaysLecturesForSpecificCourse = lecturesForSemester.filter(lecture => {
            //         const lectureDate = new Date(lecture.startDateAndTime)
            //         return (today.getMonth() === lectureDate.getMonth() && today.getDate() === lectureDate.getDate())
            //     })
            //     console.log("lecturesForSpecificCourse: ", todaysLecturesForSpecificCourse);
            //     todaysLectures.push(...todaysLecturesForSpecificCourse);
            // })
            // console.log("todaysLectures before sorting: ", todaysLectures)
            // todaysLectures.sort((lecture1, lecture2) => {
            //     let lecture1Date = new Date(lecture1.startDateAndTime), lecture2Date = new Date(lecture2.startDateAndTime);
            //     return lecture1Date - lecture2Date;
            // });
            // console.log("todaysLectures after sorting: ", todaysLectures)
            // const lecturesForToday = studentCourses.forEach(course => {
            //     lecturesForCourse = course
            // })
            // console.log(typeof studentCourses[0].lecturesForSemester[0].startDateAndTime)
            //TODO 
            //lectures filter the lectures for the day
            // get university location through course > geolocation_id



            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: 60000, // value in milliseconds
            });
            return res.json({ token, email, exp: token.exp, teacherCourses: courses });

        } catch (e) {
            console.log(e.message);
            if (e.status === 400) {
                res.status(400).json({ message: e.data.message })
            } else {
                res.status(500).json({ message: "Something went wrong, try again" });
            }
        }
    }
);

router.post(
    "/registerStudent",
    // [
    //     check("email").exists({ checkFalsy: true }).withMessage("Email not provided").trim()
    //         .normalizeEmail().isEmail().withMessage("Wrong email format"),
    //     check("password").exists({ checkFalsy: true }).withMessage("Password not provided"),
    // ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid data while registering",
                });
            }

            const { email, password } = req.body;
            console.log(`email: ${email}, password: ${password}`)
            const candidate = await axios
                .post(studentUrl, req.body)
                .then((response) => response.data)
                .catch((error) => {
                    throw error.response;
                });
            const isStundentInUniveristy = await axios
                .post(checkStudentInUniveristyUrl, req.body)
                .then((response) => response.data)
                .catch((error) => {
                    throw error.response;
                });

            console.log("candidate: ", candidate)
            console.log("isStundentInUniveristy: ", isStundentInUniveristy)
            if (!candidate && isStundentInUniveristy) {
                const student = { email, password };
                const { createdStudent } = await axios
                    .post(createStudentUrl, { student })
                    .then((response) => response.data)
                    .catch((error) => {
                        throw error.response;
                    });
                if (!createdStudent) {
                    return res.status(400).json({
                        message: "Invalid authorization data",
                        errors: [{ value: email, msg: "Student not found", param: "email" }],
                    });
                }

                return res.status(201).json({ message: "Student account created" });
            } else if (candidate) {
                return res
                    .status(400)
                    .json({ message: "Student with this email already exists" });
            } else if (!isStundentInUniveristy) {
                return res
                    .status(400)
                    .json({ message: "This email doesn't belong to a student" });
            }

        } catch (error) {
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }
    }
);

module.exports = router;