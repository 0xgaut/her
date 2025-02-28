import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#dc3545',
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

// Wrapper component to use theme
export const ErrorBoundary: React.FC<Props> = (props) => {
  const { theme } = useAppTheme();
  
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...styles.title,
      color: theme.colors.error,
    },
    message: {
      ...styles.message,
      color: theme.colors.text.secondary,
    },
    button: {
      ...styles.button,
      backgroundColor: theme.colors.primary,
    },
  };
  
  return (
    <ErrorBoundaryClass 
      {...props} 
      fallback={
        props.fallback || (
          <View style={themedStyles.container}>
            <Text style={themedStyles.title}>Something went wrong</Text>
            <Text style={themedStyles.message}>An error occurred in the chat component</Text>
            <TouchableOpacity style={themedStyles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )
      }
    />
  );
}; 