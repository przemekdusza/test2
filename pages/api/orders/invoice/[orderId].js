// pages/api/orders/invoice/[orderId].js
export default function handler(req, res) {
  const { orderId } = req.query;

  if (req.method === 'GET') {
    // Generuj prostą fakturę tekstową (w prawdziwej aplikacji użyj biblioteki PDF)
    
    const invoiceData = generateInvoiceText(orderId);
    
    // Ustaw nagłówki dla pobrania pliku
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="faktura-${orderId}.txt"`);
    
    res.status(200).send(invoiceData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateInvoiceText(orderId) {
  const currentDate = new Date().toLocaleDateString('pl-PL');
  
  return `
══════════════════════════════════════════
           FAKTURA VAT
══════════════════════════════════════════

Numer faktury: FAK-${orderId}
Data wystawienia: ${currentDate}
Data sprzedaży: ${currentDate}

──────────────────────────────────────────

SPRZEDAWCA:
Sklep z Ręcznikami Sp. z o.o.
ul. Przykładowa 123
00-001 Warszawa
NIP: 1234567890
REGON: 123456789

──────────────────────────────────────────

NABYWCA:
Jan Kowalski
+48123456789
jan@example.com

──────────────────────────────────────────

POZYCJE FAKTURY:

1. Ręcznik Basic 40x80cm
   Ilość: 2 szt
   Cena netto: 40.65 zł
   VAT 23%: 9.34 zł
   Wartość brutto: 49.99 zł

2. Ręcznik Premium 50x90cm  
   Ilość: 1 szt
   Cena netto: 65.04 zł
   VAT 23%: 14.95 zł
   Wartość brutto: 79.99 zł

──────────────────────────────────────────

PODSUMOWANIE:
Wartość netto: 146.34 zł
VAT 23%: 33.63 zł
RAZEM DO ZAPŁATY: 179.97 zł

──────────────────────────────────────────

Sposób płatności: Przelew online
Status: OPŁACONE

Dziękujemy za zakup!
Sklep z Ręcznikami
tel: +48 123 456 789
email: sklep@reczniki.pl

══════════════════════════════════════════
`;
}