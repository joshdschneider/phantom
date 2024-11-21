import { useEffect, useRef } from 'react';

const MIRROR_PROPERTIES = [
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing'
];

export interface CaretCoordinates {
  top: number;
  left: number;
}

export const useCaretPosition = (textAreaRef: React.RefObject<HTMLTextAreaElement>) => {
  const mirrorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mirrorRef.current) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      mirrorRef.current = div;
    }

    return () => {
      mirrorRef.current?.remove();
    };
  }, []);

  const getCaretPosition = (position: number): CaretCoordinates | null => {
    if (!textAreaRef.current || !mirrorRef.current) {
      return null;
    }

    const element = textAreaRef.current;
    const mirror = mirrorRef.current;
    const computed = window.getComputedStyle(element);

    mirror.style.position = 'absolute';
    mirror.style.top = `${element.offsetTop}px`;
    mirror.style.left = '0';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';

    MIRROR_PROPERTIES.forEach((prop: any) => {
      mirror.style[prop] = computed[prop];
    });

    mirror.style.overflow = 'hidden';
    mirror.textContent = element.value.substring(0, position);
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    mirror.appendChild(span);

    const coordinates: CaretCoordinates = {
      top: span.offsetTop,
      left: span.offsetLeft
    };

    mirror.removeChild(span);
    return coordinates;
  };

  return getCaretPosition;
};
