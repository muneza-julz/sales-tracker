package shoptracker.api;

import shoptracker.ExpenseCategory;
import shoptracker.InMemoryRepository;
import shoptracker.PaymentMethod;
import shoptracker.Product;
import shoptracker.ShopService;

import java.time.LocalDate;

public final class DemoData {
    private DemoData() {
    }

    public static ShopService seed() {
        ShopService shop = new ShopService(
                new InMemoryRepository<>(), new InMemoryRepository<>(), new InMemoryRepository<>());

        Product sugar = shop.addProduct("Sugar", "Groceries", 1500, 2000, 20);
        Product bread = shop.addProduct("Bread", "Bakery", 600, 800, 10);
        Product milk = shop.addProduct("Milk", "Dairy", 800, 1000, 5);
        Product eggs = shop.addProduct("Eggs", "Groceries", 200, 300, 12);

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        shop.recordSale(sugar.getId(), 2, PaymentMethod.CASH, today.atTime(20, 2));
        shop.recordSale(bread.getId(), 1, PaymentMethod.MOBILE_MONEY, today.atTime(9, 2));
        shop.recordSale(eggs.getId(), 1, PaymentMethod.CASH, yesterday.atTime(10, 2));
        shop.addExpense("Taxi to market", 1000, ExpenseCategory.TRANSPORT, today.atTime(7, 30));

        return shop;
    }
}
