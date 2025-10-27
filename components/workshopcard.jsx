import React from "react";

export default function WorkshopCard({
  title = "AI & Machine Learning Workshop",
  type = "Technical",
  date = "Nov 12, 2025",
  time = "10:00 AM - 4:00 PM",
  venue = "Auditorium Hall, Block A",
  companies = 15,
  registered = 120,
}) {
  return (
    <div className="w-full sm:w-[48%] lg:w-[30%] bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
          {title}
        </h2>
        <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-teal-100 text-teal-800 font-medium whitespace-nowrap">
          {type}
        </span>
      </div>

      {/* Info Section */}
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>📅 <span className="text-gray-800 font-medium">{date}</span></p>
        <p>🕒 <span className="text-gray-800 font-medium">{time}</span></p>
        <p>📍 <span className="text-gray-800 font-medium">{venue}</span></p>
      </div>

      {/* Stats Box */}
      <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm text-gray-700 flex justify-between">
        <div className="text-center flex-1">
          <p className="font-semibold text-gray-900">{companies}</p>
          <p className="text-gray-500 text-xs">Companies</p>
        </div>
        <div className="text-center flex-1">
          <p className="font-semibold text-gray-900">{registered}</p>
          <p className="text-gray-500 text-xs">Registered</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <button className="w-full sm:flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
          Edit Event
        </button>
        <button className="w-full sm:flex-1 bg-white border border-teal-600 text-teal-700 py-2 rounded-lg hover:bg-teal-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
}
