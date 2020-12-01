package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.List;

@Data
public class Question {
  private String id;
  private String question;
  private List<Answer> answers;
}
