'use client';
import Empty from '@/app/_components/Empty';
import { HEIGHT_HEADER } from '@/app/_components/Web/Header/_components/NavigationHeader';
import { CartItemFastMenu } from '@/app/_components/Web/Home/_Components/CartItemFastMenu';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { Box, Card, Center, Divider, Group, ScrollAreaAutosize, Select, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ButtonCheckout } from '../../thanh-toan/_components/ButtonCheckout';

export const HEIGHT_HEADER_AND_BREADCRUMB = HEIGHT_HEADER + 100;
export const TOP_POSITION_STICKY = 70;

const QuickCart = () => {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card radius={'md'} bg={'gray.1'}>
      <Card.Section>
        <Stack>
          <ScrollAreaAutosize mah={'40vh'}>
            {!cart?.length ? (
              <>
                <Empty hasButton={false} size='xs' title='Giỏ hàng trống' content='Vui lòng mua hàng' />
                <Center>
                  <Divider mt={'md'} w={'90%'} />
                </Center>
              </>
            ) : (
              cart.map(item => (
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
              ))
            )}
          </ScrollAreaAutosize>

          <Group justify='space-between' className='px-4'>
            <Text fw={500}>Tổng tiền:</Text>
            <Text fw={700} size='lg' c='red'>
              {formatPriceLocaleVi(total)}
            </Text>
          </Group>

          <Stack gap='md' className='px-4'>
            <Text fw={500}>Thời gian giao hàng</Text>
            <Select
              placeholder='Chọn ngày'
              data={[
                { value: 'today', label: 'Hôm nay' },
                { value: 'tomorrow', label: 'Ngày mai' }
              ]}
            />
            <Select
              placeholder='Chọn thời gian'
              data={[
                { value: 'morning', label: 'Buổi sáng (8:00 - 12:00)' },
                { value: 'afternoon', label: 'Buổi chiều (13:00 - 17:00)' }
              ]}
            />
            <Box mb={10}>
              <ButtonCheckout
                total={total}
                data={cart}
                stylesButtonCheckout={{ title: 'Thanh toán', fullWidth: true, size: 'md', radius: 'sm' }}
              />
            </Box>
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default QuickCart;
