/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';
import { useSelector } from 'react-redux';
import { ClustersSelectors, RegistrySelectors } from '../../store';
import { isEmpty } from 'lodash';

const RegistryEditorKubernetesConfig = ({
  errorsInEditor,
  setErrorsInEditor,
  setYamlValue,
  yamlValue,
  parsedJson,
  setParsedJson,
  yamlEditorValue,
  setYamlEditorValue,
}) => {
  const updatedConfigKube = useSelector(ClustersSelectors.getUpdatedKubeConfig);
  const configDefaultValue = useSelector(
    RegistrySelectors.getregistryConfigDefaultData
  );
  useEffect(() => {
    if (configDefaultValue?.valuesYaml) {
      setYamlEditorValue(configDefaultValue?.valuesYaml);
    }
  }, [configDefaultValue?.valuesYaml]);

  const handleYamlChange = value => {
    setYamlEditorValue?.(value || '');
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
          value={yamlEditorValue || ''}
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
          // onValidate={() => {}}
          // onMount={editor => {
          //   editor.onKeyDown(e => {
          //     if (e.keyCode === 3) {
          //       e.preventDefault();
          //       e.stopPropagation();
          //     }
          //   });
          // }}
        />
      </div>
    </>
  );
};
export default RegistryEditorKubernetesConfig;
