package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class IndicatorGroup {
  public String category;
  public String description;
  public int order;
  public List<Indicator> indicators;
}
