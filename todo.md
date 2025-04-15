# TODO List

- Move `/frontend` terraform module into the main modules and integrate with cloudfront
- Fix `/register` endpoint, currently does successfully create a user but fails to provide a 2xx response
- Add main and architecture READMEs
- Use terraform managed enis to fix endless loop while calling `terraform destroy`