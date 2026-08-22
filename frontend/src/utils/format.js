export function fmtMoney(n) {
  const num = Number(n) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function fmtDateFull(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysBetween(a, b) {
  if (!a || !b) return 1;
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

export function addDays(d, n) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

export function initials(name) {
  if (!name) return 'GT';
  return name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function cityCode(name) {
  if (!name) return '—';
  const map = {
    Ahmedabad: 'AMD',
    Mumbai: 'BOM',
    Delhi: 'DEL',
    Jaipur: 'JAI',
    Udaipur: 'UDR',
    Goa: 'GOI',
    Dubai: 'DXB',
    Paris: 'PAR',
    London: 'LON',
    Tokyo: 'TYO',
    Kyoto: 'KYO',
    Amsterdam: 'AMS',
    Bali: 'DPS',
    Singapore: 'SIN',
    Rome: 'FCO',
    Barcelona: 'BCN',
    'New York': 'NYC',
  };
  return map[name] || name.slice(0, 3).toUpperCase();
}
