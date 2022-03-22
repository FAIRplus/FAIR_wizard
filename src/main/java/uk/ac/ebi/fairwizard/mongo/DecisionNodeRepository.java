package uk.ac.ebi.fairwizard.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import uk.ac.ebi.fairwizard.model.DecisionNode;

public interface DecisionNodeRepository extends MongoRepository<DecisionNode, String> {

}
