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
  const { register, handleSubmit, reset, control, setValue } = useForm({
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
  const handleAddEditVariablesSchedule = async data => {
    if (!data) return;
    const nameExists = (contextList, name) =>
      contextList.some(
        parameter => parameter?.name?.toLowerCase() === name?.toLowerCase()
      );
    const nameExistSchedule = (contextList, name) => {
      return contextList.some(
        parameter =>
          parameter?.variable?.name?.toLowerCase() === name?.toLowerCase()
      );
    };

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
    const scheduleFromListNameAlreadyExist = nameExistSchedule(
      combinedVaribalesListSchedule?.variables,
      data?.name
    );
    if (scheduleFromListNameAlreadyExist) {
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

      // console.log(sortedCombinedArray, 'sortedCombinedArray');
      // const updatedData = newlyAddVariables.map(item =>
      //   item?.variable?.toLowerCase() === data?.name?.toLowerCase()
      //     ? { ...item, ...data }
      //     : item
      // );
      const sortedUpdatedData = newlyAddVariables.filter(
        item => item.name !== data?.name
      );
      // console.log(sortedUpdatedData, 'sortedUpdatedData');
      // console.log([...updatedData, data], '[...updatedData, data]');
      dispatch(
        NamespacesActions.setNewlyAddVariables([...sortedUpdatedData, data])
      );
    }

    // return;
    if (!scheduleFromListNameAlreadyExist) {
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
    }

    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
    reset(DEFAULT_VALUES);
  };
  const check = useWatch({
    control,
    name: 'check',
  });

  if (check) {
    setValue('value', '');
  }
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
      secondaryButtonText={KDFM.BACK}
      primaryButtonText={KDFM.SAVE}
      footerAlign="start"
      onSubmit={handleSubmit(
        schedularFromList
          ? handleAddEditVariablesSchedule
          : handleAddEditVariables
      )}
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
