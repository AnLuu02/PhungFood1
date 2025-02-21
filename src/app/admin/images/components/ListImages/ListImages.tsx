'use client';
import PageSizeSelector from '@/app/_components/Admin/Perpage';
import LoadingComponent from '@/app/_components/Loading';
import CustomPagination from '@/app/_components/Pagination';
import { firebaseToFile } from '@/app/lib/utils/func-handler/handle-file-upload';
import { api } from '@/trpc/react';
import { Badge, Grid, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { PhotoCard } from '../PhotoCard';

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
export default function TableImage({
  currentPage,
  query,
  limit
}: {
  currentPage: string;
  query: string;
  limit: string;
}) {
  const { data: result, isLoading } = api.Image.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.images || [];
  const [imageUrls, setImageUrls] = useState<any[]>([]);
  const [showfullImage, setShowfullImage] = useState<any>('');

  // const imgUser = currentItems.filter(img => img.entityType === EntityType.USER);
  // const imgProduct = currentItems.filter(img => img.entityType === EntityType.PRODUCT);
  // const imgSubCategory = currentItems.filter(img => img.entityType === EntityType.CATEGORY);

  // const formatData = new Map();
  // formatData.set(EntityType.USER, imgUser);

  useEffect(() => {
    const loadImages = async () => {
      if (!Array.isArray(currentItems)) return;

      const urls = await Promise.all(
        currentItems.map(async image => {
          try {
            const file = await firebaseToFile(image.url);

            // Kiểm tra nếu file là Blob thì mới tạo Object URL
            if (file instanceof Blob) {
              return {
                ...image,
                url: file
              };
            } else {
              console.error('getImage không trả về Blob', file);
              return {
                ...image
              };
            }
          } catch (error) {
            console.error('Lỗi khi tải ảnh:', error);
            return image.url; // Trả về URL gốc nếu lỗi
          }
        })
      );

      setImageUrls(urls);
    };

    loadImages();
  }, [currentItems]);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <>
      {imageUrls.length > 0 ? (
        <Grid>
          {imageUrls.map((image, index) => (
            <Grid.Col key={image.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <PhotoCard
                id={image.id}
                name={image.altText || 'No Name'}
                file={image.url}
                postingDate={image.postingDate || new Date()}
                onOpened={({ id, name, file, dimensions, postingDate }) =>
                  setShowfullImage({ id, name, file, dimensions, postingDate })
                }
              />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <h1>Hiện tại chưa có ảnh</h1>
      )}
      <Modal opened={showfullImage?.file} onClose={() => setShowfullImage({})} size='xl' centered>
        <Image
          src={(showfullImage.file && URL.createObjectURL(showfullImage.file)) || '/placeholder.svg'}
          alt={showfullImage.name || ''}
          fit='contain'
          height={400}
        />
        <Stack mt='md' gap='xs'>
          <Text size='lg' fw={700}>
            {showfullImage?.name || ''}
          </Text>
          <Text size='sm'>Dung lượng: {formatBytes(showfullImage?.file?.size || 0)}</Text>
          <Badge color='blue'>
            Kích thước: {showfullImage?.dimensions?.width || 0}x{showfullImage?.dimensions?.height || 0} pixels
          </Badge>
          <Text size='sm'>Tải lên ngày: {new Date().toLocaleDateString()}</Text>
        </Stack>
      </Modal>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={result?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
