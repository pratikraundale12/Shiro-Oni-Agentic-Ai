import PropTypes from 'prop-types';
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

const ErrorTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: 10px;
`;

const ErrorText = styled.p`
  margin: 5px 0;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  background-color: ${theme.colors.primary};
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
`;

const Link = styled.a`
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
  color: ${theme.colors.primary};
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error captured in ErrorBoundary:', { error, errorInfo });
  }

  handleNavigation = url => {
    if (url === window.location.href) {
      return;
    }

    this.setState({ hasError: false, errorMessage: '' }, () => {
      window.location.href = url;
    });
  };

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong!</ErrorTitle>
          <ErrorText>We encountered an issue loading the page.</ErrorText>
          <ErrorText>
            <i>{`Error message: ${this.state.errorMessage}`}</i>
          </ErrorText>
          <div>
            <Button onClick={() => this.handleNavigation(window.location.href)}>
              Retry Again
            </Button>
            <Button onClick={() => this.handleNavigation('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
          <Link href="mailto:support@ksolves.com">Contact Support</Link>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ErrorBoundary };
