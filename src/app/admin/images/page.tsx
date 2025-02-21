import Search from '@/app/_components/Admin/Search';
import { api } from '@/trpc/server';
import { Card, Group, Text, Title } from '@mantine/core';
import { CreateImageButton } from './components/Button';
import TableImage from './components/ListImages/ListImages';

export default async function ImageManagementPage({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
    limit?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const totalData = await api.Image.getAll();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý ảnh
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <Search />
          <CreateImageButton />
        </Group>
      </Group>

      <TableImage currentPage={currentPage} query={query} limit={limit} />
    </Card>
  );
}
