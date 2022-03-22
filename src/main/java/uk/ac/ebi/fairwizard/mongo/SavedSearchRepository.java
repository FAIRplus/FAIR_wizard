package uk.ac.ebi.fairwizard.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import uk.ac.ebi.fairwizard.model.SavedSearch;

public interface SavedSearchRepository extends MongoRepository<SavedSearch, String> {

}
