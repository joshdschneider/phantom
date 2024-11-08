/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { Key } from '@nut-tree-fork/nut-js';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const keyMap = {
  // Special keys
  Return: Key.Return,
  Tab: Key.Tab,
  BackSpace: Key.Backspace,
  space: Key.Space,
  ctrl: Key.LeftControl,
  alt: Key.LeftAlt,

  // Function keys
  F1: Key.F1,
  F2: Key.F2,
  F3: Key.F3,
  F4: Key.F4,
  F5: Key.F5,
  F6: Key.F6,
  F7: Key.F7,
  F8: Key.F8,
  F9: Key.F9,
  F10: Key.F10,
  F11: Key.F11,
  F12: Key.F12,

  // Letters (lowercase)
  a: Key.A,
  b: Key.B,
  c: Key.C,
  d: Key.D,
  e: Key.E,
  f: Key.F,
  g: Key.G,
  h: Key.H,
  i: Key.I,
  j: Key.J,
  k: Key.K,
  l: Key.L,
  m: Key.M,
  n: Key.N,
  o: Key.O,
  p: Key.P,
  q: Key.Q,
  r: Key.R,
  s: Key.S,
  t: Key.T,
  u: Key.U,
  v: Key.V,
  w: Key.W,
  x: Key.X,
  y: Key.Y,
  z: Key.Z,

  // Numbers
  0: Key.Num0,
  1: Key.Num1,
  2: Key.Num2,
  3: Key.Num3,
  4: Key.Num4,
  5: Key.Num5,
  6: Key.Num6,
  7: Key.Num7,
  8: Key.Num8,
  9: Key.Num9,

  // Symbols
  minus: Key.Minus,
  equal: Key.Equal,
  bracketleft: Key.LeftBracket,
  bracketright: Key.RightBracket,
  backslash: Key.Backslash,
  semicolon: Key.Semicolon,
  comma: Key.Comma,
  period: Key.Period,
  slash: Key.Slash,

  // Navigation
  Up: Key.Up,
  Down: Key.Down,
  Left: Key.Left,
  Right: Key.Right,
  Home: Key.Home,
  End: Key.End,
  Page_Up: Key.PageUp,
  Page_Down: Key.PageDown,
  Insert: Key.Insert,
  Delete: Key.Delete,

  // Modifiers
  Shift_L: Key.LeftShift,
  Shift_R: Key.RightShift,
  Control_L: Key.LeftControl,
  Control_R: Key.RightControl,
  Alt_L: Key.LeftAlt,
  Alt_R: Key.RightAlt,
  Super_L: Key.LeftSuper,
  Super_R: Key.RightSuper,

  // Additional special keys
  Caps_Lock: Key.CapsLock,
  Num_Lock: Key.NumLock,
  Scroll_Lock: Key.ScrollLock,
  Print: Key.Print,
  Pause: Key.Pause,
  Menu: Key.Menu,
};
