export const logger = {
  info: (message: string): void => {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
    }
  },
  error: (message: string, err?: Error): void => {
    const errorLine = err ? ` \n${err.message}` : '';
    process.stderr.write(`[ERROR] ${new Date().toISOString()} - ${message}${errorLine}\n`);
  },
};
