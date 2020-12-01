package uk.ac.ebi.fairwizard.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApplicationConfig {
  @Value("${fairwizard.resources.decisiontree:classpath:question_bank.json}")
  private String decisionTreeFile;
  @Value("${fairwizard.resources.fairresources:classpath:fair_resources.json}")
  private String fairResourcesFile;
}
