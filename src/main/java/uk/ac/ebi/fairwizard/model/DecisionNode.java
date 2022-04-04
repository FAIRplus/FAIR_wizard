package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class DecisionNode {
  @Id
  private String id;
  private String question;
  private String category;
  private String description;
  private boolean multipleChoices;
  private List<Answer> answers;
}
