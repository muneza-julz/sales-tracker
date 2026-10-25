package shoptracker;

/** Anything that can be stored in a Repository. ID is generic so keys could be Long, String, UUID... */
public interface Entity<ID> {
    ID getId();
}
