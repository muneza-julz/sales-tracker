package shoptracker.api;

import shoptracker.DailySummary;
import shoptracker.Expense;
import shoptracker.ExpenseCategory;
import shoptracker.PaymentMethod;
import shoptracker.Product;
import shoptracker.Sale;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public final class ApiModels {
    private ApiModels() {
    }

    public record ErrorDto(String error) {
    }

    public record ProductDto(Long id, String name, String category, long costPrice, long sellingPrice,
                             int stock, boolean lowStock) {
        public static ProductDto from(Product product) {
            return new ProductDto(product.getId(), product.getName(), product.getCategory(),
                    product.getCostPrice(), product.getSellingPrice(), product.getStock(), product.isLowStock());
        }

        public static List<ProductDto> fromAll(List<Product> products) {
            return products.stream().map(ProductDto::from).toList();
        }
    }

    public record SaleDto(Long id, LocalDateTime timestamp, long productId, String productName,
                          int quantity, long unitPrice, long amount, long grossProfit, String label,
                          PaymentMethod paymentMethod) {
        public static SaleDto from(Sale sale) {
            return new SaleDto(sale.getId(), sale.getTimestamp(), sale.getProductId(), sale.getProductName(),
                    sale.getQuantity(), sale.getUnitPrice(), sale.amount(), sale.grossProfit(), sale.label(),
                    sale.getPaymentMethod());
        }

        public static List<SaleDto> fromAll(List<Sale> sales) {
            return sales.stream().map(SaleDto::from).toList();
        }
    }

    public record SalesByDayDto(LocalDate date, List<SaleDto> sales) {
    }

    public record ExpenseDto(Long id, LocalDateTime timestamp, String title, long amount,
                             ExpenseCategory category, String label) {
        public static ExpenseDto from(Expense expense) {
            return new ExpenseDto(expense.getId(), expense.getTimestamp(), expense.label(), expense.amount(),
                    expense.getCategory(), expense.label());
        }

        public static List<ExpenseDto> fromAll(List<Expense> expenses) {
            return expenses.stream().map(ExpenseDto::from).toList();
        }
    }

    public record SummaryDto(LocalDate date, long sales, long expenses, long profit) {
        public static SummaryDto from(DailySummary summary) {
            return new SummaryDto(summary.date(), summary.sales(), summary.expenses(), summary.profit());
        }

        public static List<SummaryDto> fromAll(Collection<DailySummary> summaries) {
            return summaries.stream().map(SummaryDto::from).toList();
        }
    }

    public record CreateProductRequest(String name, String category, Long costPrice, Long sellingPrice,
                                       Integer stock) {
    }

    public record CreateSaleRequest(Long productId, Integer quantity, PaymentMethod paymentMethod,
                                    LocalDateTime timestamp) {
    }

    public record CreateExpenseRequest(String title, Long amount, ExpenseCategory category,
                                       LocalDateTime timestamp) {
    }
}
