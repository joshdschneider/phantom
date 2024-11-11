import { desktopCapturer } from 'electron';

export async function getSourcesHandler() {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: { width: 150, height: 150 }
  });

  return sources;
}
