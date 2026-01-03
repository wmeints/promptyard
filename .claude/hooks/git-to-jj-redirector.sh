#!/bin/bash

# Hook to intercept git commands and redirect to jujutsu (jj)
# Claude Code will receive an error when it tries to run git commands
# Only activates if the project directory contains a .jj directory

# Check if this is a jujutsu repository
if [[ ! -d "$CLAUDE_PROJECT_DIR/.jj" ]]; then
  # Not a jujutsu repository, allow all commands
  exit 0
fi

# Read JSON input from stdin
input=$(cat)

# Extract the command from the JSON input
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Check if command starts with "git " or is exactly "git"
if [[ "$command" =~ ^git($|[[:space:]]) ]]; then
  echo "This repository uses jujutsu (jj) instead of git. Please use 'jj' commands instead of 'git' commands." >&2
  exit 2
fi

# Allow non-git commands to proceed
exit 0
