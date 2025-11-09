#!/bin/bash
set -euo pipefail

# 🧭 Directory to process (e.g. ./drawer/elements)
TARGET_DIR="${1:-.}"

# Normalize paths
ROOT_DIR="$(pwd)"                           # e.g. /Users/.../unilang
TARGET_DIR_ABS="$(cd "$TARGET_DIR" && pwd)" # e.g. /Users/.../unilang/drawer/elements
TARGET_DIR_REL="${TARGET_DIR#./}"           # e.g. drawer/elements

echo "🔍 Processing recursively in: $TARGET_DIR_ABS"
echo "🏷️  Prefix: #unilang/$TARGET_DIR_REL"

# 🧩 Resolve a relative import path to an absolute path (macOS-safe)
resolve_path() {
  local file_dir="$1"
  local import_path="$2"

  local import_dir
  import_dir="$(dirname "$import_path")"
  local import_file
  import_file="$(basename "$import_path")"

  (cd "$file_dir/$import_dir" 2>/dev/null && printf "%s/%s" "$(pwd)" "$import_file")
}

# 🔁 Process every .js file recursively
find "$TARGET_DIR_ABS" -type f -name "*.js" | while read -r FILE; do
  FILE_DIR="$(dirname "$FILE")"
  TMP_FILE="${FILE}.tmp"

  echo "⚙ Processing: ${FILE#$ROOT_DIR/}"

  while IFS= read -r LINE; do
    # Match ONLY module import/export lines (not consts, not strings, not comments)
    if [[ "$LINE" =~ ^[[:space:]]*(import|export)[[:space:]]+[^#]*from[[:space:]]+[\"\'](\.\/|\.\.\/) ]]; then
      # Extract the import path literally, without interpreting backslashes
      IMPORT_PATH=$(printf "%s" "$LINE" | sed -E 's/^[[:space:]]*(import|export)[[:space:]]+[^#]*from[[:space:]]+["'\'']([^"'\'']+)["'\''].*/\2/')

      # Resolve the absolute path
      ABS_PATH=$(resolve_path "$FILE_DIR" "$IMPORT_PATH")

      # ✅ Compute relative path from TARGET_DIR
      if [[ "$ABS_PATH" == "$TARGET_DIR_ABS"* ]]; then
        REL_FROM_TARGET="${ABS_PATH#$TARGET_DIR_ABS/}"
        NEW_IMPORT="#unilang/$TARGET_DIR_REL/$REL_FROM_TARGET"

        # Escape for literal replacement (no regex interpretation)
        ESCAPED_IMPORT_PATH=$(printf '%s' "$IMPORT_PATH" | sed 's/[][\/.^$*|?+(){}&]/\\&/g')
        ESCAPED_NEW_IMPORT=$(printf '%s' "$NEW_IMPORT" | sed 's/[&/\]/\\&/g')

        # Replace import path safely without interpreting \n or \t
        LINE=$(printf '%s' "$LINE" | sed "s|$ESCAPED_IMPORT_PATH|$ESCAPED_NEW_IMPORT|")
      fi
    fi

    # Always print line as-is, preserving literal backslashes
    printf '%s\n' "$LINE"
  done < "$FILE" > "$TMP_FILE"

  mv "$TMP_FILE" "$FILE"
done

echo "✅ Done! All relative imports in '$TARGET_DIR' now use #unilang/$TARGET_DIR_REL prefix."
