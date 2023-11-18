import { useRef, KeyboardEvent, useState, FormEvent, FocusEvent, useCallback } from 'react';
import { Box, Input, Stack, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';

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

  const formRef = useRef<HTMLFormElement>(null);

  const update = useCallback((index: number, val: string) => {
    return setCode((prevState) => {
      const slice = prevState.slice();
      slice[index] = val;
      return slice;
    });
  }, []);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const index = parseInt(e.currentTarget.dataset.index as string);
    const form = formRef.current;

    if (isNaN(index) || form === null) return;

    const prevInput: InputOrNull = form.querySelector(`.input-${index - 1}`);
    const nextInput: InputOrNull = form.querySelector(`.input-${index + 1}`);

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

  function handleChange(e: FormEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    const index = parseInt(e.currentTarget.dataset.index as string);
    const form = formRef.current;
    if (isNaN(index) || form === null) return;

    let nextIndex = index + 1;
    let nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);

    update(index, value[0] || '');
    if (value.length === 1) nextInput?.focus();
    else if (index < length - 1) {
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
      <Typography variant="h4" mb={1.2}>
        {title}
      </Typography>
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
          {'confirm'}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default VerificationForm;