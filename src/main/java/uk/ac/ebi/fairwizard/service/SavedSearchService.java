package uk.ac.ebi.fairwizard.service;

import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.model.FairSolution;
import uk.ac.ebi.fairwizard.model.SavedSearch;
import uk.ac.ebi.fairwizard.mongo.FairSolutionRepository;
import uk.ac.ebi.fairwizard.mongo.SavedSearchRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class SavedSearchService {
  private final SavedSearchRepository savedSearchRepository;
  private final FairSolutionRepository fairSolutionRepository;

  public SavedSearchService(SavedSearchRepository savedSearchRepository,
                            FairSolutionRepository fairSolutionRepository) {
    this.savedSearchRepository = savedSearchRepository;
    this.fairSolutionRepository = fairSolutionRepository;
  }

  public Optional<SavedSearch> getSavedSearches(String searchId) {
    return savedSearchRepository.findById(searchId);
  }

  public SavedSearch saveSearch(SavedSearch savedSearch) {
    String searchHash = UUID.randomUUID().toString(); //todo generate a hash from filters, reuse?
    String createDate =
      savedSearch.getCreateDate() != null? savedSearch.getCreateDate() : LocalDateTime.now().toString();
    return savedSearchRepository.save(new SavedSearch(searchHash, savedSearch.getResourceLink(), createDate));
  }

  public FairSolution saveSolution(FairSolution fairSolution) {
    return fairSolutionRepository.save(fairSolution);
  }

  public Optional<FairSolution> getSavedSolution(String id) {
    return fairSolutionRepository.findById(id );
  }
}
