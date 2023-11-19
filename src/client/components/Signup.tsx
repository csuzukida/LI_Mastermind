import axios from 'axios';
import { z } from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input, FormControl, FormHelperText } from '@mui/joy';
import { Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '.';

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

  const onSubmit: SubmitHandler<SignupInput> = async (formData) => {
    try {
      await axios.post('/api/users/signup', formData);
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
    <>
      <Button onClick={() => navigate(-1)}>Home</Button>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <Box sx={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          <Logo />
        </Box>
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
          <Button sx={{ marginLeft: '1rem', width: '40%' }} onClick={handleSubmit(onSubmit)}>
            Sign up
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Signup;
