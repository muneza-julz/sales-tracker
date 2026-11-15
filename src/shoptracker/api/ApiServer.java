package shoptracker.api;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.javalin.Javalin;
import io.javalin.json.JavalinJackson;
import shoptracker.InsufficientStockException;
import shoptracker.ShopService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

public final class ApiServer {
    private ApiServer() {
    }

    public static void main(String[] args) {
        ShopService shop = DemoData.seed();

        Javalin.create(config -> {
            config.jsonMapper(new JavalinJackson().updateMapper(mapper -> {
                mapper.registerModule(new JavaTimeModule());
                mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            }));
            config.bundledPlugins.enableCors(cors -> cors.addRule(rule -> rule.anyHost()));
            config.routes.exception(NoSuchElementException.class,
                    (e, ctx) -> ctx.status(404).json(new ApiModels.ErrorDto(e.getMessage())));
            config.routes.exception(InsufficientStockException.class,
                    (e, ctx) -> ctx.status(409).json(new ApiModels.ErrorDto(e.getMessage())));
            config.routes.exception(IllegalArgumentException.class,
                    (e, ctx) -> ctx.status(400).json(new ApiModels.ErrorDto(e.getMessage())));
            config.routes.exception(DateTimeParseException.class,
                    (e, ctx) -> ctx.status(400).json(new ApiModels.ErrorDto("Invalid date, expected YYYY-MM-DD")));
            config.routes.exception(NumberFormatException.class,
                    (e, ctx) -> ctx.status(400).json(new ApiModels.ErrorDto("Invalid numeric value")));

            config.routes.get("/api/health", ctx -> ctx.json(Map.of("status", "ok")));

            config.routes.get("/api/products", ctx -> ctx.json(ApiModels.ProductDto.fromAll(shop.allProducts())));
            config.routes.get("/api/products/low-stock",
                    ctx -> ctx.json(ApiModels.ProductDto.fromAll(shop.lowStockProducts())));
            config.routes.post("/api/products", ctx -> {
                ApiModels.CreateProductRequest request = ctx.bodyAsClass(ApiModels.CreateProductRequest.class);
                requireProductRequest(request);
                var product = shop.addProduct(request.name(), request.category(), request.costPrice(),
                        request.sellingPrice(), request.stock());
                ctx.status(201).json(ApiModels.ProductDto.from(product));
            });

            config.routes.get("/api/sales", ctx -> ctx.json(ApiModels.SaleDto.fromAll(shop.allSales())));
            config.routes.get("/api/sales/by-day", ctx -> ctx.json(salesByDay(shop)));
            config.routes.post("/api/sales", ctx -> {
                ApiModels.CreateSaleRequest request = ctx.bodyAsClass(ApiModels.CreateSaleRequest.class);
                requireSaleRequest(request);
                var sale = shop.recordSale(request.productId(), request.quantity(), request.paymentMethod(),
                        request.timestamp() == null ? LocalDateTime.now() : request.timestamp());
                ctx.status(201).json(ApiModels.SaleDto.from(sale));
            });

            config.routes.get("/api/expenses", ctx -> ctx.json(ApiModels.ExpenseDto.fromAll(shop.allExpenses())));
            config.routes.post("/api/expenses", ctx -> {
                ApiModels.CreateExpenseRequest request = ctx.bodyAsClass(ApiModels.CreateExpenseRequest.class);
                requireExpenseRequest(request);
                var expense = shop.addExpense(request.title(), request.amount(), request.category(),
                        request.timestamp() == null ? LocalDateTime.now() : request.timestamp());
                ctx.status(201).json(ApiModels.ExpenseDto.from(expense));
            });

            config.routes.get("/api/summary", ctx -> {
                LocalDate day = parseDate(ctx.queryParam("date"), LocalDate.now());
                ctx.json(ApiModels.SummaryDto.from(shop.summaryFor(day)));
            });
            config.routes.get("/api/summary/weekly", ctx -> {
                LocalDate day = parseDate(ctx.queryParam("date"), LocalDate.now());
                ctx.json(ApiModels.SummaryDto.fromAll(shop.weeklyOverview(day).values()));
            });
        }).start(8080);
    }

    private static List<ApiModels.SalesByDayDto> salesByDay(ShopService shop) {
        return shop.salesGroupedByDay().entrySet().stream()
                .map(entry -> new ApiModels.SalesByDayDto(entry.getKey(),
                        ApiModels.SaleDto.fromAll(entry.getValue())))
                .toList();
    }

    private static LocalDate parseDate(String value, LocalDate fallback) {
        return value == null || value.isBlank() ? fallback : LocalDate.parse(value);
    }

    private static void requireProductRequest(ApiModels.CreateProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (request.costPrice() == null || request.sellingPrice() == null || request.stock() == null) {
            throw new IllegalArgumentException("costPrice, sellingPrice and stock are required");
        }
    }

    private static void requireSaleRequest(ApiModels.CreateSaleRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.productId() == null || request.quantity() == null || request.paymentMethod() == null) {
            throw new IllegalArgumentException("productId, quantity and paymentMethod are required");
        }
    }

    private static void requireExpenseRequest(ApiModels.CreateExpenseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.title() == null || request.title().isBlank() || request.amount() == null) {
            throw new IllegalArgumentException("title and amount are required");
        }
    }
}
