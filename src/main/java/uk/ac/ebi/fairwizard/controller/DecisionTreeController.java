package uk.ac.ebi.fairwizard.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Assessment;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.model.MongoFairResource;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.SavedSearch;
import uk.ac.ebi.fairwizard.service.AssessmentService;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;
import uk.ac.ebi.fairwizard.service.FairResourceService;
import uk.ac.ebi.fairwizard.service.ReportingService;
import uk.ac.ebi.fairwizard.service.SavedSearchService;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class DecisionTreeController {
  private static final Logger LOG = LoggerFactory.getLogger(DecisionTreeController.class);

  private final DecisionTreeService decisionTreeService;
  private final FairResourceService fairResourceService;
  private final AssessmentService assessmentService;
  private final SavedSearchService savedSearchService;

  public DecisionTreeController(DecisionTreeService decisionTreeService,
                                FairResourceService fairResourceService,
                                AssessmentService assessmentService,
                                SavedSearchService savedSearchService) {
    this.decisionTreeService = decisionTreeService;
    this.fairResourceService = fairResourceService;
    this.assessmentService = assessmentService;
    this.savedSearchService = savedSearchService;
  }

  @GetMapping("/version")
  public String getApi() {
    return "{'api': 'v0.0.1'}";
  }

  @GetMapping("/wizard")
  public List<DecisionNode> getDecisionTree() throws ApplicationStatusException {
    return decisionTreeService.getDecisionTree();
  }

  @GetMapping("/search")
  public Set<MongoFairResource> searchResources(@RequestParam(required = false) List<String> filters) {
    LOG.info("Resource search request, filters: {}", filters);
    return fairResourceService.searchResources(filters);
  }

  @GetMapping("/processes")
  public List<ProcessNetworkElement> getProcessNetwork(@RequestParam(required = false) List<String> filters,
                                                       @RequestParam(required = false) String process) {
    Set<MongoFairResource> resources = fairResourceService.searchResources(filters);
    return fairResourceService.populateNetwork(resources);
  }

  @GetMapping("assessment")
  public List<Assessment> getAssessment() throws ApplicationStatusException {
    return assessmentService.getFairAssesment();
  }

  @PostMapping("assessment")
  public String saveAssessment() {
    return "Not implemented";
  }

  @RequestMapping(method = RequestMethod.GET, value = "report", produces = "application/pdf")
  public byte[] getFairReport() {
    ReportingService reportingService = new ReportingService();
    ByteArrayOutputStream out = reportingService.getReportStream();
    return out.toByteArray();
  }

  @GetMapping("permalink/{searchId}")
  public ResponseEntity<Object> getSavedSearches(@PathVariable("searchId") String searchId) {
    return savedSearchService.getSavedSearches(searchId)
                             .map(s -> ResponseEntity.status(HttpStatus.FOUND).location(URI.create(s.getResourceLink()))
                                                     .build())
                             .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping("permalink")
  public ResponseEntity<SavedSearch> saveSearch(@RequestBody SavedSearch savedSearch) {
    return ResponseEntity.ok(savedSearchService.saveSearch(savedSearch));
  }

}
