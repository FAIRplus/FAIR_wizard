package uk.ac.ebi.fairwizard.service;

import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Answer;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.model.FairSolution;
import uk.ac.ebi.fairwizard.model.MongoFairResource;
import uk.ac.ebi.fairwizard.model.SavedSearch;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReportingService {
  private final DecisionTreeService decisionTreeService;
  private final FairResourceService fairResourceService;
  private final SavedSearchService savedSearchService;

  public ReportingService(DecisionTreeService decisionTreeService, FairResourceService fairResourceService,
                          SavedSearchService savedSearchService) {
    this.decisionTreeService = decisionTreeService;
    this.fairResourceService = fairResourceService;
    this.savedSearchService = savedSearchService;
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
    String permaLink = getSavedSearchForReport(answers);
    try {
      return ReportBuilder.getBuilder()
                          .withData()
                          .withQuestions(questions)
                          .withResources(resources)
                          .withFooter(answers, permaLink)
                          .build();
    } catch (Exception e) {
      throw new ApplicationStatusException("Failed to generate PDF report. Please contact support. " + e.getMessage());
    }
  }

  public ByteArrayOutputStream getReportStream(String searchId) throws ApplicationStatusException {
    FairSolution solution = savedSearchService.getSavedSolution(searchId)
                                              .orElseThrow(
                                                () -> new ApplicationStatusException("Invalid search parameter"));

    List<String> questions = new ArrayList<>();
    for (DecisionNode node : solution.getDecisionTree()) {
      questions.add(node.getQuestion() + "? " + node.getAnswers().stream().map(a -> a.getText())
                                                    .collect(Collectors.joining(", ")));
    }

    try {
      return ReportBuilder.getBuilder()
                          .withHeader(solution)
                          .withData()
                          .withQuestions(questions)
                          .withResources(solution.getFairResources())
                          .withFooter(solution)
                          .build();
    } catch (Exception e) {
      throw new ApplicationStatusException("Failed to generate PDF report. Please contact support. " + e.getMessage());
    }
  }

  private String getSavedSearchForReport(List<String> answers) {
    StringBuilder urlBuilder = new StringBuilder("www.ebi.ac.uk/ait/fair-wizard/wizard?");
    answers.forEach(a -> urlBuilder.append("answers=" + a + '&'));
    SavedSearch savedSearch = savedSearchService.saveSearch(new SavedSearch(null, urlBuilder.toString(), null));
    return "www.ebi.ac.uk/ait/fair-wizard/api/permalink/" + savedSearch.getId();
  }
}
