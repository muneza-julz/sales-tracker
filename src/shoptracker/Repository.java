package shoptracker;

import java.util.List;
import java.util.Optional;

/** Generic repository: T must be an Entity whose key type is ID (bounded generics). */
public interface Repository<T extends Entity<ID>, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    boolean deleteById(ID id);
}
