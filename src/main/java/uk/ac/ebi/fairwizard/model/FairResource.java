package uk.ac.ebi.fairwizard.model;

import lombok.Data;

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
  private String target;

  private List<FairResource> relatesTo;
  private List<FairResource> requires;
  private List<FairResource> isAfter;
  private List<FairResource> includes;
}
