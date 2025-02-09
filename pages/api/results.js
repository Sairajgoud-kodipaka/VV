import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export default async function handler(req, res) {
  try {
    const { hallTicket } = req.query;

    if (!hallTicket) {
      return res.status(400).json({ message: "Hall ticket number is required" });
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const filePath = path.join(process.cwd(), "public", "results.xlsx");
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: "Results database not found" });
    }

    const workbook = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const student = data.find(
      (row) => String(row["HALL TICKET NO"]).trim() === String(hallTicket).trim()
    );

    if (!student) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Initialize subjects array
    const subjects = [];

    // Add only subjects that have data
    if (student['IT']) subjects.push({ code: 'IT101', name: 'INFORMATION TECHNOLOGY', credits: student['IT'] || '', grade: calculateGrade(student['IT']) });
    if (student['C']) subjects.push({ code: 'C102', name: 'PROGRAMMING IN C', credits: student['C'] || '', grade: calculateGrade(student['C']) });
    if (student['LOGIC THEORY']) subjects.push({ code: 'LT103', name: 'LOGIC THEORY', credits: student['LOGIC THEORY'] || '', grade: calculateGrade(student['LOGIC THEORY']) });
    if (student['M-1']) subjects.push({ code: 'M104', name: 'MATHEMATICS-1', credits: student['M-1'] || '', grade: calculateGrade(student['M-1']) });
    if (student['BE']) subjects.push({ code: 'BE105', name: 'BUSINESS ECONOMICS', credits: student['BE'] || '', grade: calculateGrade(student['BE']) });
    if (student['CS']) subjects.push({ code: 'CS106', name: 'COMMUNICATION SKILLS', credits: student['CS'] || '', grade: calculateGrade(student['CS']) });

    const formattedResult = {
      hallTicket: student["HALL TICKET NO"],
      studentName: student["STUDENT NAME"],
      semester: student["SEMESTER"] || "1",
      subjects: subjects,
      scgpa: calculateSCGPA(subjects),
      cgpa: calculateCGPA(subjects),
      RESULT: determineResult(subjects)
    };

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "An error occurred while fetching results" });
  }
}

function calculateGrade(marks) {
  const numericMarks = Number(marks);
  if (isNaN(numericMarks)) return '';

  if (numericMarks >= 90) return 'A+';
  if (numericMarks >= 80) return 'A';
  if (numericMarks >= 70) return 'B';
  if (numericMarks >= 60) return 'C';
  if (numericMarks >= 50) return 'D';
  return 'F';
}

function calculateSCGPA(subjects) {
  if (!subjects.length) return '';
  
  const totalCredits = subjects.reduce((sum, subject) => {
    const credits = Number(subject.credits);
    return sum + (isNaN(credits) ? 0 : credits);
  }, 0);

  const weightedSum = subjects.reduce((sum, subject) => {
    const credits = Number(subject.credits);
    const gradePoints = getGradePoints(subject.grade);
    return sum + (credits * gradePoints);
  }, 0);

  return totalCredits ? (weightedSum / totalCredits).toFixed(2) : '';
}

function getGradePoints(grade) {
  const gradePoints = {
    'A+': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'F': 0
  };
  return gradePoints[grade] || 0;
}

function calculateCGPA(subjects) {
  return calculateSCGPA(subjects);
}

function determineResult(subjects) {
  if (!subjects.length) return 'FAILED';
  const failedSubjects = subjects.filter(subject => subject.grade === 'F');
  return failedSubjects.length === 0 ? 'PASSED' : 'FAILED';
}