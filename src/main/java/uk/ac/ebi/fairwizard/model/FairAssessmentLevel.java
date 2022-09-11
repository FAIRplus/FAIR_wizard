package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class FairAssessmentLevel {
  public int level;
  public float percentage;
  public Map<String, Float> categoryPercentage;
  public List<Indicator> indicators;
}
