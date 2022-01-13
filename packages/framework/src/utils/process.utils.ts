const onTermination = (callback: () => void): void => {
  for (const terminationSignal of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) {
    process.on(terminationSignal, callback);
  }
};

const onUncaughtException = (callback: (error: Error) => void): void => {
  process.on('uncaughtException', callback);
};

const onUnhandledRejection = (callback: (error: Error) => void): void => {
  process.on('unhandledRejection', callback);
};

export const processUtils = {
  onTermination,
  onUncaughtException,
  onUnhandledRejection,
};
