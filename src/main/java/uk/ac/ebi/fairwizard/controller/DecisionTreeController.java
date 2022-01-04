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
import uk.ac.ebi.fairwizard.jpa.SavedSearchRepository;
import uk.ac.ebi.fairwizard.model.Assessment;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.model.SavedSearch;
import uk.ac.ebi.fairwizard.service.AssessmentService;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;
import uk.ac.ebi.fairwizard.service.ProcessNetworkService;
import uk.ac.ebi.fairwizard.service.RdfNetworkService;
import uk.ac.ebi.fairwizard.service.ReportingService;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api")
public class DecisionTreeController {
  private static final Logger LOG = LoggerFactory.getLogger(DecisionTreeController.class);

  private final DecisionTreeService decisionTreeService;
  private final ProcessNetworkService processNetworkService;
  private final RdfNetworkService rdfNetworkService;
  private final SavedSearchRepository savedSearchRepository;
  private final AssessmentService assessmentService;

  public DecisionTreeController(DecisionTreeService decisionTreeService,
                                ProcessNetworkService processNetworkService,
                                RdfNetworkService rdfNetworkService,
                                AssessmentService assessmentService,
                                SavedSearchRepository savedSearchRepository) {
    this.decisionTreeService = decisionTreeService;
    this.processNetworkService = processNetworkService;
    this.rdfNetworkService = rdfNetworkService;
    this.assessmentService = assessmentService;
    this.savedSearchRepository = savedSearchRepository;
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
  public Set<FairResource> searchResources(@RequestParam(required = false) List<String> filters) {
    LOG.info("Resource search request, filters: {}", filters);
    return rdfNetworkService.searchResources(filters);
  }

  @GetMapping("/processes")
  public List<ProcessNetworkElement> getProcessNetwork(@RequestParam(required = false) List<String> filters,
                                                       @RequestParam(required = false) String process) {

    Set<FairResource> resources = rdfNetworkService.searchResources(filters);
    return rdfNetworkService.populateNetwork(resources);
  }

  @GetMapping("/network")
  public List<ProcessNetworkElement> getNetwork(@RequestParam(required = false) String resourceId) {
    return rdfNetworkService.getResourceNetwork("");
  }

  @GetMapping("assessment")
  public List<Assessment> getAssessment() throws ApplicationStatusException {
    return assessmentService.getFairAssesment();
  }

  @PostMapping("assessment")
  public String saveAssessment() {
    return "Not implemented";
  }

//  @GetMapping("report")
  @RequestMapping(method = RequestMethod.GET, value = "report", produces = "application/pdf")
  public byte[] getFairReport() {
    ReportingService reportingService = new ReportingService();
    ByteArrayOutputStream out = reportingService.getReportStream();
    return out.toByteArray();
  }

  @GetMapping("permalink/{searchId}")
  public ResponseEntity<Void> getSavedSearches(@PathVariable("searchId") String searchId) {
    return ResponseEntity.status(HttpStatus.FOUND)
                         .location(URI.create(savedSearchRepository.findByPermaLink(searchId).getResourceLink()))
                         .build();
  }

  @PostMapping("permalink")
  public ResponseEntity<String> saveSearch(@RequestBody SavedSearch savedSearch) {
    int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999 +
                                                                1); //todo use hash instead of random number. Then look for existing hashes.
    savedSearchRepository.save(new SavedSearch(String.valueOf(randomNum), savedSearch.getResourceLink()));

    return ResponseEntity.ok(String.valueOf(randomNum));
  }

}
