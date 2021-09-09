package uk.ac.ebi.fairwizard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "saved_searches")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavedSearch {

  @Id
  @Column(name = "perma_link")
  private String permaLink;
  @Column(name = "resource_link")
  private String resourceLink;
}
