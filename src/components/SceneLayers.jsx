import React, { useState, useEffect } from 'react';
import MusicWidget from './MusicWidget';

const SceneLayers = ({ data }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (data) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
        <p className="text-lg">请选择一个日期</p>
      </div>
    );
  }

  const getImagePath = (layer, value) => {
    return `/images/${layer}/${value}.png`;
  };

  const opacityClass = isTransitioning ? 'opacity-0' : 'opacity-100';
  const transitionClass = 'transition-opacity duration-500';

  // 设计稿尺寸（仅用于 aspect-ratio）
  const backgroundWidth = 1280;
  const backgroundHeight = 1080;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      {/* 保持 1280:1080 比例的响应式容器 */}
      <div
        className="relative w-full h-full"
        style={{
          aspectRatio: `${backgroundWidth} / ${backgroundHeight}`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {/* 内容容器：铺满比例容器，无需缩放 */}
        <div className="absolute inset-0 w-full h-full">
          
          {/* Layer 1 (Z-1): City Background */}
          <div className={`absolute inset-0 z-[1] ${opacityClass} ${transitionClass}`}>
            <img
              src={getImagePath('city', data.city)}
              alt={`City: ${data.city}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('City image failed to load:', getImagePath('city', data.city));
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-b from-sky-300 to-sky-600 items-center justify-center absolute top-0 left-0">
              <div className="text-white text-2xl font-semibold">{data.city}</div>
            </div>
          </div>

          {/* Layer 2 (Z-2): Location */}
          <div
            className={`absolute z-[2] overflow-hidden ${opacityClass} ${transitionClass}`}
            style={{
              right: '0',
              bottom: '0',
              width: '500px',
              height: '500px',
              borderRadius: '20px',
            }}
          >
            <img
              src={getImagePath('location', data.location)}
              alt={`Location: ${data.location}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Layer 3 (Z-3): Body */}
          <div
            className={`absolute z-[3] ${opacityClass} ${transitionClass}`}
            style={{
              right: '0',
              bottom: '0',
              width: '500px',
              height: '500px',
            }}
          >
            <img
              src={getImagePath('body', data.status.toLowerCase())}
              alt={`Status: ${data.status}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <div className="text-8xl">
                {data.status === 'Music' ? '🎵' : '📚'}
              </div>
            </div>
          </div>

          {/* Music Widget */}
          <MusicWidget musicSrc={data.music_src} isVisible={data.status === 'Music'} />
        </div>
      </div>
    </div>
  );
};

export default SceneLayers;