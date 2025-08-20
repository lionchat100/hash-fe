import { clearUserData } from '@/entities/user';
import axios, { AxiosInstance } from 'axios';

type RefreshResult = { accessToken: string };
type Listener = (token: string) => void;

class RefreshManager {
  private refreshing = false;
  private waiters: ((v: RefreshResult) => void)[] = [];
  private failers: ((e: any) => void)[] = [];
  private listeners: Listener[] = [];
  private raw: AxiosInstance;

  constructor() {
    this.raw = axios.create({ withCredentials: true });
  }

  onToken(listener: Listener) {
    this.listeners.push(listener);
    return () => (this.listeners = this.listeners.filter((l) => l !== listener));
  }

  private notify(token: string) {
    this.listeners.forEach((l) => l(token));
    if (typeof window !== 'undefined') {
      try {
        const bc = new BroadcastChannel('auth');
        bc.postMessage(token);
        bc.close();
      } catch {}
    }
  }

  async refresh(): Promise<RefreshResult> {
    if (this.refreshing) {
      return new Promise<RefreshResult>((resolve, reject) => {
        this.waiters.push(resolve);
        this.failers.push(reject);
      });
    }

    this.refreshing = true;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;
      const response = await this.raw.post(url, {});
      const accessToken = response.data.accessToken as string;
      console.log('REFRESH MANAGER: 토큰 재발급 성공', accessToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
      }
      this.notify(accessToken);

      this.waiters.forEach((w) => w({ accessToken }));
      return { accessToken };
    } catch (error) {
      this.failers.forEach((f) => f(error));
      // 글로벌 로그아웃 처리
      if (typeof window !== 'undefined') {
        clearUserData();
        location.href = '/';
      }
      throw error;
    } finally {
      this.refreshing = false;
      this.waiters = [];
      this.failers = [];
    }
  }
}

export const refreshManager = new RefreshManager();
