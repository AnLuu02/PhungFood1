'use client';
import PageSizeSelector from '@/app/_components/Admin/Perpage';
import LoadingComponent from '@/app/_components/Loading';
import CustomPagination from '@/app/_components/Pagination';
import { api } from '@/trpc/react';
import { Button, Checkbox, Group, Menu, Table, Text } from '@mantine/core';
import { PaymentType } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { DeletePaymentButton, UpdatePaymentButton } from '../Button';

export default function TablePayment({
  currentPage,
  query,
  limit
}: {
  currentPage: string;
  query: string;
  limit: string;
}) {
  const { data: result, isLoading } = api.Payment.find.useQuery({ skip: +currentPage, take: +limit, query });
  const currentItems = result?.payments || [];
  const columns: ColumnDef<any>[] = [
    {
      header: 'Tên',
      accessorKey: 'name'
    },
    {
      header: 'Hình thức',
      accessorKey: 'type',
      cell: info => <Text>{info.row.original.type === PaymentType.CREDIT_CARD ? 'Thẻ tín dụng' : 'Ví điện tử'}</Text>
    },
    {
      header: 'Nhà cung cấp',
      accessorKey: 'provider'
    },
    {
      header: 'Phương thức mặc định',
      accessorKey: 'isDefault',
      cell: info => <Text>{info.row.original.isDefault ? 'Có' : 'Không'}</Text>
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: info => (
        <Group className='text-center'>
          <UpdatePaymentButton id={info.row.original.id} />
          <DeletePaymentButton id={info.row.original.id} />
        </Group>
      )
    }
  ];

  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useReactTable({
    data: currentItems,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  });
  return isLoading ? (
    <LoadingComponent />
  ) : (
    <>
      <Group pb={'lg'}>
        <Menu shadow='md' width={220}>
          <Menu.Target>
            <Button variant='outline'>Tùy chỉnh bảng</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={table.getToggleAllColumnsVisibilityHandler()}>
              <Checkbox
                label='Tất cả'
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />
            </Menu.Item>
            {table.getAllLeafColumns().map(column => (
              <Menu.Item key={column.id} onClick={column.getToggleVisibilityHandler()}>
                <Checkbox
                  label={column.id}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {currentItems.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Table.Td key={cell.id}>
                    <Text size='sm'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className='bg-gray-100 text-center'>
                <Text size='md' color='dimmed'>
                  Không có bản ghi phù hợp./
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={result?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
