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
import uk.ac.ebi.fairwizard.model.FairProcess;
import uk.ac.ebi.fairwizard.model.FairSolution;
import uk.ac.ebi.fairwizard.model.MongoFairResource;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.SavedSearch;
import uk.ac.ebi.fairwizard.service.AssessmentService;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;
import uk.ac.ebi.fairwizard.service.FairResourceService;
import uk.ac.ebi.fairwizard.service.ReportingService;
import uk.ac.ebi.fairwizard.service.SavedSearchService;

import javax.servlet.ServletContext;
import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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
  private final ReportingService reportingService;
  private ServletContext servletContext;

  public DecisionTreeController(DecisionTreeService decisionTreeService,
                                FairResourceService fairResourceService,
                                AssessmentService assessmentService,
                                SavedSearchService savedSearchService,
                                ReportingService reportingService,
                                ServletContext servletContext) {
    this.decisionTreeService = decisionTreeService;
    this.fairResourceService = fairResourceService;
    this.assessmentService = assessmentService;
    this.savedSearchService = savedSearchService;
    this.reportingService = reportingService;
    this.servletContext = servletContext;
  }

  @GetMapping("/version")
  public String getApi() {
    return "{'api': 'v0.0.1'}";
  }

  @GetMapping("/resource")
  public MongoFairResource getResource(@RequestParam String resourceId) throws ApplicationStatusException {
    resourceId = URLDecoder.decode(resourceId, StandardCharsets.UTF_8); // there are strange characters in resouce IDs
    return fairResourceService.getResource(resourceId);
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

  @PostMapping("/search")
  public FairSolution identifyGoalsFromDecisionTree(@RequestBody List<DecisionNode> decisionTree) {
    return fairResourceService.generateSolutionFromDecisionTree(decisionTree);
  }

  @GetMapping("/processes")
  public List<ProcessNetworkElement> getProcessNetwork(@RequestParam(required = false) List<String> filters,
                                                       @RequestParam(required = false) String process) {
    Set<MongoFairResource> resources = fairResourceService.searchResources(filters);
    return fairResourceService.populateNetwork(resources);
  }

  @GetMapping("/processDiagram1")
  public List<MongoFairResource> getProcessDiagram1(@RequestParam(required = false) List<String> filters) {
    return fairResourceService.getParentProcesses();
  }

  @GetMapping("/processDiagram")
  public List<FairProcess> getProcessDiagram(@RequestParam(required = false) List<String> filters) {
    Set<MongoFairResource> resources = fairResourceService.searchResources(filters);
    return fairResourceService.getProcesses(resources);
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
  public byte[] getFairReport(@RequestParam List<String> answers) throws ApplicationStatusException {
    ByteArrayOutputStream out = reportingService.getReportStream(answers);
    return out.toByteArray();
  }

  @GetMapping("permalink/{searchId}")
  public ResponseEntity<Object> getSavedSearches(@PathVariable("searchId") String searchId) {
    System.out.println(servletContext.getContextPath());
    return savedSearchService.getSavedSearches(searchId)
                             .map(s -> ResponseEntity.status(HttpStatus.FOUND).location(URI.create(servletContext.getContextPath() + s.getResourceLink()))
                                                     .build())
                             .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping("permalink")
  public ResponseEntity<SavedSearch> saveSearch(@RequestBody SavedSearch savedSearch) {
    return ResponseEntity.ok(savedSearchService.saveSearch(savedSearch));
  }

}
