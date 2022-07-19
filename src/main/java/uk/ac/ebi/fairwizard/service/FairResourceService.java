package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.MongoFairResource;
import uk.ac.ebi.fairwizard.model.ProcessEdge;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.ProcessNode;
import uk.ac.ebi.fairwizard.mongo.FairResourceRepository;

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
public class FairResourceService {
  private final ApplicationConfig applicationConfig;
  private final ResourceLoader resourceLoader;
  private final ObjectMapper jsonMapper;
  private final FairResourceRepository fairResourceRepository;

  public FairResourceService(ApplicationConfig applicationConfig, ResourceLoader resourceLoader,
                             ObjectMapper jsonMapper, FairResourceRepository fairResourceRepository) {
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
    this.jsonMapper = jsonMapper;
    this.fairResourceRepository = fairResourceRepository;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
    if (applicationConfig.isLoadResourcesOnStart()) {
      log.warn("Loading FAIR resources from file to the database");
      loadResources();
    }
  }

  public MongoFairResource getResource(String resourceId) throws ApplicationStatusException {
    return fairResourceRepository.findById(resourceId)
                                 .orElseThrow(() -> new ApplicationStatusException("Resource does not exist with ID: " + resourceId));
  }

  public Set<MongoFairResource> searchResources(List<String> labels) {
    if (labels != null && !labels.isEmpty()) {
      return searchResourcesWithFilters(labels);
    } else {
      return searchResourcesAll();
    }
  }

  public List<ProcessNetworkElement> populateNetwork(Set<MongoFairResource> resources) {
    List<ProcessNetworkElement> network = new ArrayList<>();
    Set<String> resourceIds = resources.stream().map(MongoFairResource::getId).collect(Collectors.toSet());

    for (MongoFairResource resource : resources) {
      network.add(new ProcessNetworkElement(
        new ProcessNode(resource.getId(), resource.getName(), resource.getResourceType(), resource.getDescription())));

      if (resource.getRelatesTo() != null) {
        resource.getRelatesTo().forEach(r -> {
          addToNetwork(resource.getId(), r, "relatesTo", resourceIds, network);
        });
      }

      if (resource.getRequires() != null) {
        resource.getRequires().forEach(r -> {
          addToNetwork(resource.getId(), r, "requires", resourceIds, network);
        });
      }

      if (resource.getIsAfter() != null) {
        resource.getIsAfter().forEach(r -> {
          addToNetwork(resource.getId(), r, "isAfter", resourceIds, network);
        });
      }

      if (resource.getIncludes() != null) {
        resource.getIncludes().forEach(r -> {
          addToNetwork(resource.getId(), r, "includes", resourceIds, network);
        });
      }

      if (resource.getHasParent() != null) {
        resource.getHasParent().forEach(r -> {
          addToNetwork(resource.getId(), r, "hasParent", resourceIds, network);
        });
      }
    }

    return network;
  }

  private Set<MongoFairResource> searchResourcesWithFilters(List<String> labels) {
    Set<MongoFairResource> fairResources =
      new HashSet<MongoFairResource>(fairResourceRepository.findLabledResources(labels));
    List<MongoFairResource> connectedResources = fairResources.stream()
                                                              .flatMap(r -> getConnectedResources(r).stream())
                                                              .collect(Collectors.toList());
    fairResources.addAll(connectedResources);
    fairResources.addAll(fairResourceRepository.findLabledResourcesForUseCases(labels));//add tagged usecases

    return fairResources;
  }

  private Set<MongoFairResource> searchResourcesAll() {
    return new HashSet<MongoFairResource>(fairResourceRepository.findAll());
  }

  private Set<MongoFairResource> getConnectedResources(MongoFairResource resource) {
    Set<MongoFairResource> connectedResources = new HashSet<>();

    if (resource.getRelatesTo() != null && !resource.getRelatesTo().isEmpty()) {
      fairResourceRepository.findAllById(resource.getRelatesTo()).forEach(connectedResources::add);
    }

    if (resource.getRequires() != null && !resource.getRequires().isEmpty()) {
      fairResourceRepository.findAllById(resource.getRequires()).forEach(connectedResources::add);
    }

    return connectedResources;
  }

  private void addToNetwork(String id1, String id2, String rel, Set<String> ids, List<ProcessNetworkElement> network) {
    if (ids.contains(id1) && ids.contains(id2)) {
      network.add(new ProcessNetworkElement(new ProcessEdge(id1 + id2, id1, id2, rel)));
    }
  }

  private void loadResources() throws ApplicationStatusException {
    fairResourceRepository.deleteAll();
    try (InputStream in = resourceLoader.getResource(applicationConfig.getFairResourcesFile()).getInputStream()) {
      List<MongoFairResource> fairResources = jsonMapper.readValue(in, new TypeReference<>() {
      });
//      validateResources(fairResources);
      fairResourceRepository.saveAll(fairResources);
    } catch (IOException e) {
      log.error("Failed to load FAIR resources from file {}", e.getMessage(), e);
    }
  }

  private void validateResources(List<MongoFairResource> resources) throws ApplicationStatusException {
    Set<String> ids = resources.stream().map(MongoFairResource::getId).collect(Collectors.toSet());
    List<String> errors = new ArrayList<>();

    for (MongoFairResource r : resources) {
      if (r.getId() == null || r.getId().isEmpty()) {
        errors.add("'id' should be a non empty string in: " + r);
      }
      if (r.getName() == null || r.getName().isEmpty()) {
        errors.add("'name' should be a non empty string in: " + r);
      }
      if (r.getResourceType() == null || r.getResourceType().isEmpty()) {
        errors.add("'resourceType' should be a non empty string in: " + r);
      }
      if (r.getLabels() == null || r.getLabels().isEmpty()) {
        errors.add("'labels' should be a non empty string in: " + r);
      }

      if (r.getRelatesTo() != null &&
          !ids.containsAll(r.getRelatesTo())/* && r.getRelatesTo().stream().anyMatch(s -> !ids.contains(s))*/) {
        errors.add("'relatesTo' should refer to an existing resource in: " + r);
      }
      if (r.getRequires() != null && !ids.containsAll(r.getRequires())) {
        errors.add("'requires' should refer to an existing resource in: " + r);
      }
      if (r.getIsAfter() != null && !ids.containsAll(r.getIsAfter())) {
        errors.add("'isAfter' should refer to an existing resource in: " + r);
      }
      if (r.getIncludes() != null && !ids.containsAll(r.getIncludes())) {
        errors.add("'includes' should refer to an existing resource in: " + r);
      }
      if (r.getHasParent() != null && !ids.containsAll(r.getHasParent())) {
        errors.add("'hasParent' should refer to an existing resource in: " + r);
      }
    }

    if (!errors.isEmpty()) {
      errors.forEach(e -> log.error(e));
      throw new ApplicationStatusException(
        "Invalid data in resources. Please fix them before starting the application");
    }
  }
}
