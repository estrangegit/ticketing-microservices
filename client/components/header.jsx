import Link from 'next/link';

const Header = (props) => {
  const links = [
    !props.currentUser && { label: 'Sign up', href: '/auth/signup' },
    !props.currentUser && { label: 'Sign in', href: '/auth/signin' },
    props.currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    props.currentUser && { label: 'My orders', href: '/orders' },
    props.currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li className='nav-item' key={href}>
          <Link href={href}>
            <a className='nav-link'>{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
      <Link href='/'>
        <a className='navbar-brand'>ticketing-dev</a>
      </Link>

      <div
        className='collapse navbar-collapse justify-content-end'
        id='navbarNav'
      >
        <ul className='navbar-nav'>{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
