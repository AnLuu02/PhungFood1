'use client';
import { Voucher } from '@/app/Entity/VoucherEntity';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { createTag } from '@/app/lib/utils/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '@/app/lib/utils/func-handler/toast';
import { voucherSchema } from '@/app/lib/utils/zod/zodShcemaForm';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Button,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Select,
  TagsInput,
  TagsInputProps,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { VoucherType } from '@prisma/client';
import { IconDatabase } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export default function CreateVoucher({ setOpened }: { setOpened: any }) {
  const [valueProductSelected, setValueProductSelected] = useState<string[]>([]);

  const { data, isLoading } = api.Product.getAll.useQuery({
    hasCategoryChild: false
  });

  const products = data || [];
  const maps = new Map();
  products?.forEach(product => {
    maps.set(product.id, {
      name: product.name,
      price: product.price
    });
  });
  const dataRender: Record<string, { thumbnail: string; name: string; price: string }> = Object.fromEntries(maps);
  const renderTagsInputOption: TagsInputProps['renderOption'] = ({ option }) => (
    <Group py={0}>
      <Avatar src={dataRender[option.value]?.thumbnail} alt={dataRender[option.value]?.name} radius={'sm'} size={40} />
      <Text size='md' fw={700}>
        {dataRender[option.value]?.name}
      </Text>
      <Text size='md' fw={700} c={'red'}>
        {formatPriceLocaleVi(dataRender[option.value]?.price || 0)}
      </Text>
    </Group>
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Voucher>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      id: '',
      tag: '',
      name: '',
      description: '',
      type: VoucherType.FIXED,
      discountValue: 0,
      minOrderPrice: 0,
      maxDiscount: 0,
      applyAll: false,
      quantity: 0,
      usedQuantity: 0,
      availableQuantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      vipLevel: 0,
      products: []
    }
  });
  const nameValue = watch('name', '');
  useEffect(() => {
    const generatedTag = createTag(nameValue);
    setValue('tag', generatedTag);
  }, [nameValue, setValue]);

  const utils = api.useUtils();
  const mutation = api.Voucher.create.useMutation();

  const onSubmit: SubmitHandler<Voucher> = async formData => {
    try {
      if (formData) {
        let result = await mutation.mutateAsync({
          ...formData,
          products: [...valueProductSelected]
        });
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
          utils.Voucher.invalidate();
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Error created Voucher');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        {/* Tên voucher */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput label='Tên voucher' placeholder='Nhập tên voucher' error={errors.name?.message} {...field} />
            )}
          />
        </Grid.Col>

        {/* Tag */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='tag'
            render={({ field }) => (
              <TextInput label='Tag' placeholder='Sẽ tạo tự động' error={errors.tag?.message} readOnly {...field} />
            )}
          />
        </Grid.Col>

        {/* Mô tả */}
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Textarea label='Mô tả' placeholder='Nhập mô tả' error={errors.description?.message} {...field} />
            )}
          />
        </Grid.Col>

        {/* Hình thức khuyến mãi */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Select
                label='Hình thức khuyến mãi'
                placeholder='Chọn phương thức'
                data={[
                  { value: VoucherType.FIXED, label: 'Tiền mặt' },
                  { value: VoucherType.PERCENTAGE, label: '% đơn hàng' }
                ]}
                error={errors.type?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid.Col>

        {/* Giá trị giảm giá */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='discountValue'
            render={({ field }) => (
              <NumberInput
                {...field}
                leftSection={watch('type') === VoucherType.PERCENTAGE ? '%' : '$'}
                thousandSeparator=','
                label='Giá trị giảm giá'
                placeholder='Nhập số tiền hoặc %'
                max={watch('type') === VoucherType.FIXED ? 100000000 : 100}
                clampBehavior='strict'
                error={errors.discountValue?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='minOrderPrice'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Giá trị đơn hàng tối thiểu'
                placeholder='Nhập giá trị'
                clampBehavior='strict'
                error={errors.minOrderPrice?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='maxDiscount'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Giảm giá tối đa'
                placeholder='Nhập giá trị'
                value={watch('type') === VoucherType.FIXED ? watch('discountValue') : field.value}
                error={errors.maxDiscount?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Áp dụng cho tất cả */}
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='applyAll'
            render={({ field }) => (
              <Checkbox
                label='Áp dụng cho tất cả'
                error={errors.applyAll?.message}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid.Col>

        {/* Product áp dụng*/}
        {!watch('applyAll') && (
          <Grid.Col span={12}>
            <TagsInput
              label='Sản phẩm áp dụng'
              placeholder='Nhập tên sản phẩm'
              scrollAreaProps={{ type: 'auto' }}
              clearable
              leftSection={<IconDatabase size={16} />}
              maxDropdownHeight={200}
              data={products?.map((item: any) => item.id)}
              renderOption={renderTagsInputOption}
              value={valueProductSelected}
              onChange={values => {
                setValueProductSelected(values);
              }}
            />
          </Grid.Col>
        )}

        {/* Số lượng voucher */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='quantity'
            render={({ field }) => (
              <NumberInput
                thousandSeparator=','
                label='Số lượng voucher'
                placeholder='Nhập số lượng'
                error={errors.quantity?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Đã bán */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='usedQuantity'
            render={({ field }) => (
              <NumberInput
                thousandSeparator=','
                label='Số lượng đã bán'
                placeholder='Nhập số lượng'
                error={errors.usedQuantity?.message}
                readOnly
                disabled
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Còn lại */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='availableQuantity'
            render={({ field }) => (
              <NumberInput
                thousandSeparator=','
                label='Số lượng còn lại'
                placeholder='Nhập số lượng'
                error={errors.availableQuantity?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Ngày bắt đầu */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='startDate'
            render={({ field }) => (
              <DatePickerInput
                label='Ngày bắt đầu'
                placeholder='Chọn ngày'
                error={errors.startDate?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Ngày kết thúc */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='endDate'
            render={({ field }) => (
              <DatePickerInput
                label='Ngày kết thúc'
                placeholder='Chọn ngày'
                error={errors.endDate?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Cấp độ VIP */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='vipLevel'
            render={({ field }) => (
              <NumberInput
                label='Cấp độ VIP yêu cầu'
                placeholder='Nhập cấp độ'
                error={errors.vipLevel?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
