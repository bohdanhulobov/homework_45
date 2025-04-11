import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Create a default course
const defaultCourseId = uuidv4();
let courses = [
  {
    id: defaultCourseId,
    name: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    startDate: "2025-05-01",
    lessonCount: 12,
    students: [],
  },
];

let students = [];

// Function to update the students reference from the students.js module
const updateStudentsReference = async () => {
  try {
    const studentsModule = await import("./students.js");
    // Get the latest reference to the students array
    students = studentsModule.default.getStudents();
    console.log(`Updated students reference. Count: ${students.length}`);
  } catch (error) {
    console.error("Error importing students:", error);
  }
};

// Initial load of students data
updateStudentsReference();

// Helper function for finding courses that works with both string and numeric IDs
const findCourseById = (id) => {
  // Convert to string for comparison since IDs from client might be numeric
  const searchId = id.toString();
  return courses.find((c) => c.id.toString() === searchId);
};

router.get("/", (req, res) => {
  res.json(courses);
});

router.get("/:id", (req, res) => {
  const course = findCourseById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

// Endpoint to get students for a specific course
router.get("/:id/students", async (req, res) => {
  // Update the students reference to ensure we have the latest data
  await updateStudentsReference();

  const courseId = req.params.id;
  const course = findCourseById(courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  // If course exists but has no students array, initialize it
  if (!course.students) {
    course.students = [];
  }

  // Get the student objects for each student ID in the course
  const courseStudents = course.students
    .map((studentId) => {
      const studentIdStr = studentId.toString();
      const foundStudent = students.find(
        (s) => s.id.toString() === studentIdStr,
      );
      if (!foundStudent) {
        console.log(`Student with ID ${studentIdStr} not found`);
      }
      return foundStudent;
    })
    .filter((student) => student !== undefined); // Filter out any undefined students

  console.log(`Found ${courseStudents.length} students for course ${courseId}`);
  res.json(courseStudents);
});

router.post("/", (req, res) => {
  const { name, description, startDate, lessonCount } = req.body;
  const newCourse = {
    id: uuidv4(),
    name,
    description,
    startDate,
    lessonCount,
    students: [],
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

router.put("/assign-student/:courseId", async (req, res) => {
  // Update students reference first
  await updateStudentsReference();

  const course = findCourseById(req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const newStudentId = req.body.studentId;
  if (!newStudentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  // Check if student exists
  const studentExists = students.some(
    (s) => s.id.toString() === newStudentId.toString(),
  );
  if (!studentExists) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Check if student is already assigned to this course
  if (!course.students) {
    course.students = [];
  }

  const alreadyAssigned = course.students.some(
    (id) => id.toString() === newStudentId.toString(),
  );

  if (!alreadyAssigned) {
    course.students.push(newStudentId);
    console.log(`Student ${newStudentId} assigned to course ${course.id}`);
  } else {
    console.log(
      `Student ${newStudentId} is already assigned to course ${course.id}`,
    );
  }

  res.json(course);
});

router.put("/:id", (req, res) => {
  const course = findCourseById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  course.name = req.body.name || course.name;
  course.description = req.body.description || course.description;
  course.startDate = req.body.startDate || course.startDate;
  res.json(course);
});

router.delete("/:id", (req, res) => {
  const idToDelete = req.params.id.toString();
  courses = courses.filter((c) => c.id.toString() !== idToDelete);
  res.status(204).send();
});

export default router;
