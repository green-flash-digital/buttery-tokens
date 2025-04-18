export class AsyncStateQueue<T> implements AsyncIterable<T> {
  private _queue: T[] = [];
  private _resolvers: ((value: IteratorResult<T>) => void)[] = [];
  private _listeners = new Set<() => void>();
  private _closed = false;
  protected _latest: T;

  constructor(baseState: T) {
    this._latest = baseState;
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  setLatest(state: T) {
    this._latest = state;
  }

  enqueue(item: T) {
    this._latest = item;

    // For async consumers
    if (this._resolvers.length > 0) {
      const resolve = this._resolvers.shift()!;
      resolve({ value: item, done: false });
    } else {
      this._queue.push(item);
    }

    // Notify React-style subscribers
    this._listeners.forEach((fn) => fn());
  }

  close() {
    this._closed = true;
    while (this._resolvers.length > 0) {
      this._resolvers.shift()!({ value: undefined as unknown, done: true });
    }
    this._listeners.clear();
  }

  getSnapshot(): T {
    return this._latest;
  }

  subscribe(callback: () => void): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this;
  }

  async next(): Promise<IteratorResult<T>> {
    if (this._queue.length > 0) {
      return { value: this._queue.shift()!, done: false };
    }
    if (this._closed) {
      return { value: undefined as unknown, done: true };
    }
    return new Promise((resolve) => this._resolvers.push(resolve));
  }
}
