package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Answer;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.mongo.DecisionNodeRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DecisionTreeService {
  private final ObjectMapper jsonMapper;
  private final ApplicationConfig applicationConfig;
  private final ResourceLoader resourceLoader;
  private final DecisionNodeRepository decisionNodeRepository;

  public DecisionTreeService(ApplicationConfig applicationConfig, ObjectMapper jsonMapper,
                             ResourceLoader resourceLoader, DecisionNodeRepository decisionNodeRepository) {
    this.jsonMapper = jsonMapper;
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
    this.decisionNodeRepository = decisionNodeRepository;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
    if (applicationConfig.isLoadResourcesOnStart()) {
      loadDecisionTree();
    }
  }

  public List<DecisionNode> getDecisionTree() {
    return decisionNodeRepository.findAll();
  }

  public void loadDecisionTree() throws ApplicationStatusException {
    List<DecisionNode> questions;
    try (InputStream in = resourceLoader.getResource(applicationConfig.getDecisionTreeFile()).getInputStream()) {
      questions = jsonMapper.readValue(in, new TypeReference<>() {
      });
//      validateDecisionTree(questions);
      decisionNodeRepository.saveAll(questions);
    } catch (IOException e) {
      log.error("Failed to load decision tree from file {}", e.getMessage(), e);
    }
  }

  private void validateDecisionTree(List<DecisionNode> questions) throws ApplicationStatusException {
    Set<String> ids = questions.stream().map(DecisionNode::getId).collect(Collectors.toSet());
    ids.add("0");
    List<String> errors = new ArrayList<>();

    for (DecisionNode q : questions) {
      if (q.getId() == null || q.getId().isEmpty()) {
        errors.add("'id' should be a non empty string in question: " + q);
      }
      if (q.getQuestion() == null || q.getQuestion().isEmpty()) {
        errors.add("'question' should be a non empty string in question: " + q);
      }
      if (q.getId() == null || q.getId().isEmpty()) {
        errors.add("'id' should be a non empty string in question: " + q);
      }

      if (q.getAnswers() == null || q.getAnswers().isEmpty()) {
        errors.add("'answers' should not be empty in question: " + q);
      }
      for (Answer a : q.getAnswers()) {
        if (!ids.contains(a.getNext())) {
          errors.add("'next' pointing to a non existing node in question: " + q);
        }
        if(a.getText() == null || a.getText().isEmpty()) {
          errors.add("Answer 'text' should not be empty in question: " + q);
        }
        if(a.getLabels() == null || a.getLabels().isEmpty()) {
          errors.add("Answer 'labels' should not be empty in question: " + q);
        }
      }
    }

    if (!errors.isEmpty()) {
      errors.forEach(e -> log.error(e));
      throw new ApplicationStatusException("Invalid data in decison tree. Please fix them before starting the application");
    }
  }
}
