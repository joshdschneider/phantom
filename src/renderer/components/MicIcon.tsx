import { CSSProperties } from 'react';

export const MicIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => {
  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M7.95221 5.6123V6.9982C7.95188 7.95444 7.56445 8.81777 6.9361 9.4471C6.30671 10.0755 5.44371 10.4629 4.48748 10.4629C3.53124 10.4629 2.66788 10.0755 2.03852 9.4471C1.41017 8.81777 1.02277 7.95441 1.02243 6.9982V5.6123H0V6.9982C0.000978486 9.301 1.74101 11.1992 3.97629 11.4541V13.4051H2.66995V14.314H6.30508V13.4051H4.99875V11.4541C7.23367 11.1991 8.97369 9.301 8.9747 6.9982V5.6123H7.95221Z"
        fill="currentColor"
      />
      <path
        d="M4.48743 9.33845C5.77777 9.33845 6.82752 8.28836 6.82752 6.99802V2.34043C6.82752 1.05008 5.77777 0 4.48743 0C3.19706 0 2.14697 1.05008 2.14697 2.34043V6.99799C2.14697 8.28836 3.19706 9.33845 4.48743 9.33845ZM3.16943 2.34043C3.16943 1.61355 3.76055 1.02243 4.48743 1.02243C5.21397 1.02243 5.80508 1.61355 5.80508 2.34043V6.99799C5.80508 7.72487 5.21397 8.31599 4.48743 8.31599C3.76052 8.31599 3.16943 7.72487 3.16943 6.99799V2.34043Z"
        fill="currentColor"
      />
    </svg>
  );
};
