package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import uk.ac.ebi.fairwizard.model.FairResource;
import uk.ac.ebi.fairwizard.model.Node;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DecisionTreeService {
  private ObjectMapper jsonMapper;

  public DecisionTreeService(ObjectMapper jsonMapper) {
    this.jsonMapper = jsonMapper;
  }

  public Node getDecisionTree() {
    Node node = new Node("question", "answer");
    try {
      File file = ResourceUtils.getFile("classpath:decision_tree.json");
      node = jsonMapper.readValue(file, Node.class);
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (JsonParseException | JsonMappingException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return node;
  }

  public List<FairResource> searchResources(List<String> labels) {
    List<FairResource> fairResources = new ArrayList<>();
    FairResource fairResource = new FairResource();
    fairResources.add(fairResource);

    return fairResources;
  }

}
