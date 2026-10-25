package shoptracker;

import java.time.LocalDate;

/** The three cards on the Home screen. Profit is calculated, never stored. */
public record DailySummary(LocalDate date, long sales, long expenses) {
    public long profit() { return sales - expenses; }
}
