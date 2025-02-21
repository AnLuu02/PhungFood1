'use client';

import { NotifyError } from '@/app/lib/utils/func-handler/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  GridCol,
  PasswordInput,
  rem,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import LoginServices from '../_components/LoginServices';

export default function Page() {
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1, 'Email là bắt buộc'),
        password: z.string().min(1, 'Password là bắt buộc')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    setError('');
    try {
      if (formData) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });
        if (result?.error) {
          setError(result.error);
        } else {
          window.location.href = callbackUrl;
        }
      }
    } catch (error) {
      NotifyError('Error created Category');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center my={'md'}>
        <Card
          w={{ base: '100%', sm: '50vw', md: '40vw', lg: '25vw' }}
          h={'max-content'}
          py={'xs'}
          shadow='xl'
          radius={'md'}
        >
          <Card.Section p={'md'}>
            <Grid>
              <GridCol span={12} className='flex justify-center'>
                <Title className='font-quicksand' size={rem(28)}>
                  ĐĂNG NHẬP
                </Title>
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextInput
                      styles={{ input: {} }}
                      placeholder='E-mail, số điện thoại'
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value);
                        setError('');
                      }}
                      error={error !== '' || errors.email?.message}
                    />
                  )}
                />
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder='Mật khẩu'
                      onChange={e => {
                        field.onChange(e.target.value);
                        setError('');
                      }}
                      error={error !== '' || errors.password?.message}
                    />
                  )}
                />
                {error && (
                  <Text size='xs' c={'red'} mt={5}>
                    {error}
                  </Text>
                )}
              </GridCol>

              <GridCol span={12} className='flex justify-end'>
                <Link href={'/'} className='text-sm text-black hover:text-red-500'>
                  Bạn quên mật khẩu?
                </Link>
              </GridCol>
            </Grid>

            <Grid>
              <GridCol span={12} className=''>
                <Button
                  fullWidth
                  size='md'
                  className='bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black'
                  type='submit'
                  loading={isSubmitting}
                >
                  ĐĂNG NHẬP
                </Button>
              </GridCol>
              <GridCol span={12} className='flex justify-center'>
                <Flex align={'center'}>
                  <Text size='sm'>Bạn chưa có tài khoản?</Text>
                  <Link href={'/dang-ki'} className='text-white'>
                    <Text className='cursor-pointer text-black underline hover:text-red-500' size='sm'>
                      Đăng ký ngay
                    </Text>
                  </Link>
                </Flex>
              </GridCol>
              <GridCol span={12} className='flex justify-center' mt={10}>
                <Flex align={'center'} gap={10}>
                  <Divider orientation='horizontal' w={100} color={'black'} opacity={0.2} />
                  <Text size='xs' c={'black'} opacity={0.5}>
                    / HOẶC /
                  </Text>
                  <Divider orientation='horizontal' w={100} color={'black'} opacity={0.2} />
                </Flex>
              </GridCol>

              <GridCol span={12} className='flex justify-center'>
                <LoginServices />
              </GridCol>
            </Grid>
          </Card.Section>
        </Card>
      </Center>
    </form>
  );
}
