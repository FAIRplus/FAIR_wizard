package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Indicator {
  public String id;
  public String name;
  public String description;
  public int order;
  public int level;
  public boolean evaluation;
  public List<String> links;
}
