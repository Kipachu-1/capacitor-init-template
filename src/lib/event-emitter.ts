type EventHandler<T = any> = (data?: T) => void;

export class CustomEventEmitter {
  private events: Record<string, EventHandler[]> = {};

  on<T>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);

    return () => this.off(eventName, handler); // Return a cleanup function
  }

  off<T>(eventName: string, handler: EventHandler<T>): void {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter(
      (h) => h !== handler
    );
  }

  emit<T>(eventName: string, data?: T): void {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach((handler) => handler(data));
  }
}
