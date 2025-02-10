"use client";

import React, { useRef, useEffect, useState } from "react";

const ResultCard = ({ result, loading }) => {
    const componentRef = useRef();
    const [html2pdf, setHtml2pdf] = useState(null);

    useEffect(() => {
        // Load html2pdf.js dynamically on the client-side
        const loadHtml2Pdf = async () => {
            try {
                const importedHtml2pdf = (await import('html2pdf.js')).default;
                setHtml2pdf(() => importedHtml2pdf); // Store the function itself
            } catch (error) {
                console.error("Failed to load html2pdf.js", error);
            }
        };

        loadHtml2Pdf();
    }, []);

    const handlePrint = () => {
        // Print functionality
        const printContent = componentRef.current.outerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    const handleDownloadPdf = () => {
        // Download PDF functionality
        if (!html2pdf) {
            console.warn("html2pdf.js not loaded yet");
            return;
        }

        const element = componentRef.current;

        const opt = {
            margin: 1,
            filename: 'result.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
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
                {/* University Header Section */}
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-4 bg-white p-4">
                        <img src="logo.png" alt="VV Logo" className="h-12 w-12" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            BS-MS AUTONOMOUS 2024-2025
                        </h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        VISHWA VISHWANI UNIVERSITY
                    </h2>
                    <p className="text-gray-600">Hyderabad - TS.(INDIA)</p>
                    <p className="text-gray-700 font-bold">SEMESTER GRADE REPORT</p>
                </div>

                {/* Student Info Section */}
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <div className="text-center mr-auto gap-40">
                        <strong className="text-gray-700 block mb-1 ">Name:</strong>
                        <span className="text-gray-900">{result.studentName || ""}</span>
                    </div>
                    <div className="text-center mr-0 ">
                        <strong className="text-gray-700 block mb-1 -ml-34 gap-34">Roll No:</strong>
                        <span className="text-gray-900 -ml-34">
                            {result.hallTicket || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full overflow-x-auto mt-6">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3  border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    PAPER CODE
                                </th>
                                <th className="px-5 py-3  border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    PAPER TITLE
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    CREDITS
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    GRADE AWARDED
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.subjects && result.subjects.length > 0 ? (
                                result.subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
                                            {subject.code}
                                        </td>
                                        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
                                            {subject.name}
                                        </td>
                                        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
                                            {subject.credits}
                                        </td>
                                        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
                                            {subject.grade}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="text-center mt-6">
                    <div className="inline-block">
                        <strong className="text-gray-700  mr-2">SCGPA:</strong>
                        <span className="text-gray-900">{result.scgpa || "N/A"}</span>
                    </div>
                    <div className="inline-block ml-4">
                        <strong className="text-gray-700 mr-2">CGPA:</strong>
                        <span className="text-gray-900">{result.cgpa || "N/A"}</span>
                    </div>
                    <div className="inline-block ml-4">
                        <strong className="text-gray-700 mr-2">Result:</strong>
                        <span
                            className={`font-bold ${result.RESULT === "PASSED" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {result.RESULT || "N/A"}
                        </span>
                    </div>
                </div>
            
            </div>
            <div className="mt-4 text-center ">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-10 rounded mr-36"
                    >
                        Print Result
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download PDF
                    </button>
                </div>
        </div>
    );
};

export default ResultCard;
