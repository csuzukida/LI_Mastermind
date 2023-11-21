import axios from 'axios';
import { z } from 'zod';
import { useContext } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input, FormControl, FormHelperText } from '@mui/joy';
import { Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '../components';
import { GameContext } from '../contexts';
import { boxStyle } from '../utils';

// TODO: Add forgot password link

const signinBoxStyle = {
  ...boxStyle,
  justifyContent: 'center',
};

const SigninInput = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

type SigninInput = z.infer<typeof SigninInput>;

const Signin = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninInput>({
    resolver: zodResolver(SigninInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setIsLoggedIn } = useContext(GameContext);

  const onSubmit: SubmitHandler<SigninInput> = async (formData) => {
    try {
      await axios.post('/api/users/login', formData);
      setIsLoggedIn(true);
      // TODO: Stylize this alert or replace it with a toast
      alert('Sign in successful! Navigating back to the home page.');
      navigate('/');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        setError('password', {
          type: 'manual',
          message: 'Email not found or password is incorrect',
        });
      }
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        setError('password', {
          type: 'manual',
          message: 'Email not found or password is incorrect',
        });
      }
    }
  };

  const navigate = useNavigate();

  return (
    <Box sx={signinBoxStyle}>
      <Logo />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ marginBottom: '1rem' }}>
          <FormControl error={!!errors.email}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input placeholder="email" color="primary" {...field} />}
            />
            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: '1rem' }}>
          <FormControl error={!!errors.password}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input placeholder="password" color="primary" {...field} />}
            />
            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onClick={handleSubmit(onSubmit)}>Sign in</Button>
          <Button onClick={() => navigate(-1)}>Home</Button>
        </Box>
      </form>
    </Box>
  );
};

export default Signin;
