import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export default async function handler(req, res) {
    try {
        const { hallTicket } = req.query;

        if (!hallTicket) {
            return res.status(400).json({ message: "Hall ticket number is required" });
        }

        const filePath = path.join(process.cwd(), "public", "results.xlsx");

        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ message: "Results database not found" });
        }

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headerRow = data[0];
        const nameColumnIndex = headerRow.findIndex(header => header.trim() === "NAME");
        const hallTicketColumnIndex = headerRow.findIndex(header => header.trim() === "HALL TICKET NO");

        let studentRow;
        for (let i = 1; i < data.length; i++) { // Start from 1 to skip the header row
            if (String(data[i][hallTicketColumnIndex]).trim() === String(hallTicket).trim()) {
                studentRow = data[i];
                break;
            }
        }

        if (!studentRow) {
            return res.status(404).json({ message: "Result not found" });
        }

        const studentName = studentRow[nameColumnIndex] || "Unknown";

        const allSubjects = [
            { code: "IT101", name: "INFORMATION TECHNOLOGY", credits: "4", key: "IT" },
            { code: "C102", name: "PROGRAMMING IN C", credits: "4", key: "C" },
            { code: "LT103", name: "LOGIC THEORY", credits: "4", key: "LOGIC THEORY" },
            { code: "M104", name: "MATHEMATICS-1", credits: "2", key: "M-1" },
            { code: "BE105", name: "BUSINESS ECONOMICS", credits: "2", key: "BE" },
            { code: "CS106", name: "COMMUNICATION SKILLS", credits: "1", key: "CS" },
        ];

        const student = {};
        headerRow.forEach((header, index) => {
            student[header.trim()] = studentRow[index];
        });

        const subjects = allSubjects.map(subject => {
            const marks = student[subject.key];
            return {
                code: subject.code,
                name: subject.name,
                credits: subject.credits,
                grade: calculateGrade(marks),
            };
        });

        const formattedResult = {
            hallTicket: hallTicket,
            studentName: studentName,
            semester: student["SEMESTER"] || "1",
            subjects: subjects,
            scgpa: calculateSCGPA(subjects),
            cgpa: calculateCGPA(subjects),
            RESULT: determineResult(subjects),
        };

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: "An error occurred while fetching results" });
    }
}

function calculateGrade(marks) {
    const numericMarks = Number(marks);
    if (isNaN(numericMarks)) return "";

    if (numericMarks >= 85) {
        return "O";
    } else if (numericMarks >= 70) {
        return "A";
    } else if (numericMarks >= 60) {
        return "B";
    } else if (numericMarks >= 50) {
        return "C";
    } else if (numericMarks >= 40) {
        return "D";
    } else {
        return "F";
    }
}

function calculateSCGPA(subjects) {
    if (!subjects.length) return "";

    const totalCredits = subjects.reduce((sum, subject) => {
        const credits = Number(subject.credits);
        return sum + (isNaN(credits) ? 0 : credits);
    }, 0);

    const weightedSum = subjects.reduce((sum, subject) => {
        const credits = Number(subject.credits);
        const gradePoints = getGradePoints(subject.grade);
        return sum + credits * gradePoints;
    }, 0);

    return totalCredits ? (weightedSum / totalCredits).toFixed(2) : "";
}

function getGradePoints(grade) {
    const gradePoints = {
        O: 10,
        A: 9,
        B: 8,
        C: 7,
        D: 6,
        F: 0,
    };
    return gradePoints[grade] || 0;
}

function calculateCGPA(subjects) {
    return calculateSCGPA(subjects);
}

function determineResult(subjects) {
    if (!subjects.length) return "FAILED";
    const failedSubjects = subjects.filter((subject) => subject.grade === "F");
    return failedSubjects.length === 0 ? "PASSED" : "FAILED";
}
