export class Logger {
  private location: string;
  private prefix: string;

  constructor(location: string) {
    this.location = location;
    this.prefix = `CRXJS [${this.location}]`;
  }

  log(...args: unknown[]) {
    this.execute("log", ...args);
  }

  error(...args: unknown[]) {
    this.execute("error", ...args);
  }

  execute(action: keyof Console, ...args: unknown[]) {
    (console[action] as (...args: unknown[]) => void)(this.prefix, ...args);
  }
}
