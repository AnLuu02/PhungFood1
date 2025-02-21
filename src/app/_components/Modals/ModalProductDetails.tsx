'use client';

import BButton from '@/app/_components/Button';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { NotifySuccess } from '@/app/lib/utils/func-handler/toast';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Modal,
  NumberInput,
  Paper,
  Rating,
  ScrollAreaAutosize,
  Select,
  Spoiler,
  Stack,
  Text
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconBrandFacebook,
  IconBrandPinterest,
  IconBrandTwitter,
  IconBrandYoutube,
  IconMail,
  IconX
} from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ModalProductDetails({ type, product, opened, close }: { type: any; product: any; opened: any; close: any }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [currentImage, setCurrentImage] = useState('');
  const [showfullImage, setShowfullImage] = useState(false);

  const inStock = product?.availableQuantity - product?.soldQuantity > 0;

  useEffect(() => {
    setQuantity(1);
  }, [product]);
  // if (type !== 'details') return null;

  return (
    <>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        className='animate-fadeBottom'
        opened={opened && type === 'details'}
        radius={'md'}
        onClose={close}
        size='70%'
        h={'max-content'}
        transitionProps={{ transition: 'fade-down', duration: 200 }}
        padding='md'
        withCloseButton={false}
        pos={'relative'}
        styles={{
          header: {},
          content: {
            overflow: 'hidden'
          }
        }}
      >
        <ActionIcon bg={'transparent'} c='black' pos={'absolute'} top={5} right={10} onClick={close}>
          <IconX size={20} />
        </ActionIcon>
        {type === 'details' && (
          <Paper p='md' radius='md'>
            <Grid>
              <GridCol span={5}>
                <Image
                  loading='lazy'
                  src={product?.thumbnail || '/images/temp/xa lach.png'}
                  alt={product?.name}
                  className='cursor-pointer rounded-md object-cover'
                  w={350}
                  h={350}
                  onClick={() => {
                    setCurrentImage(product?.thumbnail);
                    setShowfullImage(true);
                  }}
                />
                <Box>
                  <Carousel
                    w={'100%'}
                    slideSize={{ base: '100%', sm: '50%', md: '25%' }}
                    slideGap={23}
                    h={74}
                    mt={10}
                    dragFree
                    align='start'
                    containScroll='trimSnaps'
                    withControls={false}
                    slidesToScroll={1}
                  >
                    {product?.images?.map((item: any, index: number) => (
                      <Carousel.Slide key={index}>
                        <Card withBorder radius={'sm'}>
                          <Card.Section
                            className='cursor-pointer'
                            onClick={() => {
                              setCurrentImage(item);
                              setShowfullImage(true);
                            }}
                          >
                            <Image
                              loading='lazy'
                              w={'100%'}
                              radius={'sm'}
                              className='border-2 border-[#008b4b] object-cover'
                              h={74}
                              src={
                                item ||
                                'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
                              }
                            />
                          </Card.Section>
                        </Card>
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                </Box>
              </GridCol>

              <GridCol span={7}>
                <Stack gap='md'>
                  <Flex align='center' gap={'xs'}>
                    <Badge bg={inStock ? 'green.9' : 'red'} radius={'sm'}>
                      {inStock ? 'Còn hàng' : 'Hết hàng'}
                    </Badge>
                    <Rating value={product?.rating?.toFixed(1)} readOnly size='sm' color={'yellow.8'} />
                    <Text size='xs' c='dimmed'>
                      Có {product?.total_rating} đánh giá
                    </Text>
                  </Flex>
                  <Link href={`/san-pham/${product?.tag}`} className='no-underline' onClick={close}>
                    <Text
                      fw={700}
                      className='cursor-pointer text-3xl text-black transition-all duration-200 ease-in-out hover:text-[#008b4b]'
                    >
                      {product?.name || 'Súp bông tuyết'}
                    </Text>
                  </Link>

                  <Group gap={5}>
                    <Text c='black' fw={700} size='sm'>
                      Mã sản phẩm:
                    </Text>
                    <Text c='green.9' fw={700} size='sm'>
                      {product?.id || 'asd15as5d465as65d465a16198'}
                    </Text>
                  </Group>

                  <Group>
                    <Group align='end'>
                      {product?.discount && (
                        <Text size='md' c={'dimmed'} td='line-through'>
                          {formatPriceLocaleVi(product?.price) || '0đ'}
                        </Text>
                      )}
                      <Text fw={700} className='text-3xl text-[#f8c144]'>
                        {formatPriceLocaleVi(product?.price - product?.discount) || '0đ'}
                      </Text>
                    </Group>
                    {product?.discount > 0 && (
                      <Badge color='red'>
                        {product?.discount ? `-${formatPriceLocaleVi(product?.discount)} ` : `180.000đ`}
                      </Badge>
                    )}
                  </Group>

                  <Card
                    bg={'gray.1'}
                    radius={'md'}
                    withBorder
                    className='border-0 border-l-2 border-[#008b4b]'
                    p={'xs'}
                    my={'xs'}
                  >
                    <Spoiler maxHeight={60} showLabel='Xem thêm' hideLabel='Ẩn'>
                      <Text size='sm'>
                        {product?.description ||
                          `Có ai đó đã từng nói rằng: “Lý tưởng là những ước mơ cao thượng nhất của con người, rất khó thực hiện nhưng lại có thể thực hiện được và đòi hỏi phải phấn đấu lâu dài, gian khổ, kiên trì…”. Quả thật, trong cuộc sống của chúng ta, lí tưởng cao đẹp có một vai trò vô cùng quan trọng.
`}
                      </Text>
                    </Spoiler>
                  </Card>

                  <Flex align='flex-end' gap={'md'}>
                    <Group gap='xs'>
                      <NumberInput
                        label={
                          <Text size='sm' fw={700}>
                            Số lượng:
                          </Text>
                        }
                        value={quantity}
                        onChange={(value: any) => setQuantity(value)}
                        thousandSeparator=','
                        min={0}
                        max={99}
                        style={{ width: '80px' }}
                      />
                    </Group>
                    <Group gap='xs'>
                      <Select
                        label={
                          <Text size='sm' fw={700}>
                            Kích cỡ:
                          </Text>
                        }
                        placeholder='Pick value'
                        data={['1 người ăn', '2 người ăn', '3 người ăn', '5 người ']}
                      />
                    </Group>
                    <BButton
                      title={'Mua hàng'}
                      size='md'
                      fullWidth
                      radius='sm'
                      onClick={() => {
                        const existingItem = cart.find((item: any) => item.id === product?.id);
                        if (existingItem) {
                          setCart(
                            cart.map((item: any) =>
                              item.id === product?.id ? { ...item, quantity: quantity + existingItem.quantity } : item
                            )
                          );
                        } else {
                          setCart([...cart, { ...product, quantity: quantity }]);
                        }
                        NotifySuccess('Đã thêm vào giỏ hàng', 'Sản phẩm đã được Thêm.');

                        close();
                      }}
                    />
                  </Flex>
                  <Stack gap={5}>
                    <Text c={'dimmed'} size='sm'>
                      Thương hiệu: Phụng Food Việt Nam
                    </Text>
                    <Text c={'dimmed'} size='sm'>
                      Loại sản phẩm: {product?.subCategory?.name || 'Súp bông tuyết'}
                    </Text>
                    <Text c={'dimmed'} size='sm'>
                      Khuyến mãi: <b className='text-red-500'>giảm {formatPriceLocaleVi(product?.discount)}</b>
                    </Text>
                    <Text c={'dimmed'} size='sm'>
                      Đã bán: <b className='text-red-500'>{product?.soldQuantity || 0}</b> sản phẩm
                    </Text>
                  </Stack>
                  <Group gap={5}>
                    <Text c={'dimmed'} size='sm'>
                      Chia sẻ:
                    </Text>
                    <IconBrandFacebook size={16} className='cursor-pointer hover:scale-150 hover:text-[#008b4b]' />
                    <IconBrandPinterest size={16} className='cursor-pointer hover:scale-150 hover:text-[#008b4b]' />
                    <IconBrandTwitter size={16} className='cursor-pointer hover:scale-150 hover:text-[#008b4b]' />
                    <IconBrandYoutube size={16} className='cursor-pointer hover:scale-150 hover:text-[#008b4b]' />
                    <IconMail size={16} className='cursor-pointer hover:scale-150 hover:text-[#008b4b]' />
                  </Group>
                </Stack>
              </GridCol>
            </Grid>
          </Paper>
        )}
      </Modal>
      <Modal size={'xl'} opened={showfullImage} onClose={() => setShowfullImage(false)}>
        <Image loading='lazy' src={currentImage} />
      </Modal>
    </>
  );
}

export default ModalProductDetails;
