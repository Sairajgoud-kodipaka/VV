import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from 'next/image';
import {  DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/solid';

const ResultCard = ({ result, loading }) => {
    const componentRef = useRef();
    const [isBusy, setIsBusy] = useState(false);

    const handlePrint = async () => {
        setIsBusy(true);
        const printContents = componentRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        try {
            document.body.innerHTML = printContents;
            window.print();
        } finally {
            document.body.innerHTML = originalContents;
            setIsBusy(false);
        }
    };

    const handleDownloadPdf = async () => {
        setIsBusy(true);
        try {
            const canvas = await html2canvas(componentRef.current, {
                scale: 10,
                useCORS: true,
            });

            const pdf = new jsPDF("p", "mm", "a4");
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("result.pdf");
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsBusy(false);
        }
    };

    if (loading) {
        return <p className="text-center text-neutral-600">Loading results...</p>;
    }

    if (!result) {
        return <p className="text-center">No results found.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-2 sm:px-4">
            <div className="w-full max-w-full md:max-w-4xl p-4 bg-white shadow-md rounded-lg overflow-hidden" ref={componentRef}>
                <div className="text-center mb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4 bg-white p-4">
                        <Image src="/logo.png" alt="VV Logo" width={48} height={48} className="h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-0" />
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
                            BS-MS AUTONOMOUS 2024-2025
                        </h1>
                    </div>
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
                        VISHWA VISHWANI INSTITUTE OF SYSTEMS AND MANAGEMENT
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm">Hyderabad - TS. (INDIA)</p>
                    <p className="text-gray-700 font-bold mt-2 text-sm sm:text-base">SEMESTER GRADE REPORT</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-20 mb-4 border-gray-200 pb-4">
                    <div className="text-center">
                        <strong className="text-gray-700 block mb-1">Name:</strong>
                        <span className="text-gray-900">{result.studentName || ""}</span>
                    </div>
                    <div className="text-center">
                        <strong className="text-gray-700 block mb-1">Roll No:</strong>
                        <span className="text-gray-900">{result.hallTicket || "N/A"}</span>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {["PAPER CODE", "PAPER TITLE", "CREDITS", "GRADE AWARDED"].map((title, i) => (
                                    <th key={i} className="px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.subjects.map((subject, index) => (
                                <tr key={index} className="text-center">
                                    <td className="px-2 sm:px-5 py-2 sm:py-5 border-b border-gray-200 bg-white text-xs sm:text-sm">{subject.code}</td>
                                    <td className="px-2 sm:px-5 py-2 sm:py-5 border-b border-gray-200 bg-white text-xs sm:text-sm">{subject.name}</td>
                                    <td className="px-2 sm:px-5 py-2 sm:py-5 border-b border-gray-200 bg-white text-xs sm:text-sm">{subject.credits}</td>
                                    <td className="px-2 sm:px-5 py-2 sm:py-5 border-b border-gray-200 bg-white text-xs sm:text-sm">{subject.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-center mt-6 text-xs sm:text-base font-bold">
                    <strong className="text-gray-700">RESULT: </strong>
                    <span className={result.RESULT === "FAILED" ? "text-red-500" : "text-green-500"}>{result.RESULT || "N/A"}</span>
                </div>

                <div className="text-center mt-2 text-base sm:text-base">
                    <strong className="text-gray-700">SCGPA:</strong> <span className="text-gray-900 mr-4">{result.RESULT === "FAILED" ? "N/A" : result.scgpa || "N/A"}</span>
                    <strong className="text-gray-700">CGPA:</strong> <span className="text-gray-900">{result.RESULT === "FAILED" ? "N/A" : result.cgpa || "N/A"}</span>
                </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-8">
                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-blue-300 shadow-lg hover:bg-blue-100/80 text-blue-700 font-bold py-3 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 mt-2"
                    disabled={isBusy}
                >
                    <PrinterIcon className="h-6 w-6" /> Print Result
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-green-300 shadow-lg hover:bg-green-100/80 text-green-700 font-bold py-3 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 mt-2"
                    disabled={isBusy}
                >
                    <DocumentArrowDownIcon className="h-6 w-6" /> Download PDF
                </button>
            </div>
        </div>
    );
};

export default ResultCard;
