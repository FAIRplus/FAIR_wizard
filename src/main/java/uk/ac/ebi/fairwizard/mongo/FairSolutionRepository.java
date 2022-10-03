package uk.ac.ebi.fairwizard.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import uk.ac.ebi.fairwizard.model.FairSolution;

public interface FairSolutionRepository extends MongoRepository<FairSolution, String> {

}
