
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestResult {
  id: string;
  suite: string;
  name: string;
  status: TestStatus;
  error?: string;
  duration?: number;
}

export class TestRunner {
  private results: TestResult[] = [];
  private onUpdate?: (results: TestResult[]) => void;

  constructor(onUpdate: (results: TestResult[]) => void) {
    this.onUpdate = onUpdate;
  }

  async run(suite: string, name: string, fn: () => void | Promise<void>) {
    const id = `${suite}-${name}`;
    const start = performance.now();
    
    const result: TestResult = { id, suite, name, status: 'running' };
    this.updateResult(result);

    try {
      await fn();
      result.status = 'passed';
    } catch (e: any) {
      result.status = 'failed';
      result.error = e.message || String(e);
    } finally {
      result.duration = performance.now() - start;
      this.updateResult(result);
    }
  }

  private updateResult(res: TestResult) {
    const idx = this.results.findIndex(r => r.id === res.id);
    if (idx >= 0) this.results[idx] = res;
    else this.results.push(res);
    this.onUpdate?.([...this.results]);
  }

  expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
      },
      toBeGreaterThan: (expected: number) => {
        if (actual <= expected) throw new Error(`Expected ${actual} to be greater than ${expected}`);
      },
      toBeTruthy: () => {
        if (!actual) throw new Error(`Expected value to be truthy`);
      },
      toContain: (expected: string) => {
        if (!actual?.includes?.(expected)) throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    };
  }
}
