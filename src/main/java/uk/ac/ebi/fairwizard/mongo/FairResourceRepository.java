package uk.ac.ebi.fairwizard.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import uk.ac.ebi.fairwizard.model.MongoFairResource;

import java.util.List;

public interface FairResourceRepository extends MongoRepository<MongoFairResource, String> {

  @Query("{ 'labels' : {$all : [?0] }}")
  List<MongoFairResource> findAllLabledResources(List<String> lables);

  @Query("{ 'labels' : {$in : ?0 }}")
  List<MongoFairResource> findLabledResources(List<String> lables);

  @Query("{ 'useCases' : {$in : ?0 }}")
  List<MongoFairResource> findLabledResourcesForUseCases(List<String> useCases);
}
