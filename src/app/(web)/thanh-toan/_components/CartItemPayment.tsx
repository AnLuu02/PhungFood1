import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { Badge, Box, Group, Image, Text } from '@mantine/core';

export default function CartItemPayment({ item, index }: any) {
  return (
    <>
      <Group key={item.id} wrap='nowrap'>
        <Box pos='relative'>
          <Image
            loading='lazy'
            src={item?.thumbnail || '/images/jpg/empty-300x240.jpg'}
            w={60}
            h={60}
            radius='md'
            alt={item.name}
          />
          <Badge className='absolute -right-2 -top-2 bg-blue-500' radius='xl' size='sm'>
            {item.quantity}
          </Badge>
        </Box>
        <div className='flex-1'>
          <Text size='sm' fw={700}>
            {item.name}
          </Text>
          <Text size='xs' c='dimmed'>
            Ghi chú: {item.note || 'Không có'}
          </Text>
        </div>
        <Text className='text-right' fw={700}>
          {formatPriceLocaleVi(item.price * item.quantity)}
        </Text>
      </Group>
    </>
  );
}
