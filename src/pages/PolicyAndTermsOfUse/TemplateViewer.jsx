import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TemplateViewer = ({ URL }) => {
  const [templateContent, setTemplateContent] = useState('');

  useEffect(() => {
    fetch(URL)
      .then(response => response.text())
      .then(data => setTemplateContent(data))
      .catch(error => console.error('Error fetching template:', error));
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: templateContent }} />;
};

export default TemplateViewer;

TemplateViewer.propTypes = {
  URL: PropTypes.string,
};
