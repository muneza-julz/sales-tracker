// Mirrors shoptracker.api.ApiModels on the backend.

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY';
export type ExpenseCategory = 'RENT' | 'TRANSPORT' | 'UTILITIES' | 'OTHERS';

export interface Product {
  id: number;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  lowStock: boolean;
}

export interface Sale {
  id: number;
  timestamp: string; // ISO LocalDateTime, e.g. "2026-11-15T14:30:00"
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  grossProfit: number;
  label: string;
  paymentMethod: PaymentMethod;
}

export interface SalesByDay {
  date: string; // ISO LocalDate, e.g. "2026-11-15"
  sales: Sale[];
}

export interface Expense {
  id: number;
  timestamp: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  label: string;
}

export interface Summary {
  date: string;
  sales: number;
  expenses: number;
  profit: number;
}

export interface ApiError {
  error: string;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface CreateSaleRequest {
  productId: number;
  quantity: number;
  paymentMethod: PaymentMethod;
  timestamp?: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  timestamp?: string;
}
