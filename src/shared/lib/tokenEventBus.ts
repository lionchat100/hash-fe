type TokenChangeListener = (newToken: string) => void;

class TokenEventBus {
  private listeners: TokenChangeListener[] = [];

  subscribe(listener: TokenChangeListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(newToken: string) {
    this.listeners.forEach((listener) => listener(newToken));
  }
}

export const tokenEventBus = new TokenEventBus();
