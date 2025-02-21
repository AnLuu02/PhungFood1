'use client';

import InvoiceToPrint from '@/app/_components/Invoices/InvoceToPrint';
import { handleDelete } from '@/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { handleConfirm } from '@/app/lib/utils/button-handle/ButtonHandleConfirm';
import { NotifyError, NotifySuccess } from '@/app/lib/utils/func-handler/toast';
import { api } from '@/trpc/react';
import { ActionIcon, Button, Group, Modal, Title, Tooltip } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconCircleCheck, IconEdit, IconPlus, IconPrinter, IconTrash, IconXboxX } from '@tabler/icons-react';
import { useState } from 'react';
import CreateOrder from './form/CreateOrder';
import UpdateOrder from './form/UpdateOrder';

export function CreateOrderButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title={<Title order={2}>Tạo hóa đơn</Title>}>
        <CreateOrder setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function SendOrderButton({ order }: any) {
  const [loading, setLoading] = useState(false);
  const sendTestEmail = async () => {
    setLoading(true);
    const res = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order?.user?.email || 'anluu0099@gmail.com',
        invoiceData: order
      })
    });

    const data = await res.json();
    if (data?.success) {
      NotifySuccess('Thành công!', 'Gửi hóa đơn thành công! ');
      setLoading(false);
    } else {
      NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        leftSection={<IconPrinter size={16} />}
        color='green.9'
        variant='outline'
        loading={loading}
        onClick={() => {
          sendTestEmail();
        }}
      >
        Gửi hóa đơn
      </Button>
    </>
  );
}
export function PrintOrderButton({ order }: any) {
  const [loading, setLoading] = useState(false);
  const sendTestEmail = async () => {
    setLoading(true);
    const res = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order?.user?.email || 'anluu0099@gmail.com',
        invoiceData: order
      })
    });

    const data = await res.json();
    if (data?.success) {
      NotifySuccess('Thành công!', 'Gửi hóa đơn thành công! ');
      setLoading(false);
    } else {
      NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        leftSection={<IconPrinter size={16} />}
        color='green.9'
        variant='outline'
        loading={loading}
        onClick={() => {
          sendTestEmail();
        }}
      >
        Gửi hóa đơn
      </Button>
    </>
  );
}
export function UpdateOrderButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group gap={'xs'}>
            <Title order={2}>Cập nhật hóa đơn</Title>
            <InvoiceToPrint id={id} />
          </Group>
        }
      >
        <UpdateOrder orderId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteOrderButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Order.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'hóa đơn', () => {
            untils.Order.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}

export function SuccessOrderButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const mutation = api.Order.update.useMutation();

  return (
    <>
      <Tooltip label='Hoàn thành đơn hàng'>
        <ActionIcon
          variant='subtle'
          onClick={() => {
            handleConfirm(
              id,
              mutation,
              {
                where: {
                  id: id
                },
                data: {
                  status: OrderStatus.COMPLETED
                }
              },
              'Hoàn thành đơn hàng',
              'Bạn chắc chắn muốn hoàn thành đơn hàng này?',
              () => {
                untils.Order.invalidate();
              }
            );
          }}
        >
          <IconCircleCheck size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function CancleOrderButton({ id, formData }: { id: string; formData: any }) {
  const untils = api.useUtils();
  const mutation = api.Order.update.useMutation();

  return (
    <>
      <Tooltip label='Hủy đơn hàng'>
        <ActionIcon
          variant='subtle'
          color='red'
          onClick={() => {
            handleConfirm(id, mutation, formData, 'Hủy  đơn hàng', 'Bạn chắc chắn muốn hủy đơn hàng này?', () => {
              untils.Order.invalidate();
            });
          }}
        >
          <IconXboxX size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
