import { useCallback, useReducer } from 'react';

type Inputs = {
  value: any | undefined;
  isValid: boolean;
};

export type FormState = {
  inputs: FormInputs;
  isValid: boolean;
};

export type FormInputs = {
  [key: string]: Inputs;
};

enum FormAction {
  INPUT_CHANGE = 'INPUT_CHANGE',
  SET_DATA = 'SET_DATA',
}

type Action =
  | {
      type: FormAction.INPUT_CHANGE;
      value: any;
      isValid: boolean;
      inputId: string;
    }
  | { type: FormAction.SET_DATA; formIsValid: boolean; inputs: FormInputs };

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case FormAction.INPUT_CHANGE:
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case FormAction.SET_DATA:
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (
  initialInputs: FormInputs,
  initialFormValidity: boolean,
) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback(
    (id: string, value: any, isValid: boolean) => {
      dispatch({
        type: FormAction.INPUT_CHANGE,
        value: value,
        isValid: isValid,
        inputId: id,
      });
    },
    [],
  );

  const setFormData = useCallback(
    (inputData: FormInputs, formValidity: boolean) => {
      dispatch({
        type: FormAction.SET_DATA,
        inputs: inputData,
        formIsValid: formValidity,
      });
    },
    [],
  );

  return [formState, inputHandler, setFormData];
};
