This document collect basic guidance on how to curate different resources.

__EDIT files in `RAW/` only, NEVER curate the turtle file__

### Attr:
__Mandatory__
- description
- labels (use resource-lables.csv)
- lastUpdate (yyyy-mm-dd)
- name
- resourceType (Indicator/Recipe/Tool/Process/Usecase/Others)
- location (not need for type:process)


__optional__
- image (for major external resources, show the logo)
- status (whether the resource is curated, released, unmapped)
- source (hca, ebi, rdmkit, etc)
- use case
- temp (a place to put all temperary tags)
- relatesTo
- hasParent
- isAfter
## how to curate
Process <-- Recipes <-- Indicators  

Process <-- Recipes <-- Tools (tools that are included in the recipes)

Process <-- Tools
1. Processes shall have only relationships, without labels
2. All recipes must have rich labels and mapped to at least one related process
3. if a tool was extracted from a recipe, then no labels
4. if a tool comes from a third party, provide rich annotation and link to process whenever possible
5. indicators only have relationships, no labels
