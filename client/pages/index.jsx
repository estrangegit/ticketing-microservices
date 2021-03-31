import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td className='text-center'>{ticket.title}</td>
        <td className='text-center'>{ticket.price}</td>
        <td className='text-center'>
          <Link
            href='/tickets/[ticketId]'
            as={`/tickets/${encodeURIComponent(ticket.id)}`}
          >
            <a>view</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1 className='text-center'>Tickets</h1>
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
              Link
            </th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (client, context, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
