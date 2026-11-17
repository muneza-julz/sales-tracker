package shoptracker;

import java.time.LocalDateTime;

/** Fields come from the Add Expenses form: title, amount, category. */
public class Expense extends Transaction {
    private final String title;
    private final long amount;
    private final ExpenseCategory category;

    public Expense(Long id, LocalDateTime when, String title, long amount, ExpenseCategory category) {
        super(id, when);
        if (title == null || title.isBlank()) throw new IllegalArgumentException("Title is required");
        if (amount <= 0) throw new IllegalArgumentException("Amount must be greater than 0");
        this.title = title.trim();
        this.amount = amount;
        this.category = category == null ? ExpenseCategory.OTHERS : category;   // "Others" is the default
    }

    @Override public long amount() { return amount; }
    @Override public String label() { return title; }
    public ExpenseCategory getCategory() { return category; }
}
