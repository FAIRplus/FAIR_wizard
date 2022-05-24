package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Assessment {
  public String levels;
  public String subPrinciple;
  public String id;
  public String name;
  public String category;
  public boolean scoreOverall;
  public String description;
  public String assessmentDetails;
  public List<String> labels;
}
