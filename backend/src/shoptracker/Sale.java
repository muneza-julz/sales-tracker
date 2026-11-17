package shoptracker;

import java.time.LocalDateTime;

/**
 * One line on the Sales screen, e.g. "Sugar x2  4,000 RWF  08:02 PM".
 * unitPrice is copied from the product at the moment of sale, so changing a
 * product's price later never rewrites past sales.
 */
public class Sale extends Transaction {
    private final long productId;
    private final String productName;
    private final int quantity;
    private final long unitPrice;
    private final long unitCost;
    private final PaymentMethod paymentMethod;

    public Sale(Long id, LocalDateTime when, Product product, int quantity, PaymentMethod paymentMethod) {
        super(id, when);
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be at least 1");
        this.productId = product.getId();
        this.productName = product.getName();
        this.quantity = quantity;
        this.unitPrice = product.getSellingPrice();
        this.unitCost = product.getCostPrice();
        this.paymentMethod = paymentMethod;
    }

    @Override public long amount() { return unitPrice * quantity; }
    @Override public String label() { return productName + " x" + quantity; }
    public long grossProfit() { return (unitPrice - unitCost) * quantity; }

    public long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public long getUnitPrice() { return unitPrice; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
}
