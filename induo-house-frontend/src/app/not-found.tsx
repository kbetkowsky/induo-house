import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <section className="container panel empty">
        <h2>Nie znaleziono strony</h2>
        <p>Ten adres nie prowadzi do żadnego widoku w InduoHouse.</p>
        <Link href="/" className="btn-primary">Wróć na start</Link>
      </section>
    </main>
  );
}
