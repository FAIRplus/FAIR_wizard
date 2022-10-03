package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FairSolution {
  public String id;
  public String link;
  public String createDate;
  public String title;
  public String project;
  public String description;
  public String comments;

  public List<DecisionNode> decisionTree;
  public Set<String> labels; // this could be interested categories
  public List<IndicatorGroup> indicatorGroups;
  public FairAssessment assessment;
  public Set<MongoFairResource> fairResources; // could be filtered by decision tree results or/and assessment results

  public FairSolution(String id) {
    this.id = id;
  }
}
