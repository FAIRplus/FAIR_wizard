package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.Node;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class DecisionTreeService {
  private ObjectMapper jsonMapper;
  private ApplicationConfig applicationConfig;
  private ResourceLoader resourceLoader;
  private Map<String, Set<FairResource>> fairResourceIndex;

  public DecisionTreeService(ApplicationConfig applicationConfig, ObjectMapper jsonMapper, ResourceLoader resourceLoader) {
    this.jsonMapper = jsonMapper;
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
    fairResourceIndex = this.loadResources();
  }

  public Node getDecisionTree() throws ApplicationStatusException {
    Node node;
    try {
      InputStream in = resourceLoader.getResource(applicationConfig.getDecisionTreeFile()).getInputStream();
      node = jsonMapper.readValue(in, Node.class);
    } catch (IOException e) {
      e.printStackTrace();
      throw new ApplicationStatusException("Failed to load decision tree");
    }

    return node;
  }

  public List<FairResource> searchResources2(List<String> labels) throws ApplicationStatusException {
    List<FairResource> fairResources;
    try {
      InputStream in = resourceLoader.getResource(applicationConfig.getFairResourcesFile()).getInputStream();
      fairResources = jsonMapper.readValue(in, new TypeReference<>() {
      });
    } catch (IOException e) {
      throw new ApplicationStatusException("Failed to load FAIR resources");
    }

    return fairResources;
  }

  public Set<FairResource> searchResources(List<String> labels) {
    Set<FairResource> fairResources = new HashSet<>();
    for (String label : labels) {
      fairResources.addAll(fairResourceIndex.get(label));
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
