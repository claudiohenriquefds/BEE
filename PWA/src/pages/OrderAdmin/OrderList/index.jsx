import React, { useState, useEffect } from 'react';
import AdminContainer from '../../../components/AdminContainer';
import ButtonsListAdmin from '../../../components/ButtonsListAdmin';
import LoadingPageAdmin from '../../../components/LoadingPageAdmin';
import PaginationAdmin from '../../../components/PaginationAdmin';
import TableListAdmin from '../../../components/TableListAdmin';
import OrderAdminApiService from '../../../services/api/OrderAdminApiService';
import orderStatus from '../../../services/utils/orderStatus';

function OrderList(props) {
  const { match } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersFilter, setOrdersFilter] = useState([]);
  const [ordersPerPage, setOrdersPerPage] = useState([]);
  const [actualPage, setActualPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const th = {
    invoice: 'Nº Venda',
    quantity: 'Quant. Produtos',
    value_total: 'Valor total',
    status_order: 'STATUS',
    name_user: 'Usuário',
    selled_date: 'DATA',
  };

  const getOrder = async () => {
    setIsLoading(true);
    try {
      const resp = await OrderAdminApiService.getAll().then((r) => r.data);
      if (resp.success) {
        const formattedOrders = resp.data.map((order) => {
          const selledDate = new Date(order.selled_date).toLocaleDateString(
            'pt-BR',
            {
              timeZone: 'UTC',
            }
          );
          return {
            invoice: ' ',
            ...order,
            value_total: order.value_total
              .toFixed(2)
              .toString()
              .replace('.', ','),
            status_order: orderStatus.convert(order.status_order),
            selled_date: selledDate,
          };
        });
        setOrders(formattedOrders);
      } else {
        throw new Error(`${resp.error.error_message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderFilter = (valueSearch) => {
    const filter = valueSearch || undefined;
    if (filter) {
      const dateFilter = new Date(filter).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });
      const filtered = orders.filter(
        (order) => order.selled_date === dateFilter
      );
      setOrdersFilter(filtered);
    } else {
      setOrdersFilter(-1);
    }
  };

  const getOrdersPerPage = () => {
    const indexMin = (actualPage - 1) * 8;
    const indexMax = indexMin + 8;
    if (ordersFilter !== -1) {
      const productList = ordersFilter.filter(
        (x, index) => index >= indexMin && index < indexMax
      );
      setOrdersPerPage(productList);
      setTotalPages(Math.ceil(ordersFilter.length / 8));
    } else {
      const productList = orders.filter(
        (x, index) => index >= indexMin && index < indexMax
      );
      setOrdersPerPage(productList);
      setTotalPages(Math.ceil(orders.length / 8));
    }
  };

  const handleChangePage = (page) => {
    setActualPage(page);
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    if (match.params.number) {
      setActualPage(Number(match.params.number));
    }
    getOrdersPerPage();
  }, [orders, ordersFilter, actualPage, totalPages]);

  return (
    <AdminContainer link="vendas">
      <ButtonsListAdmin funcFilter={getOrderFilter} filterType="date" />
      {isLoading ? (
        <LoadingPageAdmin />
      ) : (
        <TableListAdmin
          itens={ordersPerPage}
          tableHead={th}
          linkEdit="/admin/vendas"
        />
      )}
      <PaginationAdmin
        totalPages={totalPages}
        actualPage={actualPage}
        changePage={handleChangePage}
        baseUrl="/admin/vendas"
      />
    </AdminContainer>
  );
}

export default OrderList;
