# Wikipedia event tags

Canonical tag vocabulary for `Event.tags` across every category (`civilization`,
`country`, `sport`, and any future one). Tags are open/topic-defined in the schema --
the frontend just lists whatever distinct values show up in the data (`buildTagFilter`
in `frontend/timeline.js`) -- but the `wikipedia-research` skill treats this file as the
source of truth so a research pass doesn't need to scan every JSON under `data/` (including
`data/seed_data/`) just to find out what tags already exist.

| Tag | Use for |
|-----|---------|
| architecture | monuments, buildings, construction projects |
| art | paintings, sculpture, and other artistic works |
| battle | wars, sieges, military conflicts |
| collapse | the fall or end of a state, empire, or dynasty |
| founding | the establishment of a state, dynasty, or institution |
| governance | laws, administrative or political reform, constitutions |
| rebellion | revolts, uprisings, succession crises |
| religion | religious events, conversions, institutions, doctrine |
| science | scholarship, technology, discoveries, writing systems |

An event can carry more than one tag when it genuinely spans categories (e.g. a
founding secured by a battle, or a relief that's both an artistic work and a religious
statement).

## Adding a new tag

Only add a tag here if none of the existing ones fit what an event actually is --
reuse before inventing (`war` and `battle` shouldn't both exist, for instance). When a
research pass does introduce one:

1. Add it to the table above with a one-line description of what it's for.
2. Note the addition and why in the topic's section of the relevant
   `docs/wikipedia-sources-<category>s.md` file, so it's a visible decision tied to the
   topic that prompted it, not silent vocabulary drift.
