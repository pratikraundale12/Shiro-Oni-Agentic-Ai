/*eslint-disable*/
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';
import { useSelector } from 'react-redux';
import { ClustersSelectors } from '../../../store';
import { isEmpty } from 'lodash';

const EditorKubernetesConfig = ({
  errorsInEditor,
  setErrorsInEditor,
  setYamlValue,
  yamlValue,
}) => {
  const configDefaultValue = useSelector(
    ClustersSelectors.getKubernetesConfigFields
  );

  const handleYamlChange = value => {
    setYamlValue?.(value || '');
    try {
      const docs = [];
      yaml.loadAll(String(value || ''), doc => {
        docs.push(doc);
      });
      setErrorsInEditor([]);
    } catch (err) {
      setErrorsInEditor([err.message]);
    }
  };

  return (
    <>
      <div>
        {!isEmpty(errorsInEditor) && (
          <div style={{ color: 'red', fontSize: '15px' }}>
            YAML file format validation error
          </div>
        )}
      </div>
      <div
        style={{
          border: `1px solid ${!isEmpty(errorsInEditor) ? 'red' : 'grey'}`,
        }}
        className="h-100"
      >
        <Editor
          width="100%"
          language="yaml"
          value={yamlValue || configDefaultValue?.valuesYaml || ''}
          //   defaultValue={configDefaultValue?.valuesYaml}
          //   onMount={() => {}}
          onChange={handleYamlChange}
          options={{
            minimap: { enabled: false },
            readOnly: false,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 0, bottom: 0 },
            lineNumbers: 'on',
            overviewRulerLanes: 0,
            scrollbar: {
              verticalScrollbarSize: 4,
              horizontalScrollbarSize: 4,
              arrowSize: 4,
            },
          }}
          onValidate={() => {}}
        />
      </div>
    </>
  );
};
export default EditorKubernetesConfig;
