package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class MongoFairResource {
  private String id;
  private String name;
  private String title;
  private String description;
  private String image;
  private String location;
  private String status;
  private String resourceType;
  private List<String> labels;
  private List<String> usecase;
  private String target;
  private String lastUpdate;

  private List<String> relatesTo;
  private List<String> requires;
  private List<String> isAfter;
  private List<String> includes;
  private List<String> hasParent;
  private Set<String> reverseLinks;

  public MongoFairResource(String id) {
    this.id = id;
    relatesTo = new ArrayList<>();
    requires = new ArrayList<>();
    isAfter = new ArrayList<>();
    includes = new ArrayList<>();
  }

  public Set<String> getForwardLinks() {
    Set<String> forwardLinks = new HashSet<>();
    if (relatesTo != null) {
      forwardLinks.addAll(relatesTo);
    }
    if (requires != null) {
      forwardLinks.addAll(requires);
    }
    if (isAfter != null) {
      forwardLinks.addAll(isAfter);
    }
    if (includes != null) {
      forwardLinks.addAll(includes);
    }
    if (hasParent != null) {
      forwardLinks.addAll(hasParent);
    }

    return forwardLinks;
  }
}
