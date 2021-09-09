package uk.ac.ebi.fairwizard.jpa;

import org.springframework.data.repository.CrudRepository;
import uk.ac.ebi.fairwizard.model.SavedSearch;

public interface SavedSearchRepository extends CrudRepository<SavedSearch, String> {
    SavedSearch findByPermaLink(String permaLink);
}
