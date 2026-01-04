import React, { useState, useEffect } from 'react'
import SceneLayers from './components/SceneLayers'
import ControlPanel from './components/ControlPanel'
import data from '../data.json'

function App() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [currentData, setCurrentData] = useState(null)

  useEffect(() => {
    // 提取所有日期并排序
    const dates = data.map(item => item.date).sort()
    setAvailableDates(dates)
    
    // 默认选择第一个日期
    if (dates.length > 0) {
      setSelectedDate(dates[0])
      const firstData = data.find(item => item.date === dates[0])
      setCurrentData(firstData)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const foundData = data.find(item => item.date === selectedDate)
      setCurrentData(foundData || null)
    }
  }, [selectedDate])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* 响应式分屏布局 */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* 区域 A：视觉合成区 (The Stage) - 左侧 60-65% / 移动端顶部 */}
        <div className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-full lg:w-[65%] p-2 sm:p-4 lg:p-6">
          <div className="h-full w-full rounded-lg overflow-hidden shadow-xl lg:shadow-2xl">
            <SceneLayers data={currentData} />
          </div>
        </div>

        {/* 区域 B：数据控制面板 (Control Panel) - 右侧 35-40% / 移动端底部 */}
        <div className="h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-full lg:w-[35%] p-2 sm:p-4 lg:p-6 overflow-y-auto">
          <ControlPanel
            data={currentData}
            availableDates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default App
