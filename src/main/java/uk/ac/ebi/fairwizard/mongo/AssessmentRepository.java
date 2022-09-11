package uk.ac.ebi.fairwizard.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import uk.ac.ebi.fairwizard.model.IndicatorGroup;

public interface AssessmentRepository extends MongoRepository<IndicatorGroup, String> {

}
