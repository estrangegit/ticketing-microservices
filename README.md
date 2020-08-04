# ticketing-microservices

This application is ticketing web application based on microservices architecture implemented during a Udemy online course [Microservices with nodeJS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/).

## Install

Initialize JWT Token secret key

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SECRET_PRIVATE_KEY
```
