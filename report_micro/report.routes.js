require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require('axios').default;
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const moment = require('moment');
const generateCSV = require("./csvGenerator")

const courseUrl = "http://localhost:5000/db/getCourses";
const studentUrl = "http://localhost:5000/db/getStudents";
const teacherUrl = "http://localhost:5000/db/getTeachers";


const router = Router();


router.get("/daily-report",

  async (req, res) => {
    const today = new Date("2022-04-24T22:08:30.000+00:00")

    try {

      const students = await axios
        .get(studentUrl)
        .then((response) => response.data)
        .catch((error) => {
          throw error.response;
        });
      const courses = await axios
        .get(courseUrl)
        .then((response) => response.data)
        .catch((error) => {
          throw error.response;
        });
      const teachers = await axios
        .get(teacherUrl)
        .then((response) => response.data)
        .catch((error) => {
          throw error.response;
        });
      //console.log("students", students)
      //console.log("courses",courses)
      //console.log(teachers)

      teachers.forEach(teacher => {
        const foundCoursesForTeacher = []
        teacher.coursesForTeacher.forEach(course => {
          // console.log("in for each teachers courses",course)

          const foundCourse = courses.filter(possibleCourse => {
            //console.log("possible course",possibleCourse)
            //console.log("course",course.toString())
            return ((possibleCourse._id).toString() === course.toString())
          })
          foundCoursesForTeacher.push(...foundCourse)
          //console.log("found course",foundCourse)
        })
        // console.log("for teacher",ForTeacher)
        teacher.coursesForTeacher = foundCoursesForTeacher
      })

      //lecture id
      teachers.forEach(teacher => {
        //console.log("teacher:", teacher)
        teacher.coursesForTeacher.forEach(course => {
          const lecturesForToday = course.lecturesForSemester.filter(lecture => {
            const lectureDate = new Date(lecture.startDateAndTime)
            return (today.getMonth() === lectureDate.getMonth() && today.getDate() === lectureDate.getDate())
          })
          teacher.coursesForTeacher = [{ ...course, lecturesForToday }]
          console.log("teacher.foundCoursesWithLecturesforToday: ", teacher)

        })
        //console.log("teacher; ",teacher.lecturesforToday)

      })
      // console.log("teachers with lecuter", teachersWithLecturesForToday)

      teachers.forEach(teacher => {
        const teacherWithCoursesAndStudents = teacher.coursesForTeacher.map(course => { // maybe better to go through teachers and for each teacher get its courses 
          const studentsInCourse = course.studentsInCourse.map(studentEmail => {
            const studentInCourse = students.filter(student => {
              return student.email === studentEmail
            })
            console.log("studentInCOurse", studentInCourse)
            return studentInCourse[0]
          })
          course.studentsInCourse = studentsInCourse
          return course
          console.log("course", course)

        })
        teacher.coursesForTeacher = teacherWithCoursesAndStudents

      })

      // console.log("teachersWithLecturesAndStudentsForToday",teachersWithLecturesAndStudentsForToday)

      teachers.forEach(teacher => {
        console.log("inside teacher")
        const teacherCourses = teacher.coursesForTeacher.map(course => {
          console.log("inside course")
          const studentsInCourse = course.studentsInCourse.map(student => {
            console.log("inside student")
            const lecturesForToday = student.attendance.filter(lecture => {
              console.log("inside attendance")
              const lectureDate = new Date(lecture.startDateAndTime)
              return (today.getMonth() === lectureDate.getMonth() && today.getDate() === lectureDate.getDate())
            })
            if (lecturesForToday.length > 0) {
              student.attendance = lecturesForToday
            }
            return student
          })
          if (studentsInCourse.length > 0) {
            course.studentsInCourse = studentsInCourse
          }
          return course
        })
        if (teacherCourses.length > 0) {
          teacher.coursesForTeacher = teacherCourses
        }
        return teacher
      })
      // const studentsForToday = students.filter(student => {
      //   student.attendance.filter(lecture => {
      //     const lectureDate = new Date(lecture.startDateAndTime)
      //     return (today.getMonth() === lectureDate.getMonth() && today.getDate() === lectureDate.getDate())
      //   })
      //   console.log("student.attendance", student.attendance)
      //   return student
      // })
      // let lessonStudents = []
      // let reportForTeachers = []


      // teachersWithLecturesForToday.forEach(teacher => {
      //   teacher.lecturesforToday.forEach(lecture => {
      //     students.forEach(student => {
      //       student.attendance.forEach(lesson => {
      //         if (lecture.lectureForSemesterId === lesson.lectureForSemesterId) {
      //           lessonStudents.push(student)
      //         }
      //       })
      //     })
      //     reportForTeachers.push({ teacher: teacher.email, teacherCourses: teacher.coursesForTeacher, lecture: lecture, presence: lessonStudents })

      //   })
      // })
      // console.log("report for teacher", reportForTeachers)
      //call e-mail sender  
      return res.json({ teachers })

    } catch (error) {
      console.log(error.message);
    }
  })

router.post("/email",
async (req, res) => {
  try {
      const {teacher} = req.body;
    console.log("teacher in email: ", teacher)
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: "a.sandrovschii@gmail.com",
        replyTo: "radu.cazacu1@gmail.com",
        subject: "subject",
        text: "Email sent from: " + "" + ' \n Name: ' + '\n Message: ' + 'Teacher email: ' + teacher.pathToFile,
        attachments: [
          {
            filename: "attendance_report.csv",
            path: `./${teacher.pathToFile}` 
          },
        ]
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).json({ message: "successfully emailed me " });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }


)

const todayMoment = moment().format();
const today = new Date();
console.log("today", today.toString())
console.log("todayMoment", todayMoment)
function formatDate(date) {
  /* take care of the values:
     second: 0-59 same for javascript
     minute: 0-59 same for javascript
     hour: 0-23 same for javascript
     day of month: 1-31 same for javascript
     month: 1-12 (or names) is not the same for javascript 0-11
     day of week: 0-7 (or names, 0 or 7 are sunday) same for javascript
     */
  return `${date.getSeconds() + 5} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} ${date.getDay()}`;
}

function formatDateMoment(momentDate) {
  const date = new Date(momentDate);

  return `${"*"} ${"*"} ${"*"} ${"*"} ${"*"} `;
  // or return moment(momentDate).format('ss mm HH DD MM dddd');
}

function runReportJob(data) {
  // or                     formatDateMoment
  const job = cron.schedule(formatDateMoment(data), () => {
    console.log(formatDateMoment(data))
    doSomething()
  })
};

async function doSomething() {
  // my code
  console.log(Date.now())
  const { teachers } = await axios.get("http://localhost:5000/report/daily-report")
    .then((response) => response.data)
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    
  const teachersWithGeneratedFile = await generateCSV(teachers);
  setTimeout(() => {console.log("waited until files get generated")}, 10000);
  console.log("teachersWithGeneratedFile: ",teachersWithGeneratedFile); 
  teachersWithGeneratedFile.forEach( async teacher => {

    const response = await axios.post("http://localhost:5000/report/email", {teacher})
      .then((response) => response.data)
      .catch(function (error) {
        // handle error
        console.log("error with email:", error);
      })
    console.log("response:", response);
  })
  // stop task or job

}

function runJob(data) {
  const job0 = cron.schedule(formatDateMoment(data), () => {
    date = new Date()
    runReportJob(todayMoment)

  })

}

//    todayMoment
runJob(todayMoment);



module.exports = router;