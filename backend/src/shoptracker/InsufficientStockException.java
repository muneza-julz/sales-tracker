package shoptracker;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String product, int available, int requested) {
        super("Not enough " + product + ": " + available + " in stock, " + requested + " requested");
    }
}
