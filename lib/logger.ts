/* eslint-disable no-console */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

function isServer(): boolean {
  return typeof window === 'undefined';
}

function getEnvLogLevel(): LogLevel {
  // Client 優先讀取 NEXT_PUBLIC_LOG_LEVEL，Server 可讀 LOG_LEVEL 或 NEXT_PUBLIC_LOG_LEVEL
  const envLevel = (isServer() ? process.env.LOG_LEVEL : process.env.NEXT_PUBLIC_LOG_LEVEL) || process.env.NEXT_PUBLIC_LOG_LEVEL;

  if (envLevel === 'debug' || envLevel === 'info' || envLevel === 'warn' || envLevel === 'error' || envLevel === 'silent') {
    return envLevel;
  }

  // 預設：開發環境 'debug'，生產 'warn'
  const isProd = process.env.NODE_ENV === 'production';

  return isProd ? 'warn' : 'debug';
}

function levelToPriority(level: LogLevel): number {
  switch (level) {
  case 'debug': return 10;
  case 'info': return 20;
  case 'warn': return 30;
  case 'error': return 40;
  case 'silent': return 100;
  default: return 30;
  }
}

const activeLevel = getEnvLogLevel();
const activePriority = levelToPriority(activeLevel);
const prefix = isServer() ? '[Server]' : '[Client]';

function shouldLog(level: LogLevel): boolean {
  return levelToPriority(level) >= activePriority && activeLevel !== 'silent';
}

function formatArgs(args: unknown[]): unknown[] {
  return [prefix, ...args];
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) console.debug(...formatArgs(args));
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.info(...formatArgs(args));
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn(...formatArgs(args));
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error(...formatArgs(args));
  },
};

export default logger;
