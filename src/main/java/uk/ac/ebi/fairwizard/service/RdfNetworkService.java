package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.*;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.FairResource;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
    StringBuilder labelBuilder = new StringBuilder();
    for (String label : labels) {
      labelBuilder.append("\"").append(label).append("\",");
    }
    String labelQuery = labelBuilder.toString();
    labelQuery = labelQuery.substring(0, labelQuery.length() - 1);

    String query = "prefix fair:  <http://www.fair.org/2001/fair/3.0#>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "SELECT DISTINCT ?x WHERE { ?x  fair:labels/rdf:rest*/rdf:first ?label . FILTER (?label in (" + labelQuery + ")) }";

    return queryRdfGraph(query);
  }

  private Set<FairResource> queryRdfGraph(String queryString) {
    Set<FairResource> fairResources = new HashSet<>();
    Query query = QueryFactory.create(queryString);
    try (QueryExecution qexec = QueryExecutionFactory.create(query, fairResourceGraph)) {
      ResultSet results = qexec.execSelect();
      while (results.hasNext()) {
        Resource resource = results.nextSolution().getResource("x");
        FairResource fairResource = rdfToFairResourceConverter.convert(resource);
        fairResources.add(fairResource);
      }
    }

    return fairResources;
  }

  private Model loadResources() throws ApplicationStatusException {
    InputStream in = RdfNetworkService.class.getClassLoader().getResourceAsStream("fair_resources.ttl");
    if (in == null) {
      throw new ApplicationStatusException("Failed to load rdf resource file: " + applicationConfig.getFairResourcesFile());
    }
    Model model = ModelFactory.createDefaultModel();
    model.read(in,null,"TTL");
    return model;
  }


  public static void main(String[] args) throws Exception {
    readRdf();
  }

  public static void readRdf() throws Exception {
    // create an empty model
    Model model = ModelFactory.createDefaultModel();

    // use the RDFDataMgr to find the input file
    InputStream in = RdfNetworkService.class.getClassLoader().getResourceAsStream("fair_resources.ttl");
    if (in == null) {
      throw new IllegalArgumentException(
        "File: not found");
    }

//    Model model = RDFDataMgr.loadModel("data.ttl") ;
// read the RDF/XML file
//    model.read(in, null);
    model.read(in,null,"TTL");

// write it to standard out
//    model.write(System.out, "JSON-LD");
//    model.write(System.out, "TURTLE");
    model.write(System.out);

//    String query = "SELECT ?x WHERE { ?x  <http://www.w3.org/2001/vcard-rdf/3.0#type> \"Process\" }";
//    String query = "SELECT ?x ?y WHERE { ?x  <http://www.w3.org/2001/cd/3.0#label> ?y }";
//    String query = "SELECT ?x WHERE { ?x  <http://www.w3.org/2001/cd/3.0#label> [\"Findability\"] }";
//    String query = "SELECT ?x WHERE { ?x  <http://www.w3.org/2001/cd/3.0#label> ?t . filter(?t in (\"Findability\")) }";
//    String query = "SELECT ?x WHERE { ?x  <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?t . filter(?t in (\"Findability\",\"Metabolomics\")) }";

//    String query = "SELECT ?x ?label WHERE { ?x  <http://www.fair.org/2001/fair/3.0#label> ?label}";
//    String query = "SELECT ?x ?label WHERE { ?x  <http://www.fair.org/2001/fair/3.0#label> ?label . FILTER ( contains(?label, 'Findability'))}";
    String query = "prefix fair:  <http://www.fair.org/2001/fair/3.0#>\n" +
      "prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
//      "SELECT ?x ?label WHERE { ?x  fair:label/(rdf:_1|rdf:_2|rdf:_3|rdf:_4)* ?label . FILTER ( contains(?label, 'Interoperability'))}";
//      "SELECT ?x ?label WHERE { ?x  fair:labels/rdf:rest*/rdf:first ?label . FILTER ( contains(?label, 'Interoperability'))}";
//      "SELECT ?x ?label WHERE { ?x  fair:labels/rdf:rest*/rdf:first ?label . FILTER (?label in (\"Findability\",\"Metabolomics\")) }";
      "SELECT DISTINCT ?x WHERE { ?x  fair:labels/rdf:rest*/rdf:first ?label . FILTER (?label in (\"Findability\",\"Metabolomics\")) }";
    queryModel(model, query);
  }

  public static void queryModel(Model model, String queryString) throws Exception {
//      import org.apache.jena.query.* ;
//    Model model = ... ;
//    String queryString = " .... " ;
    Query query = QueryFactory.create(queryString) ;
    try (QueryExecution qexec = QueryExecutionFactory.create(query, model)) {
      ResultSet results = qexec.execSelect() ;
      for ( ; results.hasNext() ; )
      {
        QuerySolution soln = results.nextSolution() ;
        RDFNode x = soln.get("x") ;       // Get a result variable by name.
        Resource r = soln.getResource("x") ; // Get a result variable - must be a resource
//        Literal l = soln.getLiteral("VarL") ;   // Get a result variable - must be a literal
//        RDFNode value1 = r.getRequiredProperty( myitemvalue1 ).getObject();


        FairResource fr = new RdfToFairResourceConverter().convert(r);
        StmtIterator stmts = soln.get("x").asResource().listProperties();
        while ( stmts.hasNext() ) {
          System.out.println( "** "+stmts.next() );
        }


//        System.out.println(soln);
      }
    }
  }
}
