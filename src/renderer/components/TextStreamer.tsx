import { useEffect, useState } from 'react';

export const TextStreamer = ({ text = '', speed = 30 }) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedWords([]);
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, words, speed]);

  return <span>{displayedWords.join(' ')}</span>;
};
