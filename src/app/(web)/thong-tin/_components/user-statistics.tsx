'use client';

import LoadingComponent from '@/app/_components/Loading';
import { formatPriceLocaleVi } from '@/app/lib/utils/format/formatPrice';
import { api } from '@/trpc/react';
import { Box, Card, Center, Flex, Group, Progress, Select, Space, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockYearlySpending = {
  '2025': 3280,
  '2024': 2800,
  '2023': 2500
};
const months = [
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 0 },
  { month: 'Mar', amount: 0 },
  { month: 'Apr', amount: 0 },
  { month: 'May', amount: 0 },
  { month: 'Jun', amount: 0 },
  { month: 'Jul', amount: 0 },
  { month: 'Aug', amount: 0 },
  { month: 'Sep', amount: 0 },
  { month: 'Oct', amount: 0 },
  { month: 'Nov', amount: 0 },
  { month: 'Dec', amount: 0 }
];
export const orderCompletionRate = 85; // 85%

export const vipLevels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
export const userVIPLevel = 'Gold';

export default function UserStatistics() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const { data: user } = useSession();
  const { data: revenue, isLoading } = api.Revenue.getOneUserMonthlySpending.useQuery({
    userId: user?.user?.id || '',
    year: Number(selectedYear) || 2025
  });

  const mockSpendingData = months.map(item => ({
    ...item,
    amount: revenue?.find((spend: any) => spend.month === months.indexOf(item) + 1)?.totalSpent || 0
  }));

  const getVIPProgress = () => {
    const index = vipLevels.indexOf(userVIPLevel);
    return ((index + 1) / vipLevels.length) * 100;
  };
  const totalSpent = revenue?.reduce((total, item) => total + Number(item?.totalSpent || 0), 0) || 0;

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Stack gap='md'>
        <Box>
          <Text fw={700} mb='xs' size='xl'>
            Tổng quan chi tiêu
          </Text>
          <Flex align={'center'} justify={'space-between'} mb='xl'>
            <Select
              value={selectedYear}
              onChange={value => setSelectedYear(value || '2023')}
              data={Object.keys(mockYearlySpending).map(year => ({ value: year, label: year }))}
              style={{ width: 120 }}
            />
            <Text size='xl' fw={700}>
              <Center>
                Đã chi:
                <Space w={'xs'} />
                <b className='text-red-500'>{formatPriceLocaleVi(totalSpent)}</b>
              </Center>
            </Text>
          </Flex>
          <Box style={{ height: 200 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={mockSpendingData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis dataKey={'amount'} />
                <Tooltip />
                <Line type='monotone' dataKey='amount' stroke='#8884d8' />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box>
          <Text fw={700} mb='xs'>
            Tỷ lệ hoàn thành đơn hàng
          </Text>
          <Progress value={orderCompletionRate} size='xl' radius='xl' />
          <Text size='sm' color='dimmed' mt='xs'>
            {orderCompletionRate}% đơn đặt hàng của bạn đã được hoàn thành thành công
          </Text>
        </Box>

        <Box>
          <Text fw={700} mb='xs'>
            Cấp V.I.P: {userVIPLevel}
          </Text>
          <Progress value={getVIPProgress()} size='xl' radius='xl' />
          <Group mt='xs'>
            {vipLevels.map(level => (
              <Text key={level} size='sm' color='dimmed'>
                {level}
              </Text>
            ))}
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
