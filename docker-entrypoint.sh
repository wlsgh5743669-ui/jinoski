#!/bin/sh
set -e

echo "Applying database schema to $DATABASE_URL ..."
node_modules/.bin/prisma db push --skip-generate

exec "$@"
