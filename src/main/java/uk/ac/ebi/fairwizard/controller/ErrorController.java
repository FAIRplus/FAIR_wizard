package uk.ac.ebi.fairwizard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/error")
public class ErrorController {
  @GetMapping
  public String handleError() {
    return "404";
  }

}
