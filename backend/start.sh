#!/bin/bash

echo "Waiting for PostgreSQL to start..."
while ! nc -z postgres 5432; do
    sleep 1
done
echo "PostgreSQL started"

# Generate Prisma Client
npx prisma generate

# Create and apply migrations
echo "Running initial migration..."
npx prisma migrate dev --name init

# Start the application
npm run dev 