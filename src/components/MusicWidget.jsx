import React, { useState, useRef, useEffect } from 'react'
import { Music, Music2, Pause, Play } from 'lucide-react'

const MusicWidget = ({ musicSrc, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isVisible && audioRef.current) {
      // 自动播放（可能被浏览器阻止）
      audioRef.current.play().catch(err => {
        console.log('自动播放被阻止:', err)
      })
      setIsPlaying(true)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isVisible])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!isVisible || !musicSrc) return null

  return (
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      
      <button
        onClick={togglePlay}
        className="group relative flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {/* 跳动的音符动画 */}
        <div className="flex items-center gap-1">
          <Music2 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-purple-600 ${isPlaying ? 'animate-bounce' : ''}`}
            style={{ animationDelay: '0ms', animationDuration: '1s' }}
          />
          <Music 
            className={`w-3 h-3 sm:w-4 sm:h-4 text-purple-500 ${isPlaying ? 'animate-bounce' : ''}`}
            style={{ animationDelay: '150ms', animationDuration: '1s' }}
          />
        </div>
        
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        )}
      </button>
    </div>
  )
}

export default MusicWidget

