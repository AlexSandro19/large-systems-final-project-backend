require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const Course = require("../model/Course")
const University = require("../model/University")



const router = Router();

router.get("/getAllCourses", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const allCourses = await Course.find({});
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(allCourses);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/getCourses", 
// [
//     check("courses").exists({ checkFalsy: true }).withMessage("Courses not provided")
//     .isArray({min: 1}).withMessage("Courses should be sent in an array with at least a single value"), 
// ],
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { courses } = req.body; // an array should be received 
        // (ex. {
        //     "courses": ["62666c8732509c342d776af0", "626c641d971a4c7fd74ce2d4"]
        // })

        // console.log("req.body: ", req.body);
        const coursesPopulated = await Promise.all(courses.map(async (course_id) => {
            const course = await Course.findById(course_id);
            return course;

            // NEED TO HANDLE ERRORS (if course is not found for example, etc.)
        }));

        // var results: number[] = await Promise.all(arr.map(async (item): Promise<number> => {
        //     await callAsynchronousOperation(item);
        //     return item + 1;
        // }));

        console.log("/getCourse > getCourses: ", coursesPopulated);
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(coursesPopulated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/getCourse", 
// [
//     check("course_id").exists({ checkFalsy: true }).withMessage("Course id not provided")
//     .isString().withMessage("Value should be sent as string value")
//     .isMongoId().withMessage("Value provided is not correct type"), 
// ],
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { course_id } = req.body; // a single course should be received

        console.log("course.routes > req.body: ", req.body);
        const coursePopulated = await Course.findById(course_id);
        // var results: number[] = await Promise.all(arr.map(async (item): Promise<number> => {
        //     await callAsynchronousOperation(item);
        //     return item + 1;
        // }));

        console.log("/getCourse > allCourses: ", coursePopulated);
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(coursePopulated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

module.exports = router;