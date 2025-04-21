import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoContext } from '../context/TodoContext';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaCalendarDay, 
  FaCalendarWeek
} from 'react-icons/fa';

const CalendarView = () => {
  const { todos } = useTodoContext();
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate days for the month view
  const getDaysInMonth = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push({ 
        date: prevMonthDay, 
        isCurrentMonth: false 
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({ 
        date: day, 
        isCurrentMonth: true,
        isToday: isToday(day)
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 weeks x 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ 
        date: nextMonthDay, 
        isCurrentMonth: false 
      });
    }
    
    return days;
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Format date for display
  const formatMonth = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const formatWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
      return `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('default', { month: 'short' })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
    } else {
      return `${startOfWeek.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' })} - ${endOfWeek.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
  };
  
  const formatDay = () => {
    return currentDate.toLocaleString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Render day cells for month view
  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="month-day-names">
        {dayNames.map(day => (
          <div key={day} className="month-day-name">{day}</div>
        ))}
      </div>
    );
  };
  
  // Generate hours for day/week view
  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i}:00`);
    }
    return hours;
  };
  
  // Render the week view
  const renderWeekView = () => {
    const hours = generateHours();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return (
      <div className="week-view">
        <div className="week-header">
          <div></div>
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`week-header-day ${isToday(day) ? 'today' : ''}`}
            >
              {day.toLocaleString('default', { weekday: 'short' })}<br />
              {day.getDate()}
            </div>
          ))}
        </div>
        
        <div className="week-grid">
          {hours.map((hour, hourIndex) => (
            <React.Fragment key={hourIndex}>
              <div className="week-time">{hour}</div>
              {days.map((day, dayIndex) => {
                const tasksForHour = todos.filter(todo => {
                  if (!todo.dueDate) return false;
                  const todoDate = new Date(todo.dueDate);
                  return todoDate.getDate() === day.getDate() &&
                    todoDate.getMonth() === day.getMonth() &&
                    todoDate.getFullYear() === day.getFullYear() &&
                    todoDate.getHours() === parseInt(hour);
                });
                
                return (
                  <div key={dayIndex} className="week-cell">
                    {tasksForHour.map((task, taskIndex) => (
                      <div 
                        key={taskIndex}
                        className={`week-event event-${task.priority}`}
                        style={{
                          top: '2px',
                          left: '2px',
                          right: '2px',
                          height: 'calc(100% - 4px)'
                        }}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the day view
  const renderDayView = () => {
    const hours = generateHours();
    
    return (
      <div className="day-view">
        <div className="day-header">
          {currentDate.toLocaleString('default', { weekday: 'long' })}, {currentDate.getDate()}
        </div>
        
        <div className="day-timeline">
          {hours.map((hour, hourIndex) => {
            const tasksForHour = todos.filter(todo => {
              if (!todo.dueDate) return false;
              const todoDate = new Date(todo.dueDate);
              return todoDate.getDate() === currentDate.getDate() &&
                todoDate.getMonth() === currentDate.getMonth() &&
                todoDate.getFullYear() === currentDate.getFullYear() &&
                todoDate.getHours() === parseInt(hour);
            });
            
            return (
              <React.Fragment key={hourIndex}>
                <div className="day-time">{hour}</div>
                <div className="day-slot">
                  {tasksForHour.map((task, taskIndex) => (
                    <div 
                      key={taskIndex}
                      className={`day-event event-${task.priority}`}
                      style={{
                        top: '2px',
                        height: 'calc(100% - 4px)'
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render the month view
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    return (
      <>
        {renderDayNames()}
        <div className="month-grid">
          {days.map((day, index) => {
            const tasksForDay = getTasksForDate(day.date);
            
            return (
              <motion.div 
                key={index}
                className={`month-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="month-day-number">{day.date.getDate()}</div>
                <div className="month-day-events">
                  {tasksForDay.slice(0, 3).map((task, taskIndex) => (
                    <div 
                      key={taskIndex}
                      className={`month-day-event event-${task.priority}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDay.length > 3 && (
                    <div className="month-day-more">
                      +{tasksForDay.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </>
    );
  };
  
  return (
    <motion.div 
      className="calendar-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="calendar-header">
        <h2 className="calendar-title">
          {view === 'month' && formatMonth()}
          {view === 'week' && formatWeek()}
          {view === 'day' && formatDay()}
        </h2>
        <div className="calendar-nav">
          <motion.button 
            onClick={navigatePrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChevronLeft />
          </motion.button>
          <motion.button 
            onClick={goToToday}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
          <motion.button 
            onClick={navigateNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </div>
      
      <div className="view-selector">
        <motion.button 
          className={view === 'month' ? 'active' : ''}
          onClick={() => setView('month')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarAlt style={{ marginRight: '5px' }} /> Month
        </motion.button>
        <motion.button 
          className={view === 'week' ? 'active' : ''}
          onClick={() => setView('week')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarWeek style={{ marginRight: '5px' }} /> Week
        </motion.button>
        <motion.button 
          className={view === 'day' ? 'active' : ''}
          onClick={() => setView('day')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarDay style={{ marginRight: '5px' }} /> Day
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarView; 