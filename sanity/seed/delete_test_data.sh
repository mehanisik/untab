#!/usr/bin/env bash
# Delete the 7 placeholder test projects from the Sanity dataset.
# Poster Series (project-poster-series) is REAL and intentionally NOT listed.
# Run only AFTER the real projects have imported successfully.
#
#   bash sanity/seed/delete_test_data.sh
set -euo pipefail

cd "$(dirname "$0")/../.."
set -a; source .env.local; set +a

PID="${NEXT_PUBLIC_SANITY_PROJECT_ID}"
DS="${NEXT_PUBLIC_SANITY_DATASET:-production}"
TOK="${SANITY_ADMIN_TOKEN}"

IDS=(
  project-lemppa
  project-artist-philosopher
  project-banking-app
  project-edtech-platform
  project-messaging-platform
  project-logofolio
  project-interface-explorations
)

echo "About to delete ${#IDS[@]} test projects from '$DS':"
printf '  - %s\n' "${IDS[@]}"
read -r -p "Type 'yes' to proceed: " ok
[ "$ok" = "yes" ] || { echo "Aborted."; exit 1; }

# Build a mutations payload of delete-by-id.
mutations=$(printf '{"delete":{"id":"%s"}},' "${IDS[@]}")
mutations="[${mutations%,}]"

curl -sS -X POST \
  "https://$PID.api.sanity.io/v2023-05-03/data/mutate/$DS" \
  -H "Authorization: Bearer $TOK" \
  -H "Content-Type: application/json" \
  -d "{\"mutations\":$mutations}" | python3 -m json.tool
