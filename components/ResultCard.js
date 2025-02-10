import React, { useRef, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultCard = ({ result, loading }) => {
    const componentRef = useRef();
    const [isBusy, setIsBusy] = useState(false); // Manages the state during printing and downloading

    const handlePrint = async () => {
        setIsBusy(true);
        const printContents = componentRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        try {
            document.body.innerHTML = printContents;
            window.print();
        } finally {
            document.body.innerHTML = originalContents;
            setIsBusy(false); // Reset state after the print dialog is closed
        }
    };

    const handleDownloadPdf = async () => {
        setIsBusy(true);
        try {
            const canvas = await html2canvas(componentRef.current, {
                scale: 2,  // Improved resolution
                useCORS: true  // Handle cross-origin images if needed
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('result.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsBusy(false);  // Reset state regardless of outcome
        }
    };

    if (loading) {
        return <p className="text-center text-neutral-600">Loading results...</p>;
    }

    if (!result) {
        return <p className="text-center">No results found.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full p-4">
            <div className="w-full max-w-4xl" ref={componentRef}>
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-4 bg-white p-4">
                        <img src="logo.png" alt="VV Logo" className="h-12 w-12" />
                        <h1 className="text-2xl mt-1 mb-1 font-bold text-gray-800">BS-MS AUTONOMOUS 2024-2025</h1>
                    </div>
                    <h2 className="text-1x2 -mt-2 ml-5 mb- font-semibold text-gray-800">VISHWA VISHWANI INSTITUE OF SYSTEMS AND MANAGEMENT</h2>
                    <p className="text-gray-600">Hyderabad - TS.(INDIA)</p>
                    <p className="text-gray-700 font-bold mt-2">SEMESTER GRADE REPORT</p>
                </div>
                <div className="flex flex-wrap justify-center gap-80 mb-4">
                    <div className="text-center">
                        <strong className="text-gray-700 block mb-1 m-auto">Name:</strong>
                        <span className="text-gray-900">{result.studentName || ""}</span>
                    </div>
                    <div className="text-center">
                        <strong className="text-gray-700 block mb-1">Roll No:</strong>
                        <span className="text-gray-900">{result.hallTicket || "N/A"}</span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto mt-6">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PAPER CODE</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PAPER TITLE</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">CREDITS</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">GRADE AWARDED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.subjects && result.subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{subject.code}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{subject.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{subject.credits}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{subject.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-center mt-6">
                    <div className="inline-block">
                        <strong className="text-gray-700 mr-2">SCGPA:</strong>
                        <span className="text-gray-900">{result.scgpa || "N/A"}</span>
                    </div>
                    <div className="inline-block ml-4">
                        <strong className="text-gray-700 mr-2">CGPA:</strong>
                        <span className="text-gray-900">{result.cgpa || "N/A"}</span>
                    </div>
                    <div className="inline-block ml-4">
                        <strong className="text-gray-700 mr-2">Result:</strong>
                        <span className={`font-bold ${result.RESULT === "PASSED" ? "text-green-600" : "text-red-600"}`}>{result.RESULT || "N/A"}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <button onClick={handlePrint} className="bg-blue-500  hover:scale-110 cursor-pointer hover:bg-blue-500  text-white mr-72 mt-3 font-bold py-2 px-4 rounded" disabled={isBusy}>
                    Print Result
                </button>
                <button onClick={handleDownloadPdf} className="bg-blue-500 hover:scale-110 cursor-pointer hover:bg-blue-600 text-white  font-bold py-2 px-4 rounded" disabled={isBusy}>
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default ResultCard;
