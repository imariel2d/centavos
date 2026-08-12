// Links de descarga de la app (iOS / Android). Estáticos.
export const APP_STORE_URL = "https://apps.apple.com/mx/app/centavos/id6781459932";
export const APP_PLAY_URL = "https://play.google.com/store/apps/details?id=mx.centavos.cuaderno";

export function getAppLinks(): { storeUrl: string; playUrl: string } {
  return { storeUrl: APP_STORE_URL, playUrl: APP_PLAY_URL };
}
