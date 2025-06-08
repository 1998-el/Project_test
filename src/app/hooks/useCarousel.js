import { useState } from 'react';

export const useCarousel = (items) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const next = () => setCurrentIndex(prev => (prev + 1) % items.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) next();
    if (touchStart - touchEnd < -50) prev();
  };

  const goToIndex = (index) => setCurrentIndex(index);

  const getVisibleIndices = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    const nextIndex = (currentIndex + 1) % items.length;
    return [prevIndex, currentIndex, nextIndex];
  };

  return {
    currentIndex,
    next,
    prev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToIndex,
    getVisibleIndices
  };
};
