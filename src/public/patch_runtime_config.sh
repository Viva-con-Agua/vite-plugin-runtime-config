#!/usr/bin/env sh
set -e
function log() {
    echo "$1" >/dev/stderr
}

INDEX_FILE=$(realpath "${1:-./index.html}")
log "Substituting replacement keys in ${INDEX_FILE}"

exit 1
