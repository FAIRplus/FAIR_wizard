package uk.ac.ebi.fairwizard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.Question;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class DecisionTreeController {
  private DecisionTreeService decisionTreeService;

  public DecisionTreeController(DecisionTreeService decisionTreeService) {
    this.decisionTreeService = decisionTreeService;
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
//    return decisionTreeService.searchResources(Arrays.asList("process"));

    System.out.println(filters);
    if (filters == null || filters.isEmpty()) {
      return decisionTreeService.getAllResources();
    }
    return decisionTreeService.searchResources(filters);
  }

}
