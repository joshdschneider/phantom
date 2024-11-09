import {
  BrowserWindow,
  IpcMainInvokeEvent,
  Menu,
  MenuItemConstructorOptions,
} from 'electron';

export function handleShowContextMenu(event: IpcMainInvokeEvent) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Settings',
    },
    {
      label: 'Close',
      click(menuItem, window, event) {
        window?.close();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({
    window: BrowserWindow.fromWebContents(event.sender) || undefined,
  });
}
