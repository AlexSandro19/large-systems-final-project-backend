require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const Teacher = require("../model/Teacher")


const router = Router();

router.get("/getTeachers", async (req, res) => {
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

module.exports = router;