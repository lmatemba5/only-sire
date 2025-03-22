#!/bin/bash

# Wait for MySQL to be ready
while ! nc -z "$DB_HOST" 3306; do
    echo "Waiting for MySQL..."
    sleep 2
done

echo "Connected to MySQL..."
echo "Migrating..."

# Run Laravel migrations
php artisan migrate
echo "Migration done..."

# Start Apache in the background
apachectl -D FOREGROUND &
wait -n
exec "$@"