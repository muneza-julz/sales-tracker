package shoptracker;

import java.time.LocalDateTime;

/** Base class for money moving in (Sale) or out (Expense). Subclasses define amount(). */
public abstract class Transaction implements Entity<Long> {
    private final Long id;
    private final LocalDateTime timestamp;

    protected Transaction(Long id, LocalDateTime timestamp) {
        this.id = id;
        this.timestamp = timestamp;
    }

    public abstract long amount();     // polymorphism: each subclass calculates differently
    public abstract String label();

    @Override public Long getId() { return id; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
