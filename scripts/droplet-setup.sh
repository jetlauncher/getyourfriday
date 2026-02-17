#!/bin/bash
# Friday Droplet Setup Script
# This script polls Supabase for customer config and auto-configures OpenClaw

set -e

SUPABASE_URL="https://bktfmvgutvvtxfagmgqq.supabase.co"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}"  # Set via environment or inject at build time
LOG_FILE="/var/log/friday-config.log"
CONFIG_FILE="/etc/friday/config.json"
MAX_WAIT=1800  # 30 minutes max
POLL_INTERVAL=30

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Get droplet ID from DigitalOcean metadata
get_droplet_id() {
  curl -sf http://169.254.169.254/metadata/v1/id 2>/dev/null || echo ""
}

# Poll Supabase for config
fetch_config() {
  local droplet_id="$1"
  curl -sf \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    "${SUPABASE_URL}/rest/v1/friday_customers?droplet_id=eq.${droplet_id}&status=eq.configuring&select=*" \
    2>/dev/null
}

# Configure OpenClaw with customer settings
configure_openclaw() {
  local agent_name="$1"
  local bot_token="$2"
  local customer_name="$3"
  local business_name="$4"

  log "Configuring OpenClaw for: $agent_name ($business_name)"

  # Create config directory
  mkdir -p /etc/friday
  mkdir -p /root/.openclaw

  # Write Friday config
  cat > "$CONFIG_FILE" <<EOF
{
  "agentName": "$agent_name",
  "botToken": "$bot_token",
  "customerName": "$customer_name",
  "businessName": "$business_name",
  "configuredAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

  # Write OpenClaw agent config
  cat > /root/.openclaw/openclaw.json <<EOF
{
  "agents": {
    "main": {
      "model": "anthropic/claude-sonnet-4-5",
      "channel": "telegram",
      "channelConfig": {
        "botToken": "$bot_token"
      }
    }
  }
}
EOF

  log "OpenClaw config written"
}

# Start OpenClaw gateway
start_gateway() {
  log "Starting OpenClaw gateway..."
  cd /root
  nohup openclaw gateway start >> "$LOG_FILE" 2>&1 &
  log "Gateway started (PID: $!)"
}

# Update Supabase status to active
update_status_active() {
  local token="$1"
  curl -sf -X PATCH \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"status":"active"}' \
    "${SUPABASE_URL}/rest/v1/friday_customers?token=eq.${token}" \
    2>/dev/null
  log "Status updated to active"
}

# ─── Main polling loop ───
main() {
  log "=== Friday Droplet Setup Script Starting ==="

  DROPLET_ID=$(get_droplet_id)
  if [ -z "$DROPLET_ID" ]; then
    log "ERROR: Could not get droplet ID from metadata"
    exit 1
  fi
  log "Droplet ID: $DROPLET_ID"

  if [ -z "$SUPABASE_ANON_KEY" ]; then
    log "ERROR: SUPABASE_ANON_KEY not set. Set it via environment variable."
    log "Hint: export SUPABASE_ANON_KEY=your_anon_key_here"
    exit 1
  fi

  log "Waiting for customer to complete setup wizard..."
  ELAPSED=0

  while [ $ELAPSED -lt $MAX_WAIT ]; do
    log "Polling Supabase for config (elapsed: ${ELAPSED}s)..."

    RESPONSE=$(fetch_config "$DROPLET_ID")

    if [ -n "$RESPONSE" ] && echo "$RESPONSE" | grep -q '"status":"configuring"'; then
      log "Config found! Parsing..."

      # Parse JSON (requires jq)
      if command -v jq &>/dev/null; then
        AGENT_NAME=$(echo "$RESPONSE" | jq -r '.[0].agent_name // "Friday"')
        BOT_TOKEN=$(echo "$RESPONSE" | jq -r '.[0].bot_token // ""')
        CUSTOMER_NAME=$(echo "$RESPONSE" | jq -r '.[0].customer_name // ""')
        BUSINESS_NAME=$(echo "$RESPONSE" | jq -r '.[0].business_name // ""')
        SETUP_TOKEN=$(echo "$RESPONSE" | jq -r '.[0].token // ""')
      else
        log "jq not found, installing..."
        apt-get install -y jq >> "$LOG_FILE" 2>&1
        AGENT_NAME=$(echo "$RESPONSE" | jq -r '.[0].agent_name // "Friday"')
        BOT_TOKEN=$(echo "$RESPONSE" | jq -r '.[0].bot_token // ""')
        CUSTOMER_NAME=$(echo "$RESPONSE" | jq -r '.[0].customer_name // ""')
        BUSINESS_NAME=$(echo "$RESPONSE" | jq -r '.[0].business_name // ""')
        SETUP_TOKEN=$(echo "$RESPONSE" | jq -r '.[0].token // ""')
      fi

      if [ -z "$BOT_TOKEN" ]; then
        log "WARNING: bot_token is empty, waiting..."
        sleep $POLL_INTERVAL
        ELAPSED=$((ELAPSED + POLL_INTERVAL))
        continue
      fi

      log "Got config: agent=$AGENT_NAME, business=$BUSINESS_NAME"

      # Configure and start
      configure_openclaw "$AGENT_NAME" "$BOT_TOKEN" "$CUSTOMER_NAME" "$BUSINESS_NAME"
      start_gateway
      update_status_active "$SETUP_TOKEN"

      log "=== Friday is LIVE! Agent: $AGENT_NAME ==="
      exit 0
    fi

    sleep $POLL_INTERVAL
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
  done

  log "ERROR: Timed out waiting for customer config after ${MAX_WAIT}s"
  exit 1
}

main "$@"
