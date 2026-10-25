package shoptracker;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Main {
    public static void main(String[] args) {
        ShopService shop = new ShopService(
                new InMemoryRepository<>(), new InMemoryRepository<>(), new InMemoryRepository<>());

        // Same sample data as the Figma Products screen
        Product sugar = shop.addProduct("Sugar", "Groceries", 1500, 2000, 20);
        Product bread = shop.addProduct("Bread", "Bakery", 600, 800, 10);
        Product milk  = shop.addProduct("Milk", "Dairy", 800, 1000, 5);
        Product eggs  = shop.addProduct("Eggs", "Groceries", 200, 300, 12);

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        shop.recordSale(sugar.getId(), 2, PaymentMethod.CASH, today.atTime(20, 2));
        shop.recordSale(bread.getId(), 1, PaymentMethod.MOBILE_MONEY, today.atTime(9, 2));
        shop.recordSale(eggs.getId(), 1, PaymentMethod.CASH, yesterday.atTime(10, 2));
        shop.addExpense("Taxi to market", 1000, ExpenseCategory.TRANSPORT, today.atTime(7, 30));

        System.out.println("--- Sales screen ---");
        shop.salesGroupedByDay().forEach((day, list) -> {
            System.out.println(day.equals(today) ? "Today" : day.equals(yesterday) ? "Yesterday" : day);
            list.forEach(s -> System.out.printf("  %-10s %,8d RWF  %s%n",
                    s.label(), s.amount(), s.getTimestamp().toLocalTime()));
        });

        DailySummary d = shop.summaryFor(today);
        System.out.println("--- Home cards ---");
        System.out.printf("sales %,d | expenses %,d | profit %,d%n", d.sales(), d.expenses(), d.profit());

        System.out.println("--- Low stock ---");
        shop.lowStockProducts().forEach(p -> System.out.println(p.getName() + " (" + p.getStock() + " left)"));

        System.out.println("--- Overselling ---");
        try {
            shop.recordSale(milk.getId(), 9, PaymentMethod.CASH, LocalDateTime.now());
        } catch (InsufficientStockException e) {
            System.out.println("Rejected: " + e.getMessage());
        }
    }
}
