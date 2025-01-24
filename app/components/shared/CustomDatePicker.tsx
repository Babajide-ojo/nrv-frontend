import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { useFormikContext, Field, ErrorMessage } from 'formik';

interface CustomDatePickerProps {
  label?: string;
  name: string;
  cls?: any;
  errorMessage?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label, name, cls, errorMessage }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'day' | 'month' | 'year' | 'month-year'>('day');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const { setFieldValue, setFieldTouched, values } = useFormikContext<any>();

  // Abbreviated months (3-letter format)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setFieldValue(name, date.toISOString().split('T')[0]); // Format the date as 'YYYY-MM-DD'
    setShowCalendar(false);
  };

  const handleMonthClick = (month: number) => {
    setCurrentMonth(month);
    setCurrentView('day');
  };

  const handleYearClick = (year: number) => {
    setCurrentYear(year);
    setCurrentView('month');
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: JSX.Element[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? 'selected' : ''}`}
          onClick={() => handleDateClick(new Date(currentYear, currentMonth, day))}
          role="button"
          tabIndex={0}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const generateMonthView = () => {
    return months.map((month, index) => (
      <div
        key={index}
        className={`calendar-month ${index === currentMonth ? 'bg-blue-500 text-white' : 'text-gray-800'} text-xs p-2 cursor-pointer text-center hover:bg-blue-300 rounded-md`}
        onClick={() => handleMonthClick(index)}
        role="button"
        tabIndex={0}
      >
        {month}
      </div>
    ));
  };

  const generateYearView = () => {
    return years.map((year) => (
      <div
        key={year}
        className={`calendar-year ${year === currentYear ? 'bg-blue-500 text-white' : 'text-gray-800'} text-xs p-2 cursor-pointer text-center hover:bg-blue-300 rounded-md`}
        onClick={() => handleYearClick(year)}
        role="button"
        tabIndex={0}
      >
        {year}
      </div>
    ));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-date-picker mt-8" ref={calendarRef}>
      {label && <label className="date-input-label font-medium">{label}</label>}
      <div className="relative border border-gray-400 rounded-md cursor-pointer focus:ring-2 focus:ring-blue-400">
        <Field
          type="text"
          name={name}
          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
          readOnly
          className={`date-input text-sm ${cls} p-2 pr-10 `}
          placeholder='dd/mm/yyyy'
          aria-label={label}
        />
        <FaCalendarAlt
          className="calendar-icon absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          onClick={() => setShowCalendar(!showCalendar)}
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs"
      />
      {showCalendar && (
        <div className="calendar absolute z-10 bg-white shadow-xl rounded-md mt-2 w-3/5 p-4">
          {currentView === 'day' && (
            <>
              <div className="calendar-header flex justify-between items-center mb-2">
                <button
                  type="button"
                  className="calendar-nav-button text-gray-600 hover:text-blue-600"
                  onClick={() => setCurrentMonth(prev => (prev + 11) % 12)}
                  aria-label="Previous Month"
                >
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year text-lg">{months[currentMonth]} {currentYear}</span>
                <button
                  type="button"
                  className="calendar-nav-button text-gray-600 hover:text-blue-600"
                  onClick={() => setCurrentMonth(prev => (prev + 1) % 12)}
                  aria-label="Next Month"
                >
                  <FaChevronRight />
                </button>
              </div>
              <div className="calendar-body grid grid-cols-7 gap-2">
                {generateCalendarDays()}
              </div>
              <button
                type="button"
                className="calendar-back-button w-full mt-4 py-2 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                onClick={() => setCurrentView('month-year')}
                aria-label="Back to Month/Year"
              >
                Back to Month/Year
              </button>
            </>
          )}

          {currentView === 'month-year' && (
            <>
              <div className="calendar-header flex justify-between items-center mb-2">
                <span className="calendar-month-year text-lg">Select Month and Year</span>
              </div>
              <div className="month-year-view grid grid-cols-2 gap-4">
                <div className="month-view grid grid-cols-3 gap-1">{generateMonthView()}</div>
                <div className="year-view grid grid-cols-4 gap-1">{generateYearView()}</div>
              </div>
            </>
          )}

          {currentView === 'month' && (
            <>
              <div className="calendar-header flex justify-between items-center mb-2">
                <button className="calendar-nav-button text-gray-600 hover:text-blue-600" onClick={() => setCurrentView('year')} aria-label="Previous Decade">
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year text-lg">Select Month</span>
                <button className="calendar-nav-button text-gray-600 hover:text-blue-600" disabled aria-label="Next Decade">
                  <FaChevronRight />
                </button>
              </div>
              <div className="month-view grid grid-cols-3 gap-">{generateMonthView()}</div>
            </>
          )}

          {currentView === 'year' && (
            <>
              <div className="calendar-header flex justify-between items-center mb-2">
                <button className="calendar-nav-button text-gray-600 hover:text-blue-600" onClick={() => setCurrentYear(prev => prev - 10)} aria-label="Previous 10 Years">
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year text-lg">Select Year</span>
                <button className="calendar-nav-button text-gray-600 hover:text-blue-600" onClick={() => setCurrentYear(prev => prev + 10)} aria-label="Next 10 Years">
                  <FaChevronRight />
                </button>
              </div>
              <div className="year-view grid grid-cols-4 gap-2">{generateYearView()}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
