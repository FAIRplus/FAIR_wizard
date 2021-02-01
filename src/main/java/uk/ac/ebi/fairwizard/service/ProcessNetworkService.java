package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.*;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ProcessNetworkService {
  private ObjectMapper jsonMapper;
  private ApplicationConfig applicationConfig;
  private ResourceLoader resourceLoader;
  private Map<String, Set<FairResource>> fairResourceIndex;

  public ProcessNetworkService(ApplicationConfig applicationConfig, ObjectMapper jsonMapper, ResourceLoader resourceLoader) {
    this.jsonMapper = jsonMapper;
    this.applicationConfig = applicationConfig;
    this.resourceLoader = resourceLoader;
  }

  @PostConstruct
  public void init() throws ApplicationStatusException {

  }

  public List<ProcessNetworkElement> getResourceNetwork() {
    List<ProcessNetworkElement> processes = new ArrayList<>();
//    processes.add(new ProcessNetworkElement(new ProcessNode("Metadata Strategies")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("Interoperability requirements")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("Ontology annotation")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("Ontology annotation validation")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("Zooma")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("OLS")));
//    processes.add(new ProcessNetworkElement(new ProcessNode("How to select an Ontology?")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e1", "Metadata Strategies", "Interoperability requirements")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e2", "Interoperability requirements", "Ontology annotation")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e3", "Interoperability requirements", "Ontology annotation validation")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e4", "Ontology annotation", "Zooma")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e5", "Ontology annotation validation", "OLS")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e6", "Ontology annotation", "How to select an Ontology?")));
//    processes.add(new ProcessNetworkElement(new ProcessEdge("e7", "How to select an Ontology?", "OLS")));

    return processes;
  }

}
