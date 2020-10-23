package uk.ac.ebi.fairwizard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.Node;
import uk.ac.ebi.fairwizard.service.DecisionTreeService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DecisionTreeController {
  private DecisionTreeService decisionTreeService;

  public DecisionTreeController(DecisionTreeService decisionTreeService) {
    this.decisionTreeService = decisionTreeService;
  }

  @GetMapping("/info")
  public String getApi() {
    return "{'api': 'v12'}";
  }

  @GetMapping("/wizard")
  public Node getDecisionTree() {
    return decisionTreeService.getDecisionTree();
  }

  @GetMapping("/search")
  public List<FairResource> searchResources() {
    return decisionTreeService.searchResources(new ArrayList<>());
  }

}
