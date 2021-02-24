package uk.ac.ebi.fairwizard.service;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.ProcessEdge;
import uk.ac.ebi.fairwizard.model.ProcessNetworkElement;
import uk.ac.ebi.fairwizard.model.ProcessNode;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RdfNetworkService {
  private Model fairResourceGraph;
  private ApplicationConfig applicationConfig;
  private ResourceLoader resourceLoader;
  private RdfToFairResourceConverter rdfToFairResourceConverter;

  public RdfNetworkService(ApplicationConfig applicationConfig, ResourceLoader resourceLoader,
                           RdfToFairResourceConverter rdfToFairResourceConverter) {
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
    this.rdfToFairResourceConverter = rdfToFairResourceConverter;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {
    fairResourceGraph = this.loadResources();
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


    List<ProcessNetworkElement> network = new ArrayList<>();
    Set<FairResource> resources = searchResourcesAll();
    for (FairResource resource : resources) {
      network.add(new ProcessNetworkElement(new ProcessNode(resource.getId(), resource.getName(), resource.getResourceType(), resource.getDescription())));
      if (resource.getRelatesTo() != null && !resource.getRelatesTo().isEmpty()) {
        for (FairResource r : resource.getRelatesTo()) {
          network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "relatesTo")));
        }
      }
      if (resource.getRequires() != null && !resource.getRequires().isEmpty()) {
        for (FairResource r : resource.getRequires()) {
          network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "requires")));
        }
      }
      if (resource.getIsAfter() != null && !resource.getIsAfter().isEmpty()) {
        for (FairResource r : resource.getIsAfter()) {
          network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "isAfter")));
        }
      }
      if (resource.getIncludes() != null && !resource.getIncludes().isEmpty()) {
        for (FairResource r : resource.getIncludes()) {
          network.add(new ProcessNetworkElement(new ProcessEdge(resource.getId() + r.getId(), resource.getId(), r.getId(), "includes")));
        }
      }
    }

    return network;
  }

  private Set<FairResource> searchResourcesWithFilters(List<String> labels) {
    StringBuilder labelBuilder = new StringBuilder();
    for (String label : labels) {
      labelBuilder.append("\"").append(label).append("\",");
    }
    String labelQuery = labelBuilder.toString();
    labelQuery = labelQuery.substring(0, labelQuery.length() - 1);

    String query = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fw:labels/rdf:rest*/rdf:first ?label . FILTER (?label in (" + labelQuery + ")) }";

    return queryRdfGraph(query);
  }

  private Set<FairResource> searchResourcesAll() {
    String query = "prefix fw: <http://fair-wizard/collection/fw/0.1/>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fw:labels/rdf:rest*/rdf:first ?label }";

    return queryRdfGraph(query);
  }

  private Set<FairResource> queryRdfGraph(String queryString) {
    Set<FairResource> fairResources = new HashSet<>();
    Query query = QueryFactory.create(queryString);
    try (QueryExecution execution = QueryExecutionFactory.create(query, fairResourceGraph)) {
      ResultSet results = execution.execSelect();
      while (results.hasNext()) {
        Resource resource = results.nextSolution().getResource("x");
        FairResource fairResource = rdfToFairResourceConverter.convert(resource);
        fairResources.add(fairResource);
      }
    }
    return fairResources;
  }

  private Model loadResources() throws ApplicationStatusException {
    try {
      InputStream in = resourceLoader.getResource(applicationConfig.getFairResourcesFile()).getInputStream();
      Model model = ModelFactory.createDefaultModel();
      model.read(in, null, "TTL");
      return model;
    } catch (IOException e) {
      throw new ApplicationStatusException("Failed to load rdf resource file: " + applicationConfig.getFairResourcesFile());
    }
  }
}
