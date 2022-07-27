package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class FairProcess {
  private String id;
  private String name;
  private String title;
  private String description;
  private String location;
  private String resourceType;
  private List<String> labels;
  private List<FairProcess> children;
  private FairProcess next;

  public FairProcess(MongoFairResource fairResource) {
    id = fairResource.getId();
    name = fairResource.getName();
    title = fairResource.getTitle();
    description = fairResource.getDescription();
    location = fairResource.getLocation();
    resourceType = fairResource.getResourceType();
    labels = fairResource.getLabels();
    children = new ArrayList<>();
  }

}
