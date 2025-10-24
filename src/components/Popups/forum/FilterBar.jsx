import React, { useState } from "react";
import { Flame, Sparkles, TrendingUp, Clock } from "lucide-react";

export default function FilterBar({ onFilterChange, onTimeChange }) {
  const [activeFilter, setActiveFilter] = useState("new");
  const [activeTime, setActiveTime] = useState("all");

  const filters = [
    { id: "hot", label: "Hot", icon: <Flame size={16} />, description: "Nhiều tương tác" },
    { id: "new", label: "New", icon: <Sparkles size={16} />, description: "Mới nhất" },
    { id: "top", label: "Top", icon: <TrendingUp size={16} />, description: "Nhiều like nhất" },
    { id: "active", label: "Active", icon: <Clock size={16} />, description: "Hoạt động gần đây" },
  ];

  const timeFilters = [
    { id: "today", label: "Hôm nay" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
    { id: "all", label: "Tất cả" },
  ];

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange && onFilterChange(filterId);
  };

  const handleTimeClick = (timeId) => {
    setActiveTime(timeId);
    onTimeChange && onTimeChange(timeId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleFilterClick(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all transform hover:scale-105 active:scale-95 font-body focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                activeFilter === filter.id
                  ? "bg-primary-700 text-black shadow-md hover:bg-primary-800 focus:ring-primary-700/40"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300/40"
              }`}
              title={filter.description}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Time Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium font-body">Thời gian:</label>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {timeFilters.map((time) => (
              <button
                key={time.id}
                type="button"
                onClick={() => handleTimeClick(time.id)}
                aria-pressed={activeTime === time.id}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all transform font-body focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  activeTime === time.id
                    ? "bg-primary-700 text-black shadow-sm hover:bg-primary-800 focus:ring-primary-700/40"
                    : "bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:ring-gray-300/40"
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
