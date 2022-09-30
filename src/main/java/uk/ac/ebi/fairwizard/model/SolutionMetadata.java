package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SolutionMetadata {
  public String id;
  public String link;
  public String createDate;
  public String title;
  public String project;
  public String name;
  public String email;
  public String description;
  public String comments;
}
