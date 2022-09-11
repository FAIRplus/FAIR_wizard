package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class FairAssessment {
  public int fairLevel;
  public float fairPercentage;
  public Map<String, Integer> categoryLevel;
  public List<FairAssessmentLevel> levels;
}
