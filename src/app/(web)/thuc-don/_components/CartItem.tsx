'use client';
import { formatDate } from '@/app/lib/utils/format/formatDate';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { ActionIcon, Divider, Flex, Grid, GridCol, Image, NumberInput, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';

const CartItem = ({ item, index }: any) => {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const updateQuantity = (id: number, quantity: number) => {
    setCart(items => items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)));
  };

  return (
    <Flex direction={'column'} className='overflow-hidden'>
      <Grid key={item.id} align='flex-start'>
        <GridCol span={2}>
          <Image
            loading='lazy'
            src={item?.thumbnail || '/images/jpg/empty-300x240.jpg'}
            w={80}
            h={80}
            alt={item.name}
          />
        </GridCol>
        <GridCol span={5} className='h-full'>
          <Text size='sm' className='font-bold'>
            {item.name}
          </Text>
          <Text size='xs' c='black'>
            - {item.category?.name}
          </Text>
          <Text size='xs' c='black'>
            - Ngày bán: {formatDate(item.createdAt)}
          </Text>
        </GridCol>
        <GridCol span={2}>
          <NumberInput
            thousandSeparator=','
            value={item.quantity}
            onChange={quantity => {
              if (Number(quantity) === 0) {
                setCart(cart.filter(cartItem => cartItem.id !== item.id));
              }
              updateQuantity(item.id, Number(quantity));
            }}
            min={0}
            max={99}
            style={{ width: '80px' }}
          />
        </GridCol>
        <GridCol span={2}>
          <Text size='lg' color='red.7' className='font-bold'>
            {formatPriceLocaleVi(item.price || 0)}
          </Text>
        </GridCol>
        <GridCol span={1}>
          <ActionIcon color='red' onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}>
            <IconTrash size={20} />
          </ActionIcon>
        </GridCol>
      </Grid>
      {index < cart.length - 1 && <Divider my='sm' variant='dashed' />}
    </Flex>
  );
};

export default CartItem;
