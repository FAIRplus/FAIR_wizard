package uk.ac.ebi.fairwizard.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.Question;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;
import uk.ac.ebi.fairwizard.service.ProcessNetworkService;
import uk.ac.ebi.fairwizard.service.RdfNetworkService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class DecisionTreeController {
  private static final Logger LOG = LoggerFactory.getLogger(DecisionTreeController.class);

  private DecisionTreeService decisionTreeService;
  private ProcessNetworkService processNetworkService;
  private RdfNetworkService rdfNetworkService;

  public DecisionTreeController(DecisionTreeService decisionTreeService,
                                ProcessNetworkService processNetworkService,
                                RdfNetworkService rdfNetworkService) {
    this.decisionTreeService = decisionTreeService;
    this.processNetworkService = processNetworkService;
    this.rdfNetworkService = rdfNetworkService;
  }

  @GetMapping("/version")
  public String getApi() {
    return "{'api': 'v0.0.1'}";
  }

  @GetMapping("/wizard")
  public List<Question> getDecisionTree() throws ApplicationStatusException {
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

//    if (filters == null || filters.isEmpty()) {
//      return processNetworkService.getResourceNetwork();
//    }
//    return processNetworkService.getResourceNetwork();

    return rdfNetworkService.getResourceNetwork();
  }

}
