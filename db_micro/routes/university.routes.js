require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const University = require("../model/University")


const router = Router();

router.get("/getAllUniversities", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const allUniversities = await University.find({});
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(allUniversities);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})


router.post("/getUniversity", 
// [
//     check("universityAttended").exists({ checkFalsy: true }).withMessage("University id not provided")
//         .isMongoId().withMessage("Value provided is not correct type"),
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
        console.log("inside university.routes.js > getUniversity: ", req.body)
        const { universityAttended } = req.body
        const university = await University.findById(universityAttended);
        console.log(`university: ${university}`);
        if (!university) {
            return res.status(400).json({
                message: "Invalid authorization data",
                errors: [{ value: universityAttended, msg: "University not found", param: "id" }],
            });
        }
        return res.status(200).json(university);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})


router.post("/getUniversityGeolocations", 
// [
//     check("universityAttended").exists({ checkFalsy: true }).withMessage("University id not provided")
//         .isMongoId().withMessage("Value provided is not correct type"),
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
        console.log("inside university.routes.js > getUniversityGeolocations: ", req.body)
        const { universityAttended } = req.body
        const university = await University.findById(universityAttended);
        console.log(`university: ${university}`);
        if (!university) {
            return res.status(400).json({
                message: "Invalid authorization data",
                errors: [{ value: universityAttended, msg: "University not found", param: "id" }],
            });
        }
        const universityGeolocations = university.geolocations;
        return res.status(200).json(universityGeolocations);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/checkStudentInUniveristy", 
// [
//     check("email").exists({ checkFalsy: true }).withMessage("Email not provided").trim()
//             .normalizeEmail().isEmail().withMessage("Wrong email format"),
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
        console.log("inside university.routes.js > checkStudentInUniveristy: ", req.body)
        const { email } = req.body
        let isStundentInUniveristy = false
        const allUniversities = await University.find({});
        console.log("allUniversities: ", allUniversities)
        allUniversities.forEach(university => {
            console.log("university.studentEmails: ", university.studentEmails)
            university.studentEmails.forEach(studentEmail => {
                if (studentEmail === email) {
                    isStundentInUniveristy = true;
                }
            })
        })
        console.log(`isStundentInUniveristy: ${isStundentInUniveristy}`);
        return res.status(200).json(isStundentInUniveristy);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})



module.exports = router;