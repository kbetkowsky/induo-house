import Link from 'next/link';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';

const FOOTER_GROUPS = [
  {
    title: 'Oferty',
    links: [
      { href: '/properties?transactionType=SALE', label: 'Na sprzedaż' },
      { href: '/properties?transactionType=RENT', label: 'Do wynajęcia' },
      { href: '/properties?propertyType=APARTMENT', label: 'Mieszkania' },
      { href: '/properties?propertyType=HOUSE', label: 'Domy' },
    ],
  },
  {
    title: 'Konto',
    links: [
      { href: '/login', label: 'Logowanie' },
      { href: '/register', label: 'Rejestracja' },
      { href: '/dashboard', label: 'Panel użytkownika' },
      { href: '/favorites', label: 'Ulubione' },
    ],
  },
  {
    title: 'InduoHouse',
    links: [
      { href: '/', label: 'Strona główna' },
      { href: '/properties/create', label: 'Dodaj ogłoszenie' },
      { href: '/properties', label: 'Katalog ofert' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-logo">
            <span>
              <Building2 size={21} />
            </span>
            InduoHouse
          </Link>
          <p>
            Nowoczesny katalog nieruchomości dla osób, które chcą szybko porównać
            mieszkania, domy i działki bez informacyjnego bałaganu.
          </p>
          <div className="site-footer-contact">
            <span><MapPin size={15} /> Kraków, Polska</span>
            <span><Mail size={15} /> kontakt@induohouse.pl</span>
            <span><Phone size={15} /> +48 000 000 000</span>
          </div>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.title} className="site-footer-group">
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} InduoHouse</span>
        <span>Nieruchomości w czytelnej formie</span>
      </div>
    </footer>
  );
}
