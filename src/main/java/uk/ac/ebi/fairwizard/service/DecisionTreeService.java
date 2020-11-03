package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.Node;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class DecisionTreeService {
  private ObjectMapper jsonMapper;
  private ApplicationConfig applicationConfig;
  private ResourceLoader resourceLoader;

  public DecisionTreeService(ApplicationConfig applicationConfig, ObjectMapper jsonMapper, ResourceLoader resourceLoader) {
    this.jsonMapper = jsonMapper;
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
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

  public List<FairResource> searchResources(List<String> labels) throws ApplicationStatusException {
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

}
