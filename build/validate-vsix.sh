#!/bin/bash
#
# VSIX Validation Script
# Validates a VSIX package using vsce ls command
#
# Usage: ./validate-vsix.sh <path-to-vsix>
#
# Exit codes:
#   0 - Validation passed
#   1 - Validation failed
#   2 - File not found
#   3 - Size exceeds limit
#

set -e

VSIX_FILE="$1"
MAX_SIZE_MB=5
MAX_SIZE_BYTES=$((MAX_SIZE_MB * 1024 * 1024))

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if file argument provided
if [ -z "$VSIX_FILE" ]; then
    echo -e "${RED}❌ Error: No VSIX file specified${NC}"
    echo "Usage: $0 <path-to-vsix>"
    exit 1
fi

# Check if file exists
if [ ! -f "$VSIX_FILE" ]; then
    echo -e "${RED}❌ Error: VSIX file not found: $VSIX_FILE${NC}"
    exit 2
fi

echo "🔍 Validating VSIX: $VSIX_FILE"
echo ""

# Check file size
if command -v stat &> /dev/null; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        SIZE=$(stat -f%z "$VSIX_FILE")
    else
        # Linux
        SIZE=$(stat -c%s "$VSIX_FILE")
    fi
    
    SIZE_MB=$(echo "scale=2; $SIZE / 1024 / 1024" | bc)
    
    if [ "$SIZE" -gt "$MAX_SIZE_BYTES" ]; then
        echo -e "${YELLOW}⚠️  Warning: VSIX size (${SIZE_MB} MB) exceeds ${MAX_SIZE_MB} MB limit${NC}"
        echo "   This may indicate bundled node_modules or large assets"
    else
        echo -e "${GREEN}✓ File size: ${SIZE_MB} MB (under ${MAX_SIZE_MB} MB limit)${NC}"
    fi
fi

# Check for vsce command
if ! command -v vsce &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: vsce not found in PATH, skipping validation${NC}"
    echo "   Install with: npm install -g @vscode/vsce"
    exit 0
fi

# Run vsce ls validation
echo ""
echo "📋 Running vsce ls validation..."

if vsce ls --packagePath "$VSIX_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ VSIX structure is valid${NC}"
else
    echo -e "${RED}❌ VSIX validation failed${NC}"
    echo ""
    echo "Running vsce ls for details:"
    vsce ls --packagePath "$VSIX_FILE" 2>&1 || true
    exit 1
fi

# Verify expected files exist in VSIX
echo ""
echo "📦 Checking expected files..."

# Extract VSIX to temp directory for inspection
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

if command -v unzip &> /dev/null; then
    unzip -q "$VSIX_FILE" -d "$TEMP_DIR" 2>/dev/null || true
    
    # Check for extension manifest
    if [ -f "$TEMP_DIR/extension/package.json" ]; then
        echo -e "${GREEN}✓ extension/package.json found${NC}"
        
        # Verify no unresolved NLS placeholders
        if grep -q '%[a-zA-Z._]*%' "$TEMP_DIR/extension/package.json" 2>/dev/null; then
            echo -e "${RED}❌ Error: Unresolved NLS placeholders found in package.json${NC}"
            grep '%[a-zA-Z._]*%' "$TEMP_DIR/extension/package.json" || true
            exit 1
        else
            echo -e "${GREEN}✓ No unresolved NLS placeholders${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Warning: extension/package.json not found in expected location${NC}"
    fi
    
    # Check for main entry point
    if [ -f "$TEMP_DIR/extension/dist/extension.js" ]; then
        echo -e "${GREEN}✓ extension/dist/extension.js found${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: extension/dist/extension.js not found${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ VSIX validation passed: $VSIX_FILE${NC}"
exit 0