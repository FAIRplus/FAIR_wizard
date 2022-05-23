package uk.ac.ebi.fairwizard.service;

import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Answer;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.model.MongoFairResource;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ReportingService {
  private final DecisionTreeService decisionTreeService;
  private final FairResourceService fairResourceService;

  public ReportingService(DecisionTreeService decisionTreeService, FairResourceService fairResourceService) {
    this.decisionTreeService = decisionTreeService;
    this.fairResourceService = fairResourceService;
  }

  public ByteArrayOutputStream getReportStream(List<String> answers)
    throws ApplicationStatusException {
    List<DecisionNode> decisionTree = decisionTreeService.getDecisionTree();
    List<String> questions = new ArrayList<>();

    List<String> filters = new ArrayList<>();

    DecisionNode node = decisionTree.get(0);
    for (String answer : answers) {
      String firstAnswer = answer.split(":")[0];
      questions.add(node.getQuestion() + "? " + answer.replace(":", ", "));
      Answer nodeAnswer = node.getAnswers().stream()
                              .filter(a -> a.getText().equalsIgnoreCase(firstAnswer))
                              .findFirst()
                              .orElseThrow(() -> new ApplicationStatusException("Could not traverse decision tree"));

      filters.addAll(nodeAnswer.getLabels()); // todo add labels from all answers

      if (!"0".equals(nodeAnswer.getNext())) {
        node = decisionTree.stream()
                           .filter(d -> d.getId().equals(nodeAnswer.getNext()))
                           .findFirst()
                           .orElseThrow(() -> new ApplicationStatusException("Could not find decision tree node"));
      }
    }

    Set<MongoFairResource> resources = fairResourceService.searchResources(filters);


    try {
      return ReportBuilder.getBuilder().withData().withQuestions(questions).withResources(resources).withFooter(answers).build();
    } catch (Exception e) {
      throw new ApplicationStatusException("Failed to generate PDF report. Please contact support. " + e.getMessage());
    }
  }
}
