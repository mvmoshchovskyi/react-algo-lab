import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AssertionResult = {
  title: string;
  fullName?: string;
  status: string;
};

type JsonTestFile = {
  name: string;
  assertionResults?: AssertionResult[];
};

type JsonReport = {
  testResults?: JsonTestFile[];
  numTotalTests?: number;
  numPassedTests?: number;
  numFailedTests?: number;
};

export type ExerciseTestStats = {
  passed: number;
  failed: number;
  total: number;
  tests: { title: string; status: string }[];
};

type TestResultsContextValue = {
  report: JsonReport | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  getStats: (exerciseId: string) => ExerciseTestStats;
};

const TestResultsContext = createContext<TestResultsContextValue | null>(null);

const EMPTY_STATS: ExerciseTestStats = { passed: 0, failed: 0, total: 0, tests: [] };

export function TestResultsProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<JsonReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/test-results.json?t=${Date.now()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as JsonReport;
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setReport(null);
        setError("test-results.json ще немає. Запусти `npm run check`.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [version]);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const getStats = useCallback(
    (exerciseId: string): ExerciseTestStats => {
      const files = report?.testResults ?? [];
      const matching = files.filter(
        (file) =>
          file.name.includes(`/${exerciseId}/`) ||
          file.name.includes(`\\${exerciseId}\\`),
      );
      const tests = matching.flatMap((file) =>
        (file.assertionResults ?? []).map((assertion) => ({
          title: assertion.fullName || assertion.title,
          status: assertion.status,
        })),
      );
      if (tests.length === 0) return EMPTY_STATS;
      return {
        passed: tests.filter((test) => test.status === "passed").length,
        failed: tests.filter((test) => test.status === "failed").length,
        total: tests.length,
        tests,
      };
    },
    [report],
  );

  const value = useMemo(
    () => ({ report, loading, error, refresh, getStats }),
    [report, loading, error, refresh, getStats],
  );

  return (
    <TestResultsContext.Provider value={value}>{children}</TestResultsContext.Provider>
  );
}

export function useTestResults() {
  const context = useContext(TestResultsContext);
  if (!context) throw new Error("useTestResults must be used inside TestResultsProvider");
  return context;
}
