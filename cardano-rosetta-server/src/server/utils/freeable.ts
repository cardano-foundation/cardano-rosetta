export interface Freeable {
  free: () => void;
}

/**
 * A scope to ease the management of objects that require manual resource management.
 *
 */
export class ManagedFreeableScope {
  private scopeStack: Freeable[] = [];
  private disposed = false;

  /**
   * Objects passed to this method will then be managed by the instance.
   *
   * @param freeable An object with a free function, or undefined. This makes it suitable for wrapping functions that
   * may or may not return a value, to minimise the implementation logic.
   * @returns The freeable object passed in, which can be undefined.
   */
  public manage<T extends Freeable | undefined>(freeable: T): T {
    if (freeable === undefined) return freeable;
    if (this.disposed) throw new Error('This scope is already disposed.');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.scopeStack.push(freeable!);
    return freeable;
  }

  /**
   * Once the freeable objects being managed are no longer being accessed, call this method.
   */
  public dispose(): void {
    if (this.disposed) return;
    for (const resource of this.scopeStack) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((resource as any)?.ptr === 0 || !resource?.free) {
        continue;
      }
      try {
        resource?.free();
      } catch {
        console.error('Error freeing resource');
      }
    }
    this.disposed = true;
  }
}

class AutoFree<TReturn> {
  scope: ManagedFreeableScope;
  readonly callback: (scope: ManagedFreeableScope) => TReturn;

  constructor(callback: (scope: ManagedFreeableScope) => TReturn) {
    this.callback = callback;
    this.scope = new ManagedFreeableScope();
  }

  public execute() {
    try {
      return this.callback(this.scope);
    } finally {
      this.scope.dispose();
    }
  }
}

/**
 * A wrapper function to set up and dispose of a ManagedFreeableScope at the end of the callback execution.
 */
export const usingAutoFree = <TReturn>(callback: (scope: ManagedFreeableScope) => TReturn): TReturn =>
  new AutoFree<TReturn>(callback).execute();
