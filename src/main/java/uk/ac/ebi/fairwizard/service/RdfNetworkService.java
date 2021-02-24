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

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
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
