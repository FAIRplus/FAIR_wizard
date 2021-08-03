package uk.ac.ebi.fairwizard.service;

import org.apache.jena.rdf.model.*;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.NotWritablePropertyException;
import org.springframework.beans.PropertyAccessor;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.model.FairResource;

import java.util.ArrayList;
import java.util.List;

@Service
public class RdfToFairResourceConverter {
  private static final Logger LOG = LoggerFactory.getLogger(RdfToFairResourceConverter.class);

  public FairResource convert(Resource resource) {
    FairResource fairResource = new FairResource(resource.getURI());

    StmtIterator stmts = resource.listProperties();
    while (stmts.hasNext()) {
      Statement statement = stmts.next();
      String predicate = statement.getPredicate().getLocalName();
      try {
        PropertyAccessor fairResourceAccessor = PropertyAccessorFactory.forBeanPropertyAccess(fairResource);
        RDFNode object = statement.getObject();
        if (object.isLiteral()) {
          fairResourceAccessor.setPropertyValue(predicate, statement.getObject().asLiteral().getString());
        } else {
          RDFList rdfList = statement.getObject().as(RDFList.class);
          ExtendedIterator<RDFNode> items = rdfList.iterator();

          List<Object> itemList = new ArrayList<>();
          fairResourceAccessor.setPropertyValue(predicate, itemList);
          while (items.hasNext()) {
            RDFNode node = items.next();
            if (node.isLiteral()) {
              itemList.add(node.asLiteral().getString());
            } else {
              FairResource emptyResource = new FairResource(node.asResource().getURI());
              itemList.add(emptyResource);
            }
          }
        }
      } catch (NotWritablePropertyException e) {
        LOG.warn("Skipping unrecognized resource fields in RDF model. {}", e.getMessage());
      }
    }

    return fairResource;
  }
}
