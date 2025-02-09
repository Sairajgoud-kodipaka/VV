import React from "react";

const ResultCard = ({ result, loading }) => {
  if (loading) {
    return <p className="text-center from-neutral-600">Loading results...</p>;
  }

  if (!result) {
    return <p className="text-center">No results found.</p>;
  }

  console.log("Result in ResultCard:", result); // Debugging

  return (
    <div className="container max-w-1 mt-8 p-4">
    {/* University Header Section */}
    <div className="text-center mb-4 mt-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        VISHWA VISHWANI UNIVERSITY
      </h2>
      <p className="text-gray-600">Hyderabad - TS.(INDIA)</p>
      <p className="text-gray-700 font-bold">SEMESTER GRADE REPORT</p>
    </div>

      {/* Student Info Section */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <strong className="text-gray-700 mb-4">Name:</strong>
          <span className="text-gray-900"> {result.studentName || ""}</span>
        </div>
        <div>
          <strong className="text-gray-700 ">Roll No:</strong>
          <span className="text-gray-900"> {result.hallTicket || ""}</span>
        </div>
      </div>

      {/* Table Section */}
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              PAPER CODE
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              PAPER TITLE
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              CREDITS
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              GRADE AWARDED
            </th>
          </tr>
        </thead>
        <tbody>
          {result.subjects && result.subjects.length > 0 ? (
            result.subjects.map((subject, index) => (
              <tr key={index}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {subject.code}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {subject.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {subject.credits}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {subject.grade}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer Section */}
      <div className="mt-4">
        <strong className="text-gray-700">SCGPA:</strong>
        <span className="text-gray-900"> {result.scgpa || ""}</span>
      </div>
      <div className="mt-2">
        <strong className="text-gray-700">CGPA:</strong>
        <span className="text-gray-900"> {result.cgpa || ""}</span>
      </div>
      <div className="mt-2">
        <strong className="text-gray-700">Result:</strong>
        <span className={`text-gray-900 font-bold ${result.RESULT === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
          {result.RESULT || ""}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
