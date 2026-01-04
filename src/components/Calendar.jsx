import React, { useState, useMemo } from 'react'

const Calendar = ({ availableDates, selectedDate, onDateSelect, dateScores }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate).getMonth()
    if (availableDates && availableDates.length > 0) return new Date(availableDates[0]).getMonth()
    return 0
  })

  const [currentYear, setCurrentYear] = useState(() => {
    if (selectedDate) return new Date(selectedDate).getFullYear()
    if (availableDates && availableDates.length > 0) return new Date(availableDates[0]).getFullYear()
    return 2025
  })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const availableDatesSet = useMemo(() => new Set(availableDates || []), [availableDates])

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const formatDate = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }

  const handleDayClick = (day) => {
    const dateStr = formatDate(currentYear, currentMonth, day)
    if (availableDatesSet.has(dateStr)) {
      onDateSelect(dateStr)
    }
  }

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset
    let newYear = currentYear
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    else if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  // 根据分数获取颜色样式的核心逻辑
  const getScoreColorClass = (score) => {
    if (score === undefined || score === null) return "bg-gray-100 text-gray-400" // 无分数的默认样式
    
    // 0-3: 蓝色
    if (score <= 3) return "bg-blue-100 text-blue-600 hover:bg-blue-200"
    // 4-6: 绿色
    if (score <= 6) return "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
    // 7-10: 红色
    return "bg-rose-100 text-rose-600 hover:bg-rose-200"
  }

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // 空白占位符
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // 渲染日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentYear, currentMonth, day)
      const isAvailable = availableDatesSet.has(dateStr)
      const isSelected = dateStr === selectedDate
      
      // 获取该日期的分数（如果 dateScores 存在）
      // 注意：这里假设 dateScores 是一个对象 { '2025-11-13': 8 }
      const score = dateScores ? dateScores[dateStr] : null
      
      let bgClass = "bg-transparent text-gray-300" // 默认不可用样式
      
      if (isAvailable) {
         if (isSelected) {
             // 选中状态：深色圆圈，白色文字，优先级最高
             // 可以根据分数微调选中态背景色，或者统一使用黑色
             bgClass = "bg-stone-800 text-white shadow-lg scale-110 z-10"
         } else {
             // 未选中但可用：使用分数颜色逻辑
             // 如果没有分数数据，默认回退到原来的逻辑或者给一个默认色
             if (score !== null) {
                bgClass = getScoreColorClass(score)
             } else {
                // 如果没有提供分数，保留一个默认的高亮色（比如原来的随机色或统一色）
                bgClass = "bg-gray-100 text-gray-600 hover:bg-gray-200"
             }
         }
      }

      days.push(
        <button
          key={day}
          disabled={!isAvailable}
          onClick={() => handleDayClick(day)}
          className={`
            aspect-square rounded-full flex items-center justify-center 
            transition-all duration-300
            ${isSelected ? 'text-xl font-black' : 'text-lg font-bold'} 
            ${bgClass}
          `}
        >
          {day}
        </button>
      )
    }
    return days
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 px-1">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Yearly Overview</h2>
           <p className="text-sm text-gray-400 font-medium mt-1">
             {months[currentMonth]} {currentYear}
           </p>
        </div>
        
        <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">←</button>
            <button onClick={() => changeMonth(1)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 gap-x-1">
        {renderDays()}
      </div>
    </div>
  )
}

export default Calendar