import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import './CustomDatePicker.css'; // Ensure this file has responsive styles
import { useFormikContext, Field, ErrorMessage } from 'formik';
import '../shared/CustomDatePicker.css'

interface CustomDatePickerProps {
  label?: string;
  name: string;
  cls?: any
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label, name, cls }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'day' | 'month' | 'year'>('day');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const { setFieldValue, setFieldTouched, values } = useFormikContext<any>();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
        className={`calendar-month ${index === currentMonth ? 'selected' : ''}`}
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
        className={`calendar-year ${year === currentYear ? 'selected' : ''}`}
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
      {label && <label className="date-input-label">{label}</label>}
      <div className="date-input-wrapper">
        <Field
          type="text"
          name={name}
          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
          readOnly
          className={`date-input text-sm ${cls}`}
          placeholder='dd/mm/yyyy'
          aria-label={label}
        />
        <FaCalendarAlt className="calendar-icon" onClick={() => setShowCalendar(!showCalendar)} />
      </div>
      <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-xs"
        />
      {showCalendar && (
        <div className="calendar" aria-expanded={showCalendar}>
          {currentView === 'day' && (
            <>
              <div className="calendar-header">
                <button className="calendar-nav-button" onClick={() => setCurrentMonth(prev => (prev + 11) % 12)} aria-label="Previous Month">
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year">{months[currentMonth]} {currentYear}</span>
                <button className="calendar-nav-button" onClick={() => setCurrentMonth(prev => (prev + 1) % 12)} aria-label="Next Month">
                  <FaChevronRight />
                </button>
              </div>
              <div className="calendar-body">
                {generateCalendarDays()}
              </div>
              <button className="calendar-back-button" onClick={() => setCurrentView('month')} aria-label="Back to Months">Back to Months</button>
            </>
          )}
          {currentView === 'month' && (
            <>
              <div className="calendar-header">
                <button className="calendar-nav-button" onClick={() => setCurrentView('year')} aria-label="Previous Decade">
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year">Select Month</span>
                <button className="calendar-nav-button" disabled aria-label="Next Decade">
                  <FaChevronRight />
                </button>
              </div>
              <div className="month-view">
                {generateMonthView()}
              </div>
            </>
          )}
          {currentView === 'year' && (
            <>
              <div className="calendar-header">
                <button className="calendar-nav-button" onClick={() => setCurrentYear(prev => prev - 10)} aria-label="Previous 10 Years">
                  <FaChevronLeft />
                </button>
                <span className="calendar-month-year">Select Year</span>
                <button className="calendar-nav-button" onClick={() => setCurrentYear(prev => prev + 10)} aria-label="Next 10 Years">
                  <FaChevronRight />
                </button>
              </div>
              <div className="year-view">
                {generateYearView()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
