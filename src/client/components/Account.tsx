import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button, Input, Typography, FormControl, FormHelperText } from '@mui/joy';
import { Box } from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '../components';
import { boxStyle } from '../utils';

const accountBoxStyle = {
  ...boxStyle,
  justifyContent: 'center',
};

const PasswordInput = z.object({
  oldPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

type PasswordInput = z.infer<typeof PasswordInput>;

const Account = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<PasswordInput>({
    resolver: zodResolver(PasswordInput),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // fetches users email on mount
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const account = await axios.get(`/api/users/me`);
        const { email } = account.data;
        setEmail(email);
      } catch (error) {
        console.log('Something went wrong');
      }
    };

    fetchAccountData();
  }, []);

  const onSubmit: SubmitHandler<PasswordInput> = async (formData) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = formData;

      // check if new password matches the confirmed password
      if (newPassword !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: "Passwords don't match",
        });
        return;
      }

      // check if password matches the one in the database
      const passwordResponse = await axios.post('/api/users/verify-password', {
        email,
        password: oldPassword,
      });

      if (!passwordResponse.data.isValidPassword) {
        setError('oldPassword', { type: 'manual', message: 'Incorrect password' });
        return;
      }

      // passwords match and old password is valid, so change the password
      try {
        await axios.post('/api/users/change-password', { email, password: newPassword });

        reset({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        alert('Password changed successfully!');
      } catch (error) {
        console.error('Something went wrong while changing the password');
        alert('Something went wrong, please try again later!');
      }
    } catch (error) {
      console.error('Something went wrong while verifying the password');
      alert('Something went wrong, please try again later!');
    }
  };

  const handleDeleteAccountClick = async () => {
    try {
      const response = await axios.delete('/api/users/delete-account');
      if (response.status === 204) {
        alert('Account deleted successfully!');
        navigate(-1);
      }
    } catch (error) {
      console.error('Something went wrong while deleting the account');
      alert('Something went wrong, please try again later!');
    }
  };

  return (
    <Box sx={accountBoxStyle}>
      <Logo />
      <Box sx={{ margin: '1rem' }}>
        <Typography level="body-lg">Email: {email}</Typography>
      </Box>
      <Box>
        <Typography level="body-lg">Change Password?</Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ marginBottom: '1rem' }}>
          <FormControl error={!!errors.oldPassword}>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <Input type="password" placeholder="old password" color="primary" {...field} />
              )}
            />
            {errors.oldPassword && <FormHelperText>{errors.oldPassword.message}</FormHelperText>}
          </FormControl>
        </Box>
        <Box sx={{ marginBottom: '1rem' }}>
          <FormControl error={!!errors.newPassword}>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input type="password" placeholder="new password" color="primary" {...field} />
              )}
            />
            {errors.newPassword && <FormHelperText>{errors.newPassword.message}</FormHelperText>}
          </FormControl>
        </Box>
        <Box sx={{ marginBottom: '1rem' }}>
          <FormControl error={!!errors.confirmPassword}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="reenter new password"
                  color="primary"
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && (
              <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button type="submit">Submit</Button>
          <Button onClick={() => navigate(-1)}>Home</Button>
        </Box>
      </form>
      <Button onClick={handleDeleteAccountClick}>Delete Account</Button>
    </Box>
  );
};

export default Account;
