package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.model.DecisionNode;
import uk.ac.ebi.fairwizard.mongo.DecisionNodeRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

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
  public void init() {
    if (applicationConfig.isLoadResourcesOnStart()) {
      loadDecisionTree();
    }
  }

  public List<DecisionNode> getDecisionTree() {
    return decisionNodeRepository.findAll();
  }

  public void loadDecisionTree() {
    List<DecisionNode> questions;
    try (InputStream in = resourceLoader.getResource(applicationConfig.getDecisionTreeFile()).getInputStream()) {
      questions = jsonMapper.readValue(in, new TypeReference<>() {
      });
      decisionNodeRepository.saveAll(questions);
    } catch (IOException e) {
      log.error("Failed to load decision tree from file {}", e.getMessage(), e);
    }
  }
}
