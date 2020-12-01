package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.List;

@Data
public class Answer {
  private String text;
  private List<String> labels;
  private String next;
}
