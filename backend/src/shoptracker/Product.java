package shoptracker;

/** Fields come from the Add Product form: name, category, cost price, selling price, stock. */
public class Product implements Entity<Long> {
    public static final int LOW_STOCK_THRESHOLD = 5;   // Milk with 5 left is flagged in the design

    private final Long id;
    private String name;
    private String category;
    private long costPrice;      // RWF has no decimals, so long is enough
    private long sellingPrice;
    private int stock;

    public Product(Long id, String name, String category, long costPrice, long sellingPrice, int stock) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Product name is required");
        if (costPrice < 0 || sellingPrice < 0) throw new IllegalArgumentException("Prices cannot be negative");
        if (stock < 0) throw new IllegalArgumentException("Stock cannot be negative");
        this.id = id;
        this.name = name.trim();
        this.category = category;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.stock = stock;
    }

    public boolean isLowStock() { return stock <= LOW_STOCK_THRESHOLD; }

    public void removeStock(int quantity) {
        if (quantity > stock) throw new InsufficientStockException(name, stock, quantity);
        stock -= quantity;
    }

    public void addStock(int quantity) { stock += quantity; }

    @Override public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public long getCostPrice() { return costPrice; }
    public long getSellingPrice() { return sellingPrice; }
    public int getStock() { return stock; }
    public void setSellingPrice(long price) { this.sellingPrice = price; }
}
