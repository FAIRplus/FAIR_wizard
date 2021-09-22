package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Assessment {
  public String principle;
  public String subPrinciple;
  public String id;
  public String name;
  public String priority;
  public boolean scoreOverall;
  public boolean scoreEssential;
  public boolean scoreNonEssential;
  public String description;
  public String assessmentDetails;
  public List<String> labels;
}
