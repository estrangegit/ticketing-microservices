import { buildTicketsClient } from '../api/build-client';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td className='text-center'>{ticket.title}</td>
        <td className='text-center'>{ticket.price}</td>
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
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, currentUser) => {
  const client = buildTicketsClient(context);
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
