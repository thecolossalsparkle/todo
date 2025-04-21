import React, { useEffect, useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import TodoForm from '../components/TodoForm';
import Task from '../components/Task';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import FloatingActionButton from '../components/FloatingActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaSortAmountDown, FaCalendarDay } from 'react-icons/fa';
import '../styles/App.css';

const TodoPage = () => {
  const { todos, loading, error, success, getTodos, updateTodo, deleteTodo, resetStatus } = useTodoContext();
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    priority: 'all',
    search: '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Fetch todos only once when component mounts
    const fetchData = async () => {
      await getTodos();
      setIsInitialLoad(false);
    };
    
    if (isInitialLoad) {
      fetchData();
    }
  }, [getTodos, isInitialLoad]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        resetStatus();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error, resetStatus]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id, newStatus) => {
    updateTodo(id, { status: newStatus });
  };

  const handleEdit = (task) => {
    setTodoToEdit(task);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTodo(id);
    }
  };

  const handleAddClick = () => {
    setTodoToEdit(null);
    setShowForm(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear();
    });
  };

  const filteredTodos = getTasksForDate(selectedDate).filter(todo => {
    // Filter by priority
    if (filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Generate days for the calendar view
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
        isCurrentMonth: false,
        isSelected: isSameDay(prevMonthDay, selectedDate)
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({ 
        date: day, 
        isCurrentMonth: true,
        isToday: isToday(day),
        isSelected: isSameDay(day, selectedDate)
      });
    }
    
    // Add days from next month (to fill a 6x7 grid)
    const remainingDays = 42 - days.length; // 6 weeks x 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ 
        date: nextMonthDay, 
        isCurrentMonth: false,
        isSelected: isSameDay(nextMonthDay, selectedDate)
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
  
  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };
  
  // Format month for display
  const formatMonth = () => {
    return selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Navigation functions
  const navigatePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  
  const navigateNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
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

  // Get current month's days
  const days = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="todo-page"
      layout
    >
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        My Tasks
      </motion.h1>
      
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message="Task updated successfully!" />}
      
      {showForm && (
        <TodoForm 
          todoToEdit={todoToEdit} 
          setTodoToEdit={setTodoToEdit} 
          onClose={() => setShowForm(false)} 
        />
      )}
      
      <div className="calendar-task-container">
        {/* Calendar sidebar */}
        <div className="calendar-sidebar">
          <div className="calendar-container">
            <div className="calendar-header">
              <h2 className="calendar-title">{formatMonth()}</h2>
              <div className="calendar-nav">
                <button 
                  className="calendar-nav-btn" 
                  onClick={navigatePrevMonth}
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <button 
                  className="calendar-today-btn"
                  onClick={goToToday}
                  aria-label="Go to today"
                >
                  Today
                </button>
                <button 
                  className="calendar-nav-btn" 
                  onClick={navigateNextMonth}
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>

            {renderDayNames()}
            
            <div className="mini-month-grid">
              {days.map((day, index) => {
                const tasksForDay = getTasksForDate(day.date);
                const hasHighPriority = tasksForDay.some(task => task.priority === 'High');
                const hasMediumPriority = tasksForDay.some(task => task.priority === 'Medium');
                const hasTask = tasksForDay.length > 0;
                
                const dayClasses = `mini-month-day 
                  ${!day.isCurrentMonth ? 'not-current-month' : ''} 
                  ${day.isToday ? 'today' : ''} 
                  ${day.isSelected ? 'selected' : ''}
                  ${hasHighPriority ? 'has-high-priority' : ''}
                  ${hasMediumPriority && !hasHighPriority ? 'has-medium-priority' : ''}
                  ${hasTask && !hasHighPriority && !hasMediumPriority ? 'has-task' : ''}`;
                
                return (
                  <div 
                    key={index} 
                    className={dayClasses}
                    onClick={() => handleDateClick(day.date)}
                  >
                    {day.date.getDate()}
                    {hasTask && <span className="task-indicator"></span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Tasks for selected day */}
        <div className="tasks-for-day">
          <div className="selected-day-header">
            <h2>
              <FaCalendarDay className="calendar-icon" />
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h2>
            
            <motion.div 
              className="todo-filters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <FaSortAmountDown style={{ marginRight: '8px', color: 'var(--primary-color)' }} /> 
                  Filter by Priority
                </label>
                <motion.select 
                  className="form-control"
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <option value="all">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </motion.select>
              </div>
              
              <div style={{ flex: 2, minWidth: '300px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <FaSearch style={{ marginRight: '8px', color: 'var(--primary-color)' }} /> 
                  Search Tasks
                </label>
                <motion.input 
                  type="text"
                  className="form-control"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by title..."
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <motion.div 
              className="tasks-container"
              layout
            >
              <AnimatePresence mode="wait">
                {filteredTodos.length === 0 ? (
                  <motion.div 
                    className="empty-state"
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3>No tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                    <p>Add a new task or select a different date</p>
                  </motion.div>
                ) : (
                  filteredTodos.map(task => (
                    <Task
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      
      <FloatingActionButton onClick={handleAddClick} />
    </motion.div>
  );
};

export default TodoPage; 