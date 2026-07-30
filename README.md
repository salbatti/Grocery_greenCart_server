# GreenCart API - Grocery Delivery Backend

GreenCart API is the Express backend for a grocery delivery application. It supports user authentication, product listing, cart synchronization, addresses, checkout, order history, seller routes, MongoDB-ready persistence, and Vercel deployment.

This repository contains the backend API.

## Live API

- API: https://greencart-api.vercel.app
- Product list: https://greencart-api.vercel.app/api/product/list
- Frontend: https://greencart-store-eight.vercel.app
- Frontend repository: https://github.com/salbatti/Grocery_greenCart

Demo account:

```text
Email: demo@greencart.dev
Password: password123
```

Seller demo:

```text
Email: seller@greencart.dev
Password: seller123
```

## Features

- Express REST API for users, sellers, products, cart, addresses, and orders
- JWT authentication with HTTP-only cookies
- MongoDB-ready data models for production persistence
- Demo mode when MongoDB, Cloudinary, or Stripe environment variables are not configured
- Seeded grocery product catalog for live recruiter demos
- Cash-on-delivery checkout and Stripe-ready online checkout flow
- Order history endpoints for customer and seller views
- CORS configuration for local development and Vercel deployments
- Vercel serverless deployment configuration

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT
- bcryptjs
- Cloudinary-ready product upload
- Stripe-ready checkout
- Vercel

## Local Setup

```bash
npm install
npm start
```

Optional production environment variables:

```env
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
```

Without these values, the API runs in demo mode with seeded products, demo login, cart, address, and order flows.

## Resume Summary

Built and deployed a Node.js/Express grocery delivery API with JWT authentication, cart and order workflows, MongoDB-ready persistence, demo-mode seed data, Stripe-ready checkout, and production hosting on Vercel.
