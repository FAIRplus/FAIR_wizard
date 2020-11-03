package uk.ac.ebi.fairwizard.exceptions;

public class ApplicationStatusException extends Exception {
  public ApplicationStatusException() {
    super();
  }

  public ApplicationStatusException(String message) {
    super(message);
  }

  public ApplicationStatusException(Throwable cause) {
    super(cause);
  }
}
