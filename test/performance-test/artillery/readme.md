### Artillery Performance Tests

- npm i artillery
- $(npm bin)/artillery run data-block-tests.yaml --environment localhost --config config.yaml --output report.json
- $(npm bin)/artillery report report.json report.html 
