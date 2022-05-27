require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const Course = require("../model/Course")
const University = require("../model/University")



const router = Router();

router.get("/getCourses", async (req, res) => {
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

router.post("/getCourse", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data while sending",
            });

        }
        const { coursesForStudent } = req.body; // an array should be received 
        // (ex. {
        //     "coursesForStudent": ["62666c8732509c342d776af0", "626c641d971a4c7fd74ce2d4"]
        // })

        // console.log("req.body: ", req.body);
        const allCourses = await Promise.all(coursesForStudent.map(async (course_id) => {
            const course = await Course.findById(course_id);
            return course;

            // NEED TO HANDLE ERRORS (if course is not found for example, etc.)
        }));

        // var results: number[] = await Promise.all(arr.map(async (item): Promise<number> => {
        //     await callAsynchronousOperation(item);
        //     return item + 1;
        // }));

        console.log("/getCourse > allCourses: ", allCourses);
        // const updatedOrder = await C.findByIdAndUpdate(order._id, order, { new: true });
        //console.log(updatedOrder);
        return res.status(200).json(allCourses);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error, message: error.message })

    }
})

// router.post("/updateOrder", async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 errors: errors.array(),
//                 message: "Invalid data while sending",
//             });

//         }
//         const { order } = req.body
//         const updatedOrder = await Order.findByIdAndUpdate(order._id, order, { new: true });
//         //console.log(updatedOrder);
//         return res.status(200).json(updatedOrder);
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ error: error, message: error.message })

//     }
// })

// router.post("/createOrder", async (req, res) => {

//     try {

//         const data = req.body;
//         console.log("/createOrder req.body, ", req.body)
//         const order = new Order({ ...data })
//         await order.save();
//         // const upddatedOrder = await Order.findOne({_id:order._id}).populate("items");
//         console.log("CreatedOrder, ", order)
//         const user = await User.findOne({ _id: order.userId });
//         user.orders.push(order)
//         user.cart = []
//         await user.save()
//         // const updatedOrders = [...user.orders, order._id];
//         // console.log("updatedOrders ", updatedOrders)
//         // console.log("updatedOrders ofter push ", updatedOrders)
//         // await user.updateOne({_id: user._id}, {orders: updatedOrders})
//         const newUser = await User.findOne({ _id: user._id });
//         console.log("User new", newUser);
//         return res.status(201).json(order);
//     } catch (error) {

//         console.log(error.message);
//         return res.status(500).json({ error: error, message: error.message })
//     }

// })

// router.post("/order", async (req, res) => {

//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 errors: errors.array(),
//                 message: "Invalid data while sending",
//             });
//         }

//         const { orderId } = req.body;
//         //console.log(orderId);
//         const order = await Order.findOne({ _id: orderId }).populate("items");
//         //console.log(order);
//         if (!order) {
//             return res.status(400).json({ message: "Order not found" })
//         }
//         return res.status(200).json(order);
//     } catch (error) {

//         console.log(error.message);
//         return res.status(500).json({ error: error, message: error.message })
//     }

// })


// router.post("/saveCart",
//     async (req, res) => {
//         try {
//             console.log("api/saveCart is called");
//             // const {user, cart} = req.body
//             const { user, cart } = req.body;
//             console.log("req.body in saveCart", req.body);
//             await User.findByIdAndUpdate(user.id, { ...user, cart });
//             const updatedUser = await User.findOne({ _id: user.id }).populate("cart");
//             console.log("updatedUser in /saveCart ", updatedUser)
//             return res.status(200).json(updatedUser);
//             // if (Object.keys(savedItem).length !== 0){
//             //   console.log("item updated successfully");
//             //   return res.status(200).json(savedItem);
//             // }else {
//             //   console.log("item didnt update");
//             // }
//             // if (items.length === 0) {
//             //   return res.status(404).json({ message: "No data available" });
//             // }
//             // console.log(items);
//             // return res.status(200).json(items);

//         } catch (error) {
//             console.log(error.message);
//             return res.status(404).json({ didUserUpdate: false, message: error });

//         }

//     }
// );



module.exports = router;