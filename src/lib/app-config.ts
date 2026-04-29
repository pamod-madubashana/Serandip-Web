const rawAppName = import.meta.env.VITE_APP_NAME?.trim();

export const APP_NAME = rawAppName || "Serandip Prime";
export const APP_OWNER_LABEL = `${APP_NAME} owner`;
