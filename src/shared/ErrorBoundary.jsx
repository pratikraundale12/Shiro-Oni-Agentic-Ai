import React from 'react';
import styled from 'styled-components';

import { theme } from '../styles';

const ErrorContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || '' };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2 color={theme.colors.primary} className="mb-1">Something went wrong!</h2>
          <h5>Sorry, there was an error loading the page.</h5>
          <h5><i>{`Error message: ${this.state.errorMessage}`}</i></h5>
          <a href={window.location.href}>Retry again</a>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
