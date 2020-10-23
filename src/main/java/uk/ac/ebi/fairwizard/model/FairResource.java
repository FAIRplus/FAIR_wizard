package uk.ac.ebi.fairwizard.model;

import lombok.Data;

@Data
public class FairResource {
  private String id;
  private String name;
  private String location;
  private String description;
  private String image;
}
