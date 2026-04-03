/**
 * Format a number as Indian Rupees (INR)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get month name from date string
 */
export function getMonthName(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/**
 * Get short month name
 */
export function getShortMonth(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { month: 'short' });
}

/**
 * Export transactions to CSV
 */
export function exportToCSV(transactions) {
  const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount (₹)'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.merchant}"`,
    t.category,
    t.type,
    t.amount,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
