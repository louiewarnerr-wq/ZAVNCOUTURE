import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section">
      <div className="badge">404</div>
      <h1 className="h1" style={{marginTop: 14}}>Page not found</h1>
      <p className="p">The page you’re looking for doesn’t exist.</p>
      <div style={{marginTop: 18, display:"flex", gap:12, flexWrap:"wrap"}}>
        <Link className="btn" href="/">Go home</Link>
        <Link className="btn secondary" href="/shop">Shop</Link>
      </div>
    </div>
  );
}
