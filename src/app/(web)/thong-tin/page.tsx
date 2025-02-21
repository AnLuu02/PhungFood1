import { Box } from '@mantine/core';
import DashboardContent from './_components/dashboard-content';

export default async function ProfilePage() {
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <DashboardContent />
    </Box>
  );
}
