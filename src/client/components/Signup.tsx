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

const signupBoxStyle = {
  ...boxStyle,
  justifyContent: 'center',
};

const SignupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

type SignupInput = z.infer<typeof SignupInput>;

const Signup = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setIsLoggedIn } = useContext(GameContext);

  const onSubmit: SubmitHandler<SignupInput> = async (formData) => {
    try {
      await axios.post('/api/users/signup', formData);
      setIsLoggedIn(true);
      // TODO: Stylize this alert or replace it with a toast
      alert('Signup successful! Navigating back to the home page.');
      navigate('/');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        setError('password', {
          type: 'manual',
          message: 'Something went wrong, please try again later',
        });
      }
    }
  };

  const navigate = useNavigate();

  return (
    <Box sx={signupBoxStyle}>
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
          <Button onClick={handleSubmit(onSubmit)}>Sign up</Button>
          <Button onClick={() => navigate(-1)}>Home</Button>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;
