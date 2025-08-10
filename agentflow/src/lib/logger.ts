const DEBUG_ENABLED = process.env.NODE_ENV !== 'production' || ['1','true','yes','on'].includes((process.env.NEXT_PUBLIC_DEBUG || process.env.DEBUG || '').toLowerCase());

const logger = {
  debug: (...args: unknown[]) => {
    if (DEBUG_ENABLED) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};

export default logger;
