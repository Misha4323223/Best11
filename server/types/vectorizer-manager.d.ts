/**
 * Типы для vectorizer-manager.js
 */

export interface VectorizerStatus {
  status: 'running' | 'stopped' | 'error' | 'unavailable';
  available: boolean;
  port?: number;
  uptime?: number;
  lastCheck?: string;
}

export interface VectorizerHealth {
  status: string;
  available: boolean;
  port: number;
  endpoints?: {
    [key: string]: any;
  };
}

export declare class VectorizerManager {
  vectorizerProcess: any;
  isRunning: boolean;
  port: number;
  maxRestartAttempts: number;
  restartAttempts: number;

  constructor();
  
  /**
   * Запуск векторизатора как отдельного процесса
   */
  startVectorizer(): Promise<boolean>;
  
  /**
   * Остановка векторизатора
   */
  stopVectorizer(): Promise<void>;
  
  /**
   * Проверка состояния векторизатора
   */
  checkHealth(): Promise<VectorizerHealth>;
  
  /**
   * Получение статуса векторизатора
   */
  getStatus(): VectorizerStatus;
  
  /**
   * Перезапуск векторизатора при сбое
   */
  restartOnFailure(): Promise<boolean>;
  
  /**
   * Проверка доступности векторизатора по HTTP
   */
  isVectorizerAvailable(): Promise<boolean>;
}

declare const vectorizerManager: VectorizerManager;
export default vectorizerManager;