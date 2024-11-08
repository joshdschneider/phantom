import { mouse, Point, keyboard } from '@nut-tree-fork/nut-js';
import { keyMap } from '../util';
import { Button } from '@nut-tree-fork/nut-js';
import { Key } from '@nut-tree-fork/nut-js';

export async function mouseMoveHandler(
  _: Electron.IpcMainInvokeEvent,
  args: { x: number; y: number },
) {
  await mouse.move([new Point(args.x, args.y)]);
}

export async function mouseLeftClickHandler() {
  await mouse.leftClick();
}

export async function mouseRightClickHandler() {
  await keyboard.pressKey(Key.LeftControl);
  await mouse.leftClick();
  await keyboard.releaseKey(Key.LeftControl);
}

export async function keyboardTypeHandler(
  _: Electron.IpcMainInvokeEvent,
  args: { text: string },
) {
  await keyboard.type(args.text);
}

export async function keyboardPressKeyHandler(
  _: Electron.IpcMainInvokeEvent,
  args: { key: string },
) {
  const keys = args.key.split('+').map((key: string) => {
    const knownKey = keyMap[key as keyof typeof keyMap];
    if (!knownKey) {
      throw new Error(`Unknown key: ${key}`);
    } else {
      return knownKey;
    }
  });

  await keyboard.pressKey(...keys);
}
