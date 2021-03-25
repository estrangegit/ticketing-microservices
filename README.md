# ticketing-microservices

This application is ticketing web application based on microservices architecture implemented during a Udemy online course [Microservices with nodeJS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/).

## Install

Initialize JWT Token secret key

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=YOUR_SECRET_PRIVATE_KEY
```

Initialize stripe secret api key

```
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=YOUR_SECRET_API_KEY
```

Create a .env file in payment projet containing STRIPE_KEY variable for test suite
