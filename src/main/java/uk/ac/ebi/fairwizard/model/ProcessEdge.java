package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessEdge extends ProcessNode {
  private String id;
  private String source;
  private String target;
  private String label;
}
