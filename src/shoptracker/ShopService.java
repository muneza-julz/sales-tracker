package shoptracker;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.TreeMap;

/** Business logic behind all five screens. Controllers will call this later. */
public class ShopService {
    private final InMemoryRepository<Product> products;
    private final InMemoryRepository<Sale> sales;
    private final InMemoryRepository<Expense> expenses;

    public ShopService(InMemoryRepository<Product> products,
                       InMemoryRepository<Sale> sales,
                       InMemoryRepository<Expense> expenses) {
        this.products = products;
        this.sales = sales;
        this.expenses = expenses;
    }

    // Add Product screen
    public Product addProduct(String name, String category, long cost, long price, int stock) {
        return products.save(new Product(products.nextId(), name, category, cost, price, stock));
    }

    // Add Sales screen: pick product, quantity, payment method -> SAVE SALE
    public Sale recordSale(long productId, int quantity, PaymentMethod method, LocalDateTime when) {
        Product product = products.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product " + productId + " not found"));
        Sale sale = new Sale(sales.nextId(), when, product, quantity, method);  // validates quantity
        product.removeStock(quantity);                                           // may throw
        products.save(product);
        return sales.save(sale);
    }

    // Add Expenses screen
    public Expense addExpense(String title, long amount, ExpenseCategory category, LocalDateTime when) {
        return expenses.save(new Expense(expenses.nextId(), when, title, amount, category));
    }

    // Products screen: items flagged "Low stock"
    public List<Product> lowStockProducts() {
        return products.findAll().stream().filter(Product::isLowStock).toList();
    }

    // Sales screen: "Today" / "Yesterday" groups, newest day first
    public Map<LocalDate, List<Sale>> salesGroupedByDay() {
        Map<LocalDate, List<Sale>> grouped = new TreeMap<>(Comparator.reverseOrder());
        for (Sale sale : sales.findAll()) {
            grouped.computeIfAbsent(sale.getTimestamp().toLocalDate(), day -> new ArrayList<>()).add(sale);
        }
        Comparator<Sale> newestFirst = Comparator.comparing(Sale::getTimestamp).reversed();
        grouped.values().forEach(list -> list.sort(newestFirst));
        return grouped;
    }

    // Home screen cards
    public DailySummary summaryFor(LocalDate day) {
        return new DailySummary(day, totalFor(sales.findAll(), day), totalFor(expenses.findAll(), day));
    }

    // Home screen weekly chart: Mon..Sun for the week containing 'anyDayInWeek'
    public Map<DayOfWeek, DailySummary> weeklyOverview(LocalDate anyDayInWeek) {
        LocalDate monday = anyDayInWeek.with(DayOfWeek.MONDAY);
        Map<DayOfWeek, DailySummary> week = new EnumMap<>(DayOfWeek.class);
        for (int i = 0; i < 7; i++) {
            LocalDate d = monday.plusDays(i);
            week.put(d.getDayOfWeek(), summaryFor(d));
        }
        return week;
    }

    private static long totalFor(List<? extends Transaction> list, LocalDate day) {
        return list.stream()
                .filter(t -> t.getTimestamp().toLocalDate().equals(day))
                .mapToLong(Transaction::amount)
                .sum();
    }
}
