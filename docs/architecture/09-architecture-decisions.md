# Architecture decisions

The main files in the architecture documentation explain the current state of
the architecture. While useful on its own, it's important to understand more
about how certain decisions came to be. This is why we record architecture
decision records.

## The structure of an architecture decision

We have a very basic template for recording architecture decisions.
The template looks like this:

```markdown
# ADR{number} - {title}

- Status: {Draft, Accepted, Superseded}
- Date: {Date the ADR was recorded}
- Superseded by (Optional): {Link to follow-up decision}

## Context

{Description of why this decision needed to be taken and what options we had}

## Decision

{The final decision that we took on the matter}

## Consequences

{List of consequences. What became easier and what's now more difficult?}
```

## Guidelines for recording decisions

We have a few guidelines that we want you to follow when you propose a decision:

- Make sure the title lists the decision made.
- Make sure that you include alternatives for the decision. 
- Clearly explain why a decision needs to be made.
- Clearly state what decision was made in more than one sentence.
- Clearly state the consequences of the decision
  - List new risks that we introduce with the decision
  - List what risks were solved because of the decision
  - List the improvements to the product
- ADR numbers should be prefixed to have a fixed length of 3 digits e.g. 001, 010
- All decisions are stored in `docs/architecture/decisions` as separate files.
