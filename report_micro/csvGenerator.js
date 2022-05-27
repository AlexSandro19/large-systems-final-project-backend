
const csv = require('csv')
const fs = require("fs");

const generateCSV = async (teachers) => {
    const columns = [
        "Course Name",
        "Date",
        "Start Time",
        "End Time",
        "Student",
        "Attendance",
    ];


    
    const teachersWithPath = teachers.map(teacher => {
        const saveStudentData = [];
       
        const filename =  `${teacher.email}.csv`;
        const writableStream = fs.createWriteStream(filename);
    
        const stringifier = csv.stringify({ header: true, columns: columns });
        // lets suppose we will have teachers[], and each teacher will have courses
        const globalArrayAllCourses = teacher.coursesForTeacher.map(course => {
            const innerArraystudentsInCourse = course.studentsInCourse.map(student => {
                const innerArrayAttendanceForEachStudent = student.attendance.map(lecture => {
                    const lectureStartDateAndTime = new Date(lecture.startDateAndTime)
                    const lectureEndDateAndTime = new Date(lecture.endDateAndTime)
                    const aggreagatedObject = { courseName: course.courseName, date: lectureStartDateAndTime.toDateString(), startTime: lectureStartDateAndTime.toTimeString(), endTime: lectureEndDateAndTime.toTimeString(), student: student.email, attendance: lecture.presence }
                    // console.log("aggreagatedObject:", aggreagatedObject);
                    const propertyValues = Object.values(aggreagatedObject);
                    // console.log(propertyValues);
                    saveStudentData.push(propertyValues);
                })
            })
        })
    
        console.log("saveStudentData: ", saveStudentData);
    
        saveStudentData.forEach(dataRow => {
            stringifier.write(dataRow);
    
        })
        stringifier.pipe(writableStream);
        console.log("Finished writing data");
        teacher.pathToFile = filename;
        console.log("teacher.pathToFile: ",teacher.pathToFile )
        return teacher
    })
    return teachersWithPath
}

module.exports = generateCSV;
