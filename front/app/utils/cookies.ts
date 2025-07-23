interface CookieStore {
  get(name: string): Promise<{ name: string; value: string } | undefined>;
  set(name: string, value: string, options?: { path?: string }): Promise<void>;
  delete(name: string): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
}
declare const cookieStore: CookieStore;

export default typeof cookieStore !== "undefined"
  ? cookieStore
  : {
      get: async (name: string) => {},
      set: async (
        name: string,
        value: string,
        options?: { path?: string }
      ) => {},
      delete: async (name: string) => {},
      addEventListener: (type: string, listener: (event: any) => void) => {},
    };
