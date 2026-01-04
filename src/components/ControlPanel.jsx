import React from 'react'
import { Sun, Moon } from 'lucide-react'
import Calendar from './Calendar'

const ControlPanel = ({ data, availableDates, selectedDate, onDateSelect, dateScores }) => {
  // 格式化日期显示：2025.11.13
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Loading...'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  // 通用卡片样式
  const cardClass = "bg-white rounded-[32px] p-5 shadow-sm flex flex-col justify-center"

  return (
    <div className="h-full bg-gray-100 p-4 overflow-y-auto flex flex-col gap-4">
      
      {/* 1. Calendar Card (Yearly Overview) */}
      <div className={`${cardClass} min-h-[360px]`}>
        <Calendar 
          availableDates={availableDates} 
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          // 如果父组件没有传 dateScores，这里可以暂时传一个空对象或 mock 数据
          dateScores={dateScores}
        />
      </div>

      {/* Grid Container: Time 和 WeChat 模块并排 */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* 2. Time Card */}
        {data && (
          <div className={`${cardClass} relative overflow-hidden`}>
            <h2 className="text-lg font-bold text-gray-900 mb-1 z-10">Time</h2>
            <p className="text-2xl font-bold text-cyan-400 tracking-wide z-10 break-words">
              {formatDisplayDate(data.date)}
            </p>
            {/* 装饰性图标，放在右下角或背景 */}
            <div className="absolute -right-2 -bottom-2 opacity-20 transform scale-125 pointer-events-none">
               {data.time === 'sun' ? (
                <Sun className="w-20 h-20 text-yellow-400 fill-yellow-200" strokeWidth={1.5} />
              ) : (
                <Moon className="w-20 h-20 text-blue-400 fill-blue-200" strokeWidth={1.5} />
              )}
            </div>
             {/* 原来的图标逻辑保留在显眼位置 */}
             <div className="mt-2 self-end z-10">
                {data.time === 'sun' ? (
                <Sun className="w-10 h-10 text-yellow-400 fill-yellow-200" strokeWidth={1.5} />
              ) : (
                <Moon className="w-10 h-10 text-blue-400 fill-blue-200" strokeWidth={1.5} />
              )}
             </div>
          </div>
        )}

        {/* 3. WeChat Status Card (无图标纯文字版) */}
        {data && (
          <div className={`${cardClass} items-start`}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">WeChat status</h2>
            <div className="flex-1 flex items-center">
              <span className="text-2xl font-black text-gray-800 break-all leading-tight">
                {data.status || 'Offline'}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* 4. Mood Score Card */}
      {data && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mood score</h2>
            <span className="text-2xl font-bold text-gray-500">
              {data.secondary}/10
            </span>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-1 h-6">
            {Array.from({ length: 10 }, (_, i) => {
              // 这里的颜色也可以跟上面的逻辑统一：
              // 低分蓝，中分绿，高分红
              let barColor = 'bg-cyan-400' // 默认
              if (data.secondary >= 7) barColor = 'bg-red-400'
              else if (data.secondary >= 4) barColor = 'bg-emerald-400'
              else barColor = 'bg-blue-400'

              const isFilled = i < data.secondary
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors duration-300 ${
                    isFilled ? barColor : 'bg-gray-200'
                  }`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
