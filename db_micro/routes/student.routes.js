require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const Student = require("../model/Student")


const router = Router();

router.get("/getAllStudents", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const allStudents = await Student.find({});

        return res.status(200).json(allStudents);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/getStudents", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { students } = req.body
        console.log("student.routes > /getStudents > req.body: ", req.body); 
        const studentsPopulated = await Promise.all(students.map(async (studentEmail) => {
            console.log("student.routes > /getStudents > studentEmail: ", studentEmail)
            const student = await Student.findOne({ email: studentEmail });
            console.log("student.routes > /getStudents > student: ", student)
            return student;
            
            // NEED TO HANDLE ERRORS (if student is not found for example, etc.)
        }));
        console.log("student.routes > /getStudents > studentsPopulated: ", studentsPopulated); 
        return res.status(200).json(studentsPopulated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

router.post("/getStudent", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        console.log("inside student.routes.js > getStudent: ", req.body)
        const { email } = req.body
        const student = await Student.findOne({ email });
        console.log(`Student: ${student}`);
        return res.status(200).json(student);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
});

router.post("/createStudent", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        console.log("inside student.routes.js > createStudent: ", req.body)
        const { student } = req.body
        const createdStudent = new Student({ email: student.email, password: student.password });
        console.log("created student: ", createdStudent)
        await createdStudent.save();
        console.log("inside student.routes.js > createStudent > createdStudent: ", createdStudent)
        if (createdStudent) {
            return res.status(200).json({ createdStudent });
        } else {
            return res.status(500).json({ createdStudent }); // actually I dont know what sata type will be createdStudent if saving fails
        }
        // .then(function (err, doc) {
        //     if (err) {
        //         console.log("inside student.routes.js > saveStudent > error: ", err);
        //         return res.status(500).json({ studentUpdated: false });
        //     } else {
        //         console.log("inside student.routes.js > saveStudent > all good:")
        //         return res.status(200).json({ studentUpdated: true });
        //     }
        // });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error, message: error.message })

    }
});

router.post("/updateStudent", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        console.log("inside student.routes.js > saveStudent: ", req.body)
        const { student } = req.body
        console.log("inside student.routes.js > saveStudent > student: ", student.attendance)
        const updatedStudent = await Student.findOneAndUpdate(student._id, student, { new: true })
        console.log("updatedStudent: ", updatedStudent);
        if (updatedStudent) {
            return res.status(200).json({ studentUpdated: true });
        } else {
            return res.status(500).json({ studentUpdated: false });
        }
        // .then(function (err, doc) {
        //     if (err) {
        //         console.log("inside student.routes.js > saveStudent > error: ", err);
        //         return res.status(500).json({ studentUpdated: false });
        //     } else {
        //         console.log("inside student.routes.js > saveStudent > all good:")
        //         return res.status(200).json({ studentUpdated: true });
        //     }
        // });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error, message: error.message })

    }
});


module.exports = router;