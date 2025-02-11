/*eslint-disable*/
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { KDFM } from '../../constants';
import { CheckboxField, InputField, Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { SchedularSelectors } from '../../store/schedular/redux';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const DEFAULT_VALUES = {
  name: '',
  value: '',
};
const AddVariables = ({
  closePopup,
  isAddVariablesOpen,
  setVariablesModalOpen,
  isVariablesModalOpen,
  setIsAddVariablesOpen,
}) => {
  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const variableList = useSelector(NamespacesSelectors.getVariableList);
  const variablesDetailsData = variableList?.variables || [];
  const variableContextItem = useSelector(
    NamespacesSelectors.getVariableContextItem
  );
  const newlyAddVariables = useSelector(
    NamespacesSelectors.getNewlyAddVariables
  );
  const dispatch = useDispatch();
  const scheduleFormData = useSelector(SchedularSelectors.getFormData);
  const combinedVaribalesListSchedule = useSelector(
    NamespacesSelectors.getScheduleNamespaceVariables
  );
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  useEffect(() => {
    if (isAddVariablesOpen?.isOpen) {
      if (isEmpty(variableContextItem) && isAddVariablesOpen?.mode === 'add') {
        reset(DEFAULT_VALUES);
        setValue('check', false);
      } else {
        reset({
          name: variableContextItem?.variable?.name,
          value: variableContextItem?.variable?.value,
        });
        setValue('check', variableContextItem?.variable?.value ? false : true);
      }
    }
  }, [
    reset,
    isAddVariablesOpen,
    isAddVariablesOpen?.isOpen,
    isAddVariablesOpen?.mode,
    variableContextItem,
    setValue,
  ]);

  const handleAddEditVariables = async data => {
    if (!data) return;
    const nameExists = (contextList, name) =>
      contextList.some(
        parameter => parameter?.name?.toLowerCase() === name?.toLowerCase()
      );
    const oldParameters = variablesDetailsData.map(item => {
      return {
        name: item?.variable?.name,
      };
    });

    const parameterAlreadyExist = nameExists(newlyAddVariables, data?.name);
    const parameterAlreadyExistInNewlyAddedContext = nameExists(
      oldParameters,
      data?.name
    );

    const isDuplicate =
      (parameterAlreadyExist || parameterAlreadyExistInNewlyAddedContext) &&
      isAddVariablesOpen?.mode === 'add';

    if (isDuplicate) {
      toast.info(KDFM.VARIABLE_ALREADY_EXISTS);
      return;
    }

    if (isAddVariablesOpen?.mode === 'edit' && isEmpty(scheduleFormData)) {
      const updatedData = newlyAddVariables.map(item =>
        item?.variable?.toLowerCase() === data?.name?.toLowerCase()
          ? { ...item, ...data }
          : item
      );
      const filteredVariableList = variablesDetailsData.filter(
        item =>
          item?.variable?.name?.toLowerCase() !== data?.name?.toLowerCase()
      );
      const existingVariableDetails = variablesDetailsData.find(
        item =>
          item?.variable?.name?.toLowerCase() === data?.name?.toLowerCase()
      );

      if (existingVariableDetails && existingVariableDetails.length !== 0) {
        dispatch(
          NamespacesActions.fetchVariableListSuccess({
            ...variableList,
            variables: filteredVariableList,
          })
        );
        dispatch(
          NamespacesActions.setNewlyAddVariables([...updatedData, data])
        );
      } else {
        dispatch(NamespacesActions.setNewlyAddVariables([...updatedData]));
      }
    } else {
      dispatch(
        NamespacesActions.setNewlyAddVariables([...newlyAddVariables, data])
      );
    }

    if (isAddVariablesOpen?.mode === 'edit' && !isEmpty(scheduleFormData)) {
      const updatedData = newlyAddVariables.map(item =>
        item.name.toLowerCase() === data.name.toLowerCase()
          ? { ...item, ...data }
          : item
      );

      dispatch(NamespacesActions.setNewlyAddVariables(updatedData));
    } else {
      dispatch(
        NamespacesActions.setNewlyAddVariables([...newlyAddVariables, data])
      );
    }

    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
    reset(DEFAULT_VALUES);
  };
  // Helper function to check if a name exists in a list
  const doesNameExist = (list, name, key = 'name') =>
    list.some(item => item?.[key]?.toLowerCase() === name?.toLowerCase());

  const handleDuplicateCheck = (
    data,
    newlyAddVariables,
    oldParameters,
    isAddMode
  ) => {
    const parameterAlreadyExist = doesNameExist(newlyAddVariables, data?.name);
    const parameterAlreadyExistInOldContext = doesNameExist(
      oldParameters,
      data?.name
    );

    return (
      (parameterAlreadyExist || parameterAlreadyExistInOldContext) && isAddMode
    );
  };

  const updateVariableList = (dispatch, variablesList, updatedData, data) => {
    const filteredVariables = variablesList.filter(
      item => item?.variable?.name?.toLowerCase() !== data?.name?.toLowerCase()
    );

    const existingVariable = variablesList.find(
      item => item?.variable?.name?.toLowerCase() === data?.name?.toLowerCase()
    );

    if (existingVariable) {
      dispatch(
        NamespacesActions.fetchVariableListSuccess({
          ...variablesList,
          variables: filteredVariables,
        })
      );
      dispatch(NamespacesActions.setNewlyAddVariables([...updatedData, data]));
    } else {
      dispatch(NamespacesActions.setNewlyAddVariables(updatedData));
    }
  };

  const handleAddEditVariablesSchedule = async data => {
    if (!data) return;

    const oldParameters = variablesDetailsData.map(item => ({
      name: item?.variable?.name,
    }));

    const isDuplicate = handleDuplicateCheck(
      data,
      newlyAddVariables,
      oldParameters,
      isAddVariablesOpen?.mode === 'add'
    );

    if (isDuplicate) {
      toast.info(KDFM.VARIABLE_ALREADY_EXISTS);
      return;
    }

    const scheduleNameAlreadyExists = doesNameExist(
      combinedVaribalesListSchedule?.variables,
      data?.name,
      'variable.name'
    );

    if (scheduleNameAlreadyExists) {
      const sortedCombinedArray =
        combinedVaribalesListSchedule?.variables.filter(
          item =>
            item?.variable?.name?.toLowerCase() !== data?.name?.toLowerCase()
        );

      dispatch(
        NamespacesActions.setScheduleNamespaceVariable({
          variables: sortedCombinedArray,
        })
      );

      const sortedUpdatedData = newlyAddVariables.filter(
        item => item.name !== data?.name
      );

      dispatch(
        NamespacesActions.setNewlyAddVariables([...sortedUpdatedData, data])
      );
    } else {
      const updatedData = newlyAddVariables.map(item =>
        item?.name?.toLowerCase() === data?.name?.toLowerCase()
          ? { ...item, ...data }
          : item
      );

      if (isAddVariablesOpen?.mode === 'edit' && isEmpty(scheduleFormData)) {
        updateVariableList(dispatch, variablesDetailsData, updatedData, data);
      } else {
        dispatch(
          NamespacesActions.setNewlyAddVariables(
            isAddVariablesOpen?.mode === 'edit' && !isEmpty(scheduleFormData)
              ? updatedData
              : [...newlyAddVariables, data]
          )
        );
      }
    }

    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    setVariablesModalOpen({
      isOpen: true,
      mode: 'add',
      schedule: !!isVariablesModalOpen?.schedule,
    });
    reset(DEFAULT_VALUES);
  };
  const check = useWatch({
    control,
    name: 'check',
  });

  useEffect(() => {
    if (check) {
      setValue('value', '');
    }
  }, [check, setValue]);

  const variableValue = watch('value');
  return (
    <Modal
      title={
        isAddVariablesOpen?.mode === 'add'
          ? KDFM.ADD_VARIABLES
          : KDFM.EDIT_VARIABLES
      }
      isOpen={isAddVariablesOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText={KDFM.CANCEL}
      primaryButtonText={KDFM.ADD}
      footerAlign="start"
      onSubmit={handleSubmit(
        schedularFromList
          ? handleAddEditVariablesSchedule
          : handleAddEditVariables
      )}
      primaryButtonDisabled={
        variableValue === variableContextItem?.variable?.value ?? false
      }
    >
      <ModalBody className="modal-body">
        <form>
          <InputField
            name="name"
            type="text"
            label={KDFM.NAME}
            icon={<QRIcons />}
            disabled={isAddVariablesOpen?.mode === 'edit'}
            register={register}
          />
          <InputField
            name="value"
            type="text"
            label={KDFM.VALUE}
            icon={<QRIcons />}
            placeholder={check ? KDFM.EMPTY_STRING_SET : ''}
            disabled={check}
            register={register}
          />
          <CheckboxField
            name="check"
            label={KDFM.SET_EMPTY_STRING}
            register={register}
          />
        </form>
      </ModalBody>
    </Modal>
  );
};

AddVariables.propTypes = {
  closePopup: PropTypes.func.isRequired,
  isAddVariablesOpen: PropTypes.object.isRequired,
  newlyAddVariables: PropTypes.array,
  setNewlyAddvariables: PropTypes.func,
  setVariablesModalOpen: PropTypes.func.isRequired,
  setIsAddVariablesOpen: PropTypes.func,
  isVariablesModalOpen: PropTypes.object,
  variableContextItem: PropTypes.func,
};

export default AddVariables;
