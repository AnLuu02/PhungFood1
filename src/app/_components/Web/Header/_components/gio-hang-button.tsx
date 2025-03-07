'use client';
import BButton from '@/app/_components/Button';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Indicator,
  Menu,
  rem,
  ScrollAreaAutosize,
  Stack,
  Text
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { CartItemFastMenu } from '../../Home/_Components/CartItemFastMenu';

const CartButton = () => {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Menu shadow='md' width={350} trigger='hover' transitionProps={{ transition: 'fade-down', duration: 300 }}>
      <Menu.Target>
        <Link href='/gio-hang' className='text-white no-underline'>
          <Button
            variant='outline'
            className='border-[#008b4b] text-[#008b4b] hover:bg-[#008b4b] hover:text-white'
            radius={'xl'}
            leftSection={
              <Indicator label={cart.length || 0} size={rem(15)} color={'green.9'}>
                <IconShoppingBag size={20} />
              </Indicator>
            }
          >
            Giỏ hàng
          </Button>
        </Link>
      </Menu.Target>
      <Menu.Dropdown>
        {cart.length > 0 ? (
          <Stack pb={10}>
            <ScrollAreaAutosize mah={'40vh'}>
              {cart.map(item => (
                <Box key={item?.id}>
                  <CartItemFastMenu
                    key={item?.id}
                    image={item?.thumbnail}
                    name={item?.name}
                    price={item?.price}
                    quantity={item?.quantity}
                    onQuantityChange={(value: any) => updateQuantity(item?.id, value)}
                    onDelete={() => removeItem(item?.id)}
                  />
                  <Divider />
                </Box>
              ))}
            </ScrollAreaAutosize>

            <Group justify='space-between' className='px-4'>
              <Text fw={700}>Tổng tiền:</Text>
              <Text fw={700} size='lg' c='red'>
                {formatPriceLocaleVi(total)}
              </Text>
            </Group>

            <Stack gap='md' className='px-4'>
              <Link href='/gio-hang' className='text-white no-underline'>
                <BButton title={'Giỏ hàng'} radius='sm' size='md' fullWidth />
              </Link>
            </Stack>
          </Stack>
        ) : (
          <Flex direction={'column'} justify={'center'} align={'center'} py={10}>
            <Image loading='lazy' src={'/images/png/empty_cart.png'} w={100} h={100} alt={'empty cart'} />
            <Text size='sm' c={'dimmed'}>
              Không có sản phẩm nào trong giỏ hàng
            </Text>
          </Flex>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default CartButton;
