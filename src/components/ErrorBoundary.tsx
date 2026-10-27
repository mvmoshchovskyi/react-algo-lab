import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Exercise crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="state-box state-error">
          <h3>Задача впала з помилкою</h3>
          <pre>{this.state.error.message}</pre>
          <p className="muted">
            Подивись console і стек у React DevTools. Решта застосунку працює.
          </p>
          <button
            type="button"
            className="button"
            onClick={() => this.setState({ error: null })}
          >
            Спробувати знову
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
