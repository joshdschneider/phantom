import { useEffect, useState } from 'react';

interface TextStreamerProps {
  text: string;
  speed?: number;
  ellipsis?: boolean;
}

export const TextStreamer: React.FC<TextStreamerProps> = ({ text, speed = 30, ellipsis = false }) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedWords([]);
    setCurrentIndex(0);
    setIsStreaming(true);
    setAnimationStep(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsStreaming(false);
    }
  }, [currentIndex, words, speed]);

  useEffect(() => {
    if (!isStreaming && ellipsis) {
      const timer = setTimeout(() => {
        setAnimationStep((prev) => (prev + 1) % 6);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [animationStep, isStreaming, ellipsis]);

  const ellipsisCount = Math.max(0, Math.min(3, animationStep <= 3 ? animationStep : 6 - animationStep));

  return (
    <span>
      {displayedWords.join(' ')}
      {!isStreaming && ellipsis && '.'.repeat(ellipsisCount)}
    </span>
  );
};
