'use client';
import { Review } from '@/app/Entity/ReviewEntity';
import { NotifyError, NotifySuccess } from '@/app/lib/utils/func-handler/toast';
import { reviewSchema } from '@/app/lib/utils/zod/zodShcemaForm';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Grid, NumberInput, Rating, Select, Textarea } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export default function UpdateReview({ reviewId, setOpened }: { reviewId: string; setOpened: any }) {
  const queryResult = reviewId ? api.Review.getFilter.useQuery({ query: reviewId || '' }) : { data: null };
  const { data: products } = api.Product.getAll.useQuery({ hasReview: true });
  const { data: users } = api.User.getAll.useQuery();
  const { data } = queryResult;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      userId: '',
      productId: '',
      rating: 0.0,
      comment: ''
    }
  });

  useEffect(() => {
    if (data && data.length > 0) {
      reset({
        id: data?.[0]?.id,
        userId: data?.[0]?.userId,
        productId: data?.[0]?.productId,
        rating: data?.[0]?.rating,
        comment: data?.[0]?.comment || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Review.update.useMutation();

  const onSubmit: SubmitHandler<Review> = async formData => {
    if (reviewId) {
      const updatedFormData = { ...formData };
      let result = await updateMutation.mutateAsync({ reviewId, ...updatedFormData });
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.Review.invalidate();
      } else {
        NotifyError(result.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            name='productId'
            control={control}
            rules={{ required: 'Product is required' }}
            render={({ field }) => (
              <Select
                searchable
                label='Product'
                placeholder='Select your Product'
                data={products?.map((product: any) => ({ value: product.id, label: product.name })) || []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.productId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            rules={{ required: 'user is required' }}
            render={({ field }) => (
              <Select
                searchable
                label='user'
                placeholder='Select your user'
                data={users?.map((user: any) => ({ value: user.id, label: user.name })) || []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.userId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            name='rating'
            control={control}
            rules={{
              required: 'rating is required',
              validate: value => (value >= 0 && value <= 5) || 'Rating must be between 0 and 5'
            }}
            render={({ field, fieldState }) => (
              <Flex align={'center'} justify={'space-between'}>
                <NumberInput label='Đánh giá' {...field} min={0} max={5} error={errors.rating?.message} />
                <Rating size={'lg'} {...field} fractions={4} color={'yellow.8'} />
              </Flex>
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='comment'
            render={({ field }) => <Textarea label='Bình luận' placeholder='Nhập mô tả' {...field} />}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
