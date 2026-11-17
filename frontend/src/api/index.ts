import { api } from './client';
import type {
  CreateExpenseRequest,
  CreateProductRequest,
  CreateSaleRequest,
  Expense,
  Product,
  Sale,
  SalesByDay,
  Summary,
} from './types';

export function getHealth(): Promise<{ status: string }> {
  return api.get('/api/health');
}

export function getProducts(): Promise<Product[]> {
  return api.get('/api/products');
}

export function getLowStockProducts(): Promise<Product[]> {
  return api.get('/api/products/low-stock');
}

export function createProduct(body: CreateProductRequest): Promise<Product> {
  return api.post('/api/products', body);
}

export function getSales(): Promise<Sale[]> {
  return api.get('/api/sales');
}

export function getSalesByDay(): Promise<SalesByDay[]> {
  return api.get('/api/sales/by-day');
}

export function createSale(body: CreateSaleRequest): Promise<Sale> {
  return api.post('/api/sales', body);
}

export function getExpenses(): Promise<Expense[]> {
  return api.get('/api/expenses');
}

export function createExpense(body: CreateExpenseRequest): Promise<Expense> {
  return api.post('/api/expenses', body);
}

export function getSummary(date?: string): Promise<Summary> {
  const query = date ? `?date=${date}` : '';
  return api.get(`/api/summary${query}`);
}

export function getWeeklySummary(date?: string): Promise<Summary[]> {
  const query = date ? `?date=${date}` : '';
  return api.get(`/api/summary/weekly${query}`);
}
