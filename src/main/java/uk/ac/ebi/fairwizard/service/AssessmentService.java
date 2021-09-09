package uk.ac.ebi.fairwizard.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.extern.java.Log;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Assessment;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Log
public class AssessmentService {
  private final ResourceLoader resourceLoader;
  private final ApplicationConfig applicationConfig;

  public AssessmentService(ResourceLoader resourceLoader, ApplicationConfig applicationConfig) {
    this.resourceLoader = resourceLoader;
    this.applicationConfig = applicationConfig;
  }

  public List<Assessment> getFairAssesment() throws ApplicationStatusException {
    String file = getClass().getClassLoader().getResource(applicationConfig.getFairAssessmentFile()).getFile();
    List<Assessment> assessments = new ArrayList<>();
    try (CSVReader reader = new CSVReader(new FileReader(file))) {
      String[] f = reader.readNext();
      log.info("Reading header line with " + f.length + " fields");
      while ((f = reader.readNext()) != null) {
        if ("Principle".equalsIgnoreCase(f[0])) {
          continue;
        }
        assessments.add(new Assessment(f[0], f[1], f[2], f[3], f[4], toBoolean(f[5]), toBoolean(f[6]), toBoolean(f[7]), "", ""));
      }
    } catch (IOException | CsvValidationException e) {
      throw new ApplicationStatusException("Failed to read FAIR assessment file");
    }

    return assessments;
  }

  private boolean toBoolean(String s) {
    return "1".equals(s);
  }
}
