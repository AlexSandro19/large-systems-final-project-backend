require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const Teacher = require("../model/Teacher")


const router = Router();

router.get("/getAllTeachers", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const allTeachers = await Teacher.find({});
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(allTeachers);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/getTeacher", 
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
        console.log("inside teacher.routes.js > getTeacher: ", req.body)
        const { email } = req.body
        const teacher = await Teacher.findOne({ email });
        console.log(`teacher: ${teacher}`);
        return res.status(200).json(teacher);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
});

module.exports = router;