#!/bin/sh

# Run database migrations
npm run db:migrate:prod

# Start the application
exec "$@"
