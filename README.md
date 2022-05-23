# ⚠️WORK IN PROGRESS

---
# FAIR wizard
FAIRification Wizard is developed as a part of FAIR Plus project.

## Build and run locally
```shell
./mvnw clean install -e
docker-compose up -d --build
```
go to `http://localhost:8080/home`

## Development
- `ng build --watch` (CORS config to allow localhost:4200)

## Production build
- `mvn clean install -e -DskipTests -P prod`
- Located at [https://wwwdev.ebi.ac.uk/ait/fair-wizard/](https://wwwdev.ebi.ac.uk/ait/fair-wizard/)

## Contact
biosamples@ebi.ac.uk
