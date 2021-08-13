package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class FairResource {
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

  private List<FairResource> relatesTo;
  private List<FairResource> requires;
  private List<FairResource> isAfter;
  private List<FairResource> includes;
  private List<FairResource> hasParent;

  public FairResource(String id) {
    this.id = id;
    relatesTo = new ArrayList<>();
    requires = new ArrayList<>();
    isAfter = new ArrayList<>();
    includes = new ArrayList<>();
  }
}
