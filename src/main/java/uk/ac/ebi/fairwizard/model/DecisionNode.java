package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.List;

@Data
public class DecisionNode {
  private String id;
  private String question;
  private String category;
  private String description;
  private boolean multipleChoices;
  private List<Answer> answers;
}
