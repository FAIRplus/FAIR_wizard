package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.DecisionNode;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
@Slf4j
public class DecisionTreeService {
  private final ObjectMapper jsonMapper;
  private final ApplicationConfig applicationConfig;
  private final ResourceLoader resourceLoader;
  private Map<String, Set<FairResource>> fairResourceIndex;

  public DecisionTreeService(ApplicationConfig applicationConfig, ObjectMapper jsonMapper, ResourceLoader resourceLoader) {
    this.jsonMapper = jsonMapper;
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
//    fairResourceIndex = this.loadResources();
  }

  public List<DecisionNode> getDecisionTree() throws ApplicationStatusException {
    List<DecisionNode> questions;
    try {
      InputStream in = resourceLoader.getResource(applicationConfig.getDecisionTreeFile()).getInputStream();
      questions = jsonMapper.readValue(in, new TypeReference<>() {
      });
    } catch (IOException e) {
      e.printStackTrace();
      throw new ApplicationStatusException("Failed to load decision tree");
    }

    return questions;
  }

  public Set<FairResource> searchResources(List<String> labels) {
    Set<FairResource> fairResources = new HashSet<>();
    for (String label : labels) {
      if (fairResourceIndex.containsKey(label)) {
        fairResources.addAll(fairResourceIndex.get(label));
      } else {
        log.warn("Warning: Orphan label in question bank: {}", label);
      }
    }
    return fairResources;
  }

  public Set<FairResource> getAllResources() {
    Set<FairResource> fairResources = new HashSet<>();
    for (Set<FairResource> resources : fairResourceIndex.values()) {
      fairResources.addAll(resources);
    }
    return fairResources;
  }

  private Map<String, Set<FairResource>> loadResources() throws ApplicationStatusException {
    List<FairResource> fairResourceList;
    Map<String, Set<FairResource>> indexedFairResources = new HashMap<>();
    try {
      InputStream in = resourceLoader.getResource(applicationConfig.getFairResourcesFile()).getInputStream();
      fairResourceList = jsonMapper.readValue(in, new TypeReference<>() {
      });

      for (FairResource resource : fairResourceList) {
        for (String label : resource.getLabels()) {
          if (!indexedFairResources.containsKey(label)) {
            indexedFairResources.put(label, new HashSet<>());
          }
          indexedFairResources.get(label).add(resource);
        }
      }
    } catch (IOException e) {
      throw new ApplicationStatusException("Failed to load FAIR resources");
    }

    return indexedFairResources;
  }

}
