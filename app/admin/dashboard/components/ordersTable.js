'use client'

import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Card, Flex, Title, Icon, Badge, Text, Metric, Button, DateRangePicker, SearchSelect, SearchSelectItem, Divider, Select, SelectItem, } from '@tremor/react';
import { AlertCircleIcon, CheckIcon, ClockIcon, LoaderIcon, MoreHorizontalIcon, PackageCheckIcon, SearchIcon, TruckIcon, XCircle  } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import ProductList from '@/components/order/productList';
import { updateStatus } from '../actions';
import { statusTranslator } from '@/utils/orderStatusTranslator';
import dayjs from 'dayjs';

dayjs.extend(require('dayjs/plugin/isBetween'));

const deltaTypes = {
    waiting: { icon: ClockIcon, color: 'gray' },
    "payment-pending": { icon: ClockIcon, color: 'yellow' },
    completed: { icon: CheckIcon, color: 'emerald' },
    shipped: { icon: TruckIcon, color: 'lime' },
    delivered: { icon: PackageCheckIcon, color: 'green' },
    processing: { icon: LoaderIcon, color: 'blue' },
    "canceled": {icon: XCircle , color:'red' },
}

const numberformatter = (number, decimals = 0) =>
    Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(Number(number)).toString();


const filterByCustomer = (customer, data) => {
    return data.filter((item) => item.user.name.toLowerCase().includes(customer.toLowerCase()));
};

const filterByDateRange = (range, data) => {
    return data.filter((item) => dayjs(item.createdAt).isBetween(range.from, range.to, 'day', '[]'));
}

function OrdersTable({ orders }) {
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedDateRange, setSelectedDateRange] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [totalSold, setTotalSold] = useState(0)
    const [total, setTotal] = useState(0)

    const closeModal = () => setIsOpen(false);

    const openModal = () => setIsOpen(true);

    const showOrderDetails = (order) => {
        openModal();
        setSelectedOrder(order);
    }

    useEffect(() => {
        let filteredData = [...orders];

        if (selectedCustomer) {
            filteredData = filterByCustomer(selectedCustomer, filteredData);
        }

        if (selectedDateRange?.from && selectedDateRange?.to) {
            filteredData = filterByDateRange(selectedDateRange, filteredData)
        }

        setFilteredOrders(filteredData)
    }, [orders, selectedCustomer, selectedDateRange]);

    useEffect(() => {
        let qty = 0
        selectedOrder?.order_items?.forEach(item => {
            qty += item.quantity
        });
        setQuantity(qty)
    }, [selectedOrder])

    useEffect(() => {
        let total = 0, total2 = 0
        filteredOrders.forEach((order) => {
            const f = parseFloat(order.total) 
            total += f
            if (order.status == 'completed')
                total2 += f
        })
        setTotal(total2)
        setTotalSold(total)
    }, [filteredOrders])

    return (
        <main className='p-12'>
            <Card>
                <Flex className="mb-4" alignItems="start">
                <div className="truncate">
                        <Text>Faturamento</Text>
                        <Metric className="truncate">{numberformatter(total, 2)}</Metric>
                        <Text className='text-xs'>Apenas dos pedidos Completados</Text>
                    </div>

                    {totalSold > 0 && (
                        <div className="truncate">
                            <Text>Vendas</Text>
                            <Metric className="truncate">{numberformatter(totalSold, 2)}</Metric>
                            <Text className='text-xs'>Total de vendas de todos os pedidos mostrados</Text>
                        </div>
                    )}
                </Flex>

                <Flex className='space-x-0.5' justifyContent='start' alignItems='center'>
                    <Title>Pedidos</Title>
                    <Icon icon={AlertCircleIcon}
                        variant='simple'
                        tooltip='Lista de pedidos dos usuários'
                    />
                </Flex>

                <Flex className='space-x-2 mt-4' justifyContent='evenly'>
                    <SearchSelect className='max-w-full sm:max-w-xs' onValueChange={setSelectedCustomer} placeholder='Buscar usuário...' icon={SearchIcon} value={selectedCustomer}>
                        {orders.reduce((acc, curr) => {
                            if (curr.user.name && !acc.includes(curr.user.name)) {
                                acc.push(curr.user.name)
                            }
                            return acc;
                        }, []).map((name, index) => (
                            <SearchSelectItem key={index} value={name}>
                                {name}
                            </SearchSelectItem>
                        ))}
                    </SearchSelect>
                    <DateRangePicker placeholder='Selecionar período' enableSelect={false} enableClear={true} onValueChange={setSelectedDateRange} />

                </Flex>


                <Table className="mt-6">
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Pedido</TableHeaderCell>
                            <TableHeaderCell className="text-right">Comprador</TableHeaderCell>
                            <TableHeaderCell className="text-right">Contato</TableHeaderCell>
                            <TableHeaderCell className="text-right">Total</TableHeaderCell>
                            <TableHeaderCell className="text-right">Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ação</TableHeaderCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredOrders
                            .map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell className="text-right">{order.user.name}</TableCell>
                                    <TableCell className="text-right">{order.user.email}</TableCell>
                                    <TableCell className="text-right">{numberformatter(order.total, 2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge icon={deltaTypes[order.status].icon} color={deltaTypes[order.status].color}>
                                            {statusTranslator(order.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant='light' icon={MoreHorizontalIcon} iconPosition='right' onClick={() => { showOrderDetails(order) }}>
                                            Detalhes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>

            {selectedOrder && (
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Lista de Produtos e Mudança de Status
                                        </Dialog.Title>
                                        <form action={() => { updateStatus(selectedOrder.id, selectedStatus) }} className='flex gap-6 mt-6'>
                                            <Select onValueChange={setSelectedStatus} placeholder='Selecione o status...'>
                                                {Object.keys(deltaTypes).map((key, index) => (
                                                    <SelectItem key={index} value={key}>
                                                        {statusTranslator(key)}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Button>
                                                Salvar
                                            </Button>
                                        </form>

                                        <Divider />

                                        {selectedOrder.order_items.map((item, index) => (
                                            <ProductList
                                                key={index}
                                                name={item.product.productItem_product.name}
                                                size={item.product.size}
                                                price={item.price}
                                                quantity={item.quantity}
                                                productId={item.product.product_id}
                                            />
                                        ))
                                        }

                                        <div className='flex gap-4 pt-4 justify-between'>
                                            <div>
                                                <p className='font-bold'>Data e Hora:</p>
                                                <p> - {selectedOrder.createdAt?.toLocaleDateString()}</p>
                                                <p> - {selectedOrder.createdAt?.toLocaleTimeString()}</p>
                                            </div>

                                            <div>
                                                <p className='font-bold'>Total do Pedido:</p>
                                                <p> - R${selectedOrder.total}</p>
                                                <p> - {quantity} unidades</p>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </main>
    );
}

export default OrdersTable;