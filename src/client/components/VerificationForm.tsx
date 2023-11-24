import {
  useRef,
  KeyboardEvent,
  useState,
  FormEvent,
  FocusEvent,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { Box, Input, Stack, styled } from '@mui/material';
import { Typography } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import { Timer } from '../components';
import { GameContext } from '../contexts';

const VerificationInput = styled(Input)(({ theme }) => ({
  width: '2rem',
  fontSize: '1.3rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
  input: { textAlign: 'center ' },
  appearance: 'textfield',
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    appearance: 'none',
    margin: 0,
  },
}));

type InputOrNull = HTMLInputElement | null;

interface VerificationFormProps {
  title: string;
  length: number;
  onFormSubmit: (userInput: string[]) => void;
}

const VerificationForm = ({ title, length, onFormSubmit }: VerificationFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [code, setCode] = useState<string[]>(Array(length).fill(''));

  // need to use ref to access the form element
  const formRef = useRef<HTMLFormElement>(null);

  // determine if the timer setting is enabled
  const { shouldShowTimer } = useContext(GameContext);
  useEffect(() => {}, [shouldShowTimer]);

  // useCallback caches function def between re-renders
  const update = useCallback((index: number, val: string) => {
    return setCode((prevState) => {
      // make a copy of the state array
      const slice = prevState.slice();
      // update the value at the index
      slice[index] = val;
      // return the updated array
      return slice;
    });
  }, []);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // grabs the index but need to type assert as a string for parseInt
    const index = parseInt(e.currentTarget.dataset.index as string);
    const form = formRef.current;
    if (isNaN(index) || form === null) return;

    // grab the prev and next input elements
    const prevInput: InputOrNull = form.querySelector(`.input-${index - 1}`);
    const nextInput: InputOrNull = form.querySelector(`.input-${index + 1}`);

    // handle backspace, arrow left, and arrow right
    switch (e.key) {
      case 'Backspace':
        if (code[index]) update(index, '');
        else if (prevInput) prevInput.select();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (nextInput) nextInput.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (prevInput) prevInput.focus();
    }
  }

  // handle input change
  function handleChange(e: FormEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    // need to type assert as a string for parseInt
    const index = parseInt(e.currentTarget.dataset.index as string);
    const form = formRef.current;
    if (isNaN(index) || form === null) return;

    // grab the next input element
    let nextIndex = index + 1;
    let nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);

    // call the cached update function with the index and value
    update(index, value[0] || '');

    // only focus on the next input if the value is not empty
    if (value.length === 1) {
      nextInput?.focus();
      // handle the case where the user pastes a value
    } else if (index < length - 1) {
      // split the value into an array and update the state
      const split = value.slice(index + 1, length).split('');
      split.forEach((val) => {
        update(nextIndex, val);
        nextInput?.focus();
        nextIndex++;
        nextInput = form.querySelector(`.input-${nextIndex}`);
      });
    }
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    e.currentTarget.select();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitted(true);
    const isValidInput = code.every((val) => val !== '');
    setIsValid(isValidInput);

    if (isValidInput) {
      onFormSubmit(code);
    }
  }

  return (
    <Box
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      bgcolor="white"
      py={5}
      px={{ xs: 2.5, md: 5.5 }}
      borderRadius="16px"
      boxShadow={3}
    >
      <Typography level="body-lg" mb={1.2}>
        {title}
      </Typography>
      {shouldShowTimer && <Timer />}
      <Stack
        component={'fieldset'}
        border={'none'}
        direction={'row'}
        spacing={1.2}
        justifyContent={'center'}
      >
        {code.map((value, i) => (
          <VerificationInput
            key={i}
            value={value}
            error={isSubmitted && !isValid}
            inputProps={{
              type: 'number',
              className: `input-${i}`,
              'aria-label': `Number ${i + 1}`,
              'data-index': i,
              pattern: '[0-9]*',
              inputtype: 'numeric',
              onChange: handleChange,
              onKeyDown: handleKeyDown,
              onFocus: handleFocus,
            }}
          />
        ))}
      </Stack>
      <Box textAlign="center" mt={2.5}>
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          sx={{ paddingX: (theme) => theme.spacing(8) }}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default VerificationForm;
