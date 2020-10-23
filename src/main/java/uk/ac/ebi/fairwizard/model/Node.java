package uk.ac.ebi.fairwizard.model;

import lombok.Data;

import java.util.List;

@Data
public class Node {
  private String id;
  private String question;
  private String answer;
  private List<String> labels;
  private String displayAnswer;
  private List<Node> children;

  public Node(String question, String answer) {
    this.question = question;
    this.answer = answer;
  }

}
