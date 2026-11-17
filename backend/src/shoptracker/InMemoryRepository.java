package shoptracker;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/** Stores entities in a Map. Later you can swap this for a JPA/database version. */
public class InMemoryRepository<T extends Entity<Long>> implements Repository<T, Long> {
    private final Map<Long, T> store = new LinkedHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public long nextId() { return sequence.incrementAndGet(); }

    @Override public T save(T entity) { store.put(entity.getId(), entity); return entity; }
    @Override public Optional<T> findById(Long id) { return Optional.ofNullable(store.get(id)); }
    @Override public List<T> findAll() { return new ArrayList<>(store.values()); }
    @Override public boolean deleteById(Long id) { return store.remove(id) != null; }
}
