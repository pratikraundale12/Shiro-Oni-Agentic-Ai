import React, { useState } from 'react';
import styled from 'styled-components';
import { PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import Collapsible from './Collapsible';
import AddOrEditParameterContextModal from './AddOrEditParameterContextModal';

const DataWrapper = styled.div`
  width: 100%;
  height: 596px;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const ParameterContextTab = () => {
  const PC_DATA = {
    inherited: [
      {
        name: 'test 1',
        parameters: [
          {
            description: '',
            name: 'var1',
            provided: false,
            sensitive: false,
            value: '8443nifi',
          },
        ],
      },
    ],
    parent: [
      {
        name: 'VD_parameter_test',
        parameters: [
          {
            description: '',
            name: 'vd_1',
            provided: false,
            sensitive: true,
            value: 'test v1\n',
          },
        ],
      },
      {
        name: 'NEW_PARAM',
        parameters: [
          {
            description: 'we',
            name: 'abc',
            provided: false,
            sensitive: false,
            value: 'abew',
          },
          {
            description: 'this is description',
            name: 'one parameter',
            provided: false,
            sensitive: false,
            value: 'one parameter222',
          },
          {
            description: '',
            name: 'def',
            provided: false,
            sensitive: false,
            value: 'df',
          },
          {
            description: '',
            name: 'abcde',
            provided: false,
            sensitive: false,
            value: 'aaaaaaaaaaaabbb',
          },
          {
            description: '',
            name: 'data3',
            provided: false,
            sensitive: false,
            value: 'kung fu Panda pro max',
          },
          {
            description: 'new',
            name: 'newTestsss',
            provided: false,
            sensitive: false,
          },
          {
            description: '',
            name: 'abcd',
            provided: false,
            sensitive: false,
            value: 'new test66',
          },
          {
            description: '',
            name: 'File_Size',
            provided: false,
            sensitive: false,
            value: '0B',
          },
          {
            description: 'Ksolves India Limited123',
            name: 'KKKKK',
            provided: false,
            sensitive: false,
            value: 'OOOOOO111',
          },
          {
            description: '',
            name: 'v1',
            provided: false,
            sensitive: false,
            value: 'V1 Value',
          },
          {
            description: '',
            name: 'abcdef',
            provided: false,
            sensitive: false,
            value: '888881',
          },
          {
            description: 'kjkj',
            name: 'Name 5',
            provided: false,
            sensitive: false,
            value: 'Peter Parker',
          },
          {
            description: '',
            name: 'data3567',
            provided: false,
            sensitive: false,
            value: 'data',
          },
        ],
      },
    ],
  };

  const [isAddPcOpen, setIsAddPcOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});
  const [PcData, setPcData] = useState(PC_DATA);
  const [currentPgId, setCurrentPgId] = useState('');

  const handleToggle = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    setCurrentPgId(index);
  };

  const handleAddPc = index => {
    setCurrentPgId(index);
    setOpenIndex(index);
    setIsAddPcOpen({
      isOpen: true,
      mode: 'add',
    });
  };

  const handleEditClick = item => {
    setIsAddPcOpen({ isOpen: true, mode: 'edit' });
    setCurrentEditData(item);
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const PC_COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={item?.name || KDFM.NA}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <TextRender
            key={item?.value}
            text={
              (item.sensitive === true || item.sensitive === 'true') &&
              !item?.value &&
              !item.check
                ? KDFM.NO_VALUE_SET
                : item.sensitive === true || item.sensitive === 'true'
                  ? KDFM.SENSITIVE_VALUE_SET
                  : item.value
                    ? truncateString(item.value, 40)
                    : item.check
                      ? KDFM.EMPTY_STRING_SET
                      : KDFM.NO_VALUE_SET
            }
          />
        );
      },
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              handleEditClick(item);
            }}
          >
            {<PencilIcon color="black" />}
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddOrEditVariableSave = data => {
    setPcData(prevState => {
      const updatedState = { ...prevState };

      ['inherited', 'parent'].forEach(key => {
        updatedState[key] = updatedState[key].map(group => {
          if (group.name === currentPgId) {
            return {
              ...group,
              parameters: group.parameters.some(
                parameter => parameter.name === data.name
              )
                ? group.parameters.map(parameter =>
                    parameter.name === data.name
                      ? { ...parameter, value: data.value, check: data.check }
                      : parameter
                  )
                : [...group.parameters, data],
            };
          }
          return group;
        });
      });

      return updatedState;
    });
  };

  const closeAddVPcModal = () => {
    setIsAddPcOpen({
      isOpen: false,
      mode: 'add',
    });
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {PcData.inherited.map(item => (
          <Collapsible
            isAddBtnVisible={false}
            onBtnClick={() => {
              handleAddPc(item?.name);
            }}
            key={item?.name}
            title={item?.name}
            isTableOpen={openIndex === item?.name}
            toggleCollapsible={() => handleToggle(item?.name)}
          >
            <Table data={item?.parameters} columns={PC_COLUMNS} />
          </Collapsible>
        ))}
        {PcData.parent.map(item => (
          <Collapsible
            isAddBtnVisible={false}
            onBtnClick={() => {
              handleAddPc(item?.name);
            }}
            key={item?.name}
            title={item?.name}
            isTableOpen={openIndex === item?.name}
            toggleCollapsible={() => handleToggle(item?.name)}
          >
            <Table data={item?.parameters} columns={PC_COLUMNS} />
          </Collapsible>
        ))}
        {isAddPcOpen?.isOpen && (
          <AddOrEditParameterContextModal
            setIsAddParameterContextOpen={setIsAddPcOpen}
            closePopup={closeAddVPcModal}
            isAddParameterContextOpen={isAddPcOpen}
            pcEditData={currentEditData}
            handleSave={handleAddOrEditVariableSave}
          />
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default ParameterContextTab;
