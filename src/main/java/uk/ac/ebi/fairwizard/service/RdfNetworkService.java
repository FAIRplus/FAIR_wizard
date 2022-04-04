package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.MongoFairResource;
import uk.ac.ebi.fairwizard.model.ProcessEdge;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.ProcessNode;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RdfNetworkService {
  private Model fairResourceGraph;
  private final ApplicationConfig applicationConfig;
  private final ResourceLoader resourceLoader;
  private final RdfToFairResourceConverter rdfToFairResourceConverter;

  public RdfNetworkService(ApplicationConfig applicationConfig, ResourceLoader resourceLoader,
                           RdfToFairResourceConverter rdfToFairResourceConverter) {
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
    this.rdfToFairResourceConverter = rdfToFairResourceConverter;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
    fairResourceGraph = this.loadResources();
    rdfToJson();
  }

  public Set<FairResource> searchResources(List<String> labels) {
    if (labels != null && !labels.isEmpty()) {
      return searchResourcesWithFilters(labels);
    } else {
      return searchResourcesAll();
    }
  }

  public List<ProcessNetworkElement> getResourceNetwork() {
    String processName = "";
    String outwardQuery = "prefix fair:  <http://www.fair.org/2001/fair/3.0#>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT ?predicate, ?object WHERE { " + processName + " ?predicate ?object }";
    String inwardQuery = "prefix fair:  <http://www.fair.org/2001/fair/3.0#>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT ?predicate, ?subject WHERE { ?subject ?predicate " + processName + " }";

    Set<FairResource> resources = searchResourcesAll();
    return populateNetwork(resources);
  }

  public List<ProcessNetworkElement> getResourceNetwork(String resourceId) {
    Set<FairResource> resources = new HashSet<>();
    resourceId = "fw:process-8298344911298610653";

    String queryString = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT ?x WHERE { ?x ?predicate ?y . FILTER (?x = <" + resourceId + ">) }";
    queryRdfGraph(queryString, resources);

    queryString = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x fw:relatesTo/rdf:rest*/rdf:first ?o . FILTER (?o in (<fw:process-8298344911298610653>)) }";
    queryRdfGraph(queryString, resources);

    queryString = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x fw:requires/rdf:rest*/rdf:first ?o . FILTER (?o in (<fw:process-8298344911298610653>)) }";
    queryRdfGraph(queryString, resources);

    queryString = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x fw:isAfter/rdf:rest*/rdf:first ?o . FILTER (?o in (<fw:process-8298344911298610653>)) }";
    queryRdfGraph(queryString, resources);

    queryString = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x fw:includes/rdf:rest*/rdf:first ?o . FILTER (?o in (<fw:process-8298344911298610653>)) }";
    queryRdfGraph(queryString, resources);

    return populateNetwork(resources);
  }

  public List<ProcessNetworkElement> populateNetwork(Set<FairResource> resources) {
    List<ProcessNetworkElement> network = new ArrayList<>();
    Set<String> resourceIds = resources.stream().map(FairResource::getId).collect(Collectors.toSet());

    for (FairResource resource : resources) {
      network.add(new ProcessNetworkElement(new ProcessNode(resource.getId(), resource.getName(), resource.getResourceType(), resource.getDescription())));
      if (resource.getRelatesTo() != null && !resource.getRelatesTo().isEmpty()) {
        for (FairResource r : resource.getRelatesTo()) {
          if (resourceIds.contains(r.getId()) && resourceIds.contains(resource.getId())){
            network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "relatesTo")));
          }
        }
      }
      if (resource.getRequires() != null && !resource.getRequires().isEmpty()) {
        for (FairResource r : resource.getRequires()) {
          if (resourceIds.contains(r.getId()) && resourceIds.contains(resource.getId())){
            network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "requires")));
          }
        }
      }
      if (resource.getIsAfter() != null && !resource.getIsAfter().isEmpty()) {
        for (FairResource r : resource.getIsAfter()) {
          if (resourceIds.contains(r.getId()) && resourceIds.contains(resource.getId())){
            network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "isAfter")));
          }
        }
      }
      if (resource.getIncludes() != null && !resource.getIncludes().isEmpty()) {
        for (FairResource r : resource.getIncludes()) {
          if (resourceIds.contains(r.getId()) && resourceIds.contains(resource.getId())){
            network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "includes")));
          }
        }
      }
      if (resource.getHasParent() != null && !resource.getHasParent().isEmpty()) {
        for (FairResource r : resource.getHasParent()) {
          if (resourceIds.contains(r.getId()) && resourceIds.contains(resource.getId())){
            network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "hasParent")));
          }
        }
      }
    }

    return network;
  }


  public List<ProcessNetworkElement> getConnectedResources() {
    return null;
  }

  private Set<FairResource> searchResourcesWithFilters(List<String> labels) {
    Set<FairResource> fairResources = new HashSet<>();

    StringBuilder labelBuilder = new StringBuilder();
    for (String label : labels) {
      labelBuilder.append("\"").append(label.toLowerCase()).append("\",");
    }
    String labelQuery = labelBuilder.toString();
    labelQuery = labelQuery.substring(0, labelQuery.length() - 1);

    String query = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fw:labels/rdf:rest*/rdf:first ?label . FILTER (lcase(str(?label)) in (" + labelQuery + ")) }";
    queryRdfGraph(query, fairResources);

    // add relateTo resources
    List<FairResource> relateToList = new ArrayList<>();
    for (FairResource r : fairResources) {
      relateToList.addAll(getRelatedResources(r));
    }
    fairResources.addAll(relateToList);

    query = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fw:usecase/rdf:rest*/rdf:first ?usecase . FILTER (lcase(str(?usecase)) in (" + labelQuery + ")) }";
    queryRdfGraph(query, fairResources);

    return fairResources;
  }

  private Set<FairResource> searchResourcesAll() {
    Set<FairResource> fairResources = new HashSet<>();

    String query = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fw:labels/rdf:rest*/rdf:first ?label }";
    queryRdfGraph(query, fairResources);

    return fairResources;
  }

  private void queryRdfGraph(String queryString, Set<FairResource> fairResources) {
    Query query = QueryFactory.create(queryString);
    try (QueryExecution execution = QueryExecutionFactory.create(query, fairResourceGraph)) {
      ResultSet results = execution.execSelect();
      while (results.hasNext()) {
        Resource resource = results.next().getResource("x");
        FairResource fairResource = rdfToFairResourceConverter.convert(resource);
        fairResources.add(fairResource);
      }
    }
  }

  private List<FairResource> getRelatedResources(FairResource resource) {
    return resource.getRelatesTo().stream()
                   .map(r -> fairResourceGraph.getResource(r.getId()))
                   .map(rdfToFairResourceConverter::convert)
                   .collect(Collectors.toList());
  }

  private Model loadResources() throws ApplicationStatusException {
    try(InputStream in = resourceLoader.getResource(applicationConfig.getFairResourcesFileTtl()).getInputStream()) {
      Model model = ModelFactory.createDefaultModel();
      model.read(in, null, "TTL");
      return model;
    } catch (IOException e) {
      throw new ApplicationStatusException("Failed to load rdf resource file: " + applicationConfig.getFairResourcesFileTtl());
    }
  }


  public void rdfToJson() {
    Set<FairResource> resourcesRdf = searchResourcesAll();
    Set<MongoFairResource> resourcesJson = new HashSet<>();
    resourcesRdf.forEach(r -> {
      MongoFairResource fr = new MongoFairResource();
      resourcesJson.add(fr);
      fr.setId(r.getId());
      fr.setName(r.getName());
      fr.setTitle(r.getTitle());
      fr.setDescription(r.getDescription());
      fr.setImage(r.getImage());
      fr.setLocation(r.getLocation());
      fr.setStatus(r.getStatus());
      fr.setResourceType(r.getResourceType());
      fr.setLabels(r.getLabels());
      fr.setUsecase(r.getUsecase());
      fr.setTarget(r.getTarget());
      fr.setLastUpdate(r.getLastUpdate());

      fr.setRelatesTo(r.getRelatesTo() != null ? r.getRelatesTo().stream().map(x -> x.getId()).collect(Collectors.toList()) : Collections.emptyList());
      fr.setRequires(r.getRequires() != null ? r.getRequires().stream().map(x -> x.getId()).collect(Collectors.toList()) : Collections.emptyList());
      fr.setIsAfter(r.getIsAfter() != null ? r.getIsAfter().stream().map(x -> x.getId()).collect(Collectors.toList()) : Collections.emptyList());
      fr.setIncludes(r.getIncludes() != null ? r.getIncludes().stream().map(x -> x.getId()).collect(Collectors.toList()) : Collections.emptyList());
      fr.setHasParent(r.getHasParent() != null ? r.getHasParent().stream().map(x -> x.getId()).collect(Collectors.toList()) : Collections.emptyList());
    });

    ObjectMapper objectMapper = new ObjectMapper();
    try {
      objectMapper.writeValue(new File("./json.json"), resourcesJson);
    } catch (Exception e) {
      e.printStackTrace();
    }

  }
}
