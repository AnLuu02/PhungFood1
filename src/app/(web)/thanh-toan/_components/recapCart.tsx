'use client';

import BButton from '@/app/_components/Button';
import ModalShowVoucher from '@/app/_components/Modals/ModalShowVoucher';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { api } from '@/trpc/react';
import { Button, Card, Divider, Flex, Group, Pill, ScrollAreaAutosize, Stack, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { PaymentType, VoucherType } from '@prisma/client';
import { IconArrowLeft, IconGift } from '@tabler/icons-react';
import { useState } from 'react';
import { ButtonCheckout } from './ButtonCheckout';
import CartItemPayment from './CartItemPayment';

const RecapCart = ({ order, loading, paymentMethod, type = 'cart' }: any) => {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [seletedVouchers, setSelectedVouchers, resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });

  const { data, isLoading } = api.Voucher.getAll.useQuery();

  const [showVoucher, setShowVoucher] = useState(false);

  const discount = cart.reduce((sum, item) => {
    if (item.discount) {
      return sum + item.discount * item.quantity;
    }
    return sum;
  }, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = (subtotal - discount) * 0.1;

  const promotionTotal = (seletedVouchers ?? []).reduce((sum: any, item: any) => {
    if (!item?.discountValue) return sum;
    const discount = item.type === VoucherType.FIXED ? item.discountValue : (item.discountValue * subtotal) / 100;
    return sum + discount;
  }, 0);
  const total = subtotal + tax - discount - promotionTotal;

  return (
    <Card shadow='sm' radius='md' withBorder>
      <Stack gap={'md'}>
        <Title order={2} className='font-quicksand text-xl'>
          Đơn hàng ({order?.orderItems?.length || order?.length || 0} sản phẩm)
        </Title>

        <ScrollAreaAutosize mah={220} px='0' scrollbarSize={5}>
          <Stack gap={'md'} py={'sm'} pr={20}>
            {type === 'cart'
              ? order.map((item: any, index: number) => <CartItemPayment key={index} item={item} index={index} />)
              : order?.orderItems?.map((item: any, index: number) => (
                  <CartItemPayment key={index} item={{ ...item.product, quantity: item.quantity }} index={index} />
                ))}
          </Stack>
        </ScrollAreaAutosize>

        {type === 'cart' && (
          <>
            <Divider />
            <Group gap={0} m={0}>
              {seletedVouchers?.length > 0 && (
                <Pill.Group py={'xs'}>
                  {seletedVouchers.map((item: any, index: number) => (
                    <Pill
                      withRemoveButton
                      key={index}
                      c='white'
                      bg={'red'}
                      onClick={() => {
                        setSelectedVouchers(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      {item.name}
                    </Pill>
                  ))}
                </Pill.Group>
              )}
              <Button
                onClick={() => {
                  setShowVoucher(true);
                }}
                px={0}
                m={0}
                fullWidth
                leftSection={<IconGift size={16} />}
                variant='subtle'
                color='red'
              >
                Xem thêm mã giảm giá
              </Button>
              <ModalShowVoucher
                opened={showVoucher}
                products={cart}
                data={data}
                onClose={() => setShowVoucher(false)}
              />
            </Group>
            <Divider py={0} />
          </>
        )}
        <Stack gap='xs'>
          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Tạm tính
            </Text>
            <Text size='md' fw={700}>
              {subtotal.toLocaleString()}₫
            </Text>
          </Group>
          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Giảm giá sản phẩm:
            </Text>
            <Text size='md' fw={700}>
              -{formatPriceLocaleVi(discount)}
            </Text>
          </Group>

          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Khuyến mãi:
            </Text>
            <Text size='md' fw={700}>
              -{formatPriceLocaleVi(promotionTotal)}
            </Text>
          </Group>
          <Group justify='space-between' className='mb-2'>
            <Text size='md' fw={700}>
              Thuế (10%):
            </Text>
            <Text size='md' fw={700}>
              {formatPriceLocaleVi(tax)}
            </Text>
          </Group>
          <Divider />

          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Tổng cộng
            </Text>
            <Text size='xl' fw={700} c={'red'}>
              {formatPriceLocaleVi(total)}
            </Text>
          </Group>
        </Stack>

        {type === 'cart' ? (
          <Flex gap={0} justify='space-between' wrap={'nowrap'}>
            <ButtonCheckout
              total={total}
              data={cart}
              stylesButtonCheckout={{ title: 'Thanh toán', fullWidth: true, size: 'md', radius: 'sm' }}
            />
          </Flex>
        ) : (
          <Flex gap={0} justify='space-between' wrap={'nowrap'}>
            <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} component='a' href='/gio-hang'>
              Giỏ hàng
            </Button>

            <BButton
              radius={'sm'}
              size='md'
              type='submit'
              loading={loading}
              disabled={paymentMethod === PaymentType.CREDIT_CARD}
              title={'THANH TOÁN'}
            />
          </Flex>
        )}
      </Stack>
    </Card>
  );
};

export default RecapCart;
