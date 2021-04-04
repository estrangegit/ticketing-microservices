const Orders = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td className='text-center'>{order.ticket.title}</td>
        <td className='text-center'>{order.ticket.price}</td>
        <td className='text-center'>{order.status}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1 className='text-center'>Orders</h1>
      <table className='table table-striped'>
        <thead className='thead-light'>
          <tr>
            <th scope='col' className='text-center'>
              Title
            </th>
            <th scope='col' className='text-center'>
              Price
            </th>
            <th scope='col' className='text-center'>
              Status
            </th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

Orders.getInitialProps = async (client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default Orders;
