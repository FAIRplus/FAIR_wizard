package uk.ac.ebi.fairwizard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
//@EnableJpaRepositories(basePackages = "uk.ac.ebi.fairwizard.jpa")
@EnableMongoRepositories(basePackages = "uk.ac.ebi.fairwizard.mongo")
public class FairWizardApplication {

  public static void main(String[] args) {
    SpringApplication.run(FairWizardApplication.class, args);
  }

//  @Bean
//  public WebMvcConfigurer corsConfigurer() {
//    return new WebMvcConfigurer() {
//      @Override
//      public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**").allowedOrigins("http://localhost:4200");
//      }
//    };
//  }

}
