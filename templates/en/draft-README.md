# draft — short-term memory

Things offloaded from discussion that aren't worth committing yet. **One topic per file**: `YYYY-MM-DD-topic.md` (`-` instead of spaces — a space breaks half the links to the file), plus a line of "how it came up".

Both halves of the name earn their place: the **date** is the time handle ("that batch from last month") and marks the file as a snapshot of one discussion; the **topic** is the semantic handle ("the one about X"). With both in the filename you can find it without opening anything.

## How it works (like short-term memory)
- **One topic block per file**, carrying its context — not scattered sticky notes. The unit of memory is an episode, not an atom.
- **Talked about it again? Open a new file (new date).** Don't overwrite the old one: several snapshots of one topic piling up *is* the signal that it's ready to consolidate.
- **Decays by default.** Untouched topics fade — forgetting is the feature, not a failure. Most should fade; only a few consolidate.
- **Rescued by use.** A topic you keep returning to has proven it should consolidate → distil it into the three files / concepts, then delete it here.
- **Recency from git** (longest-untouched = candidate to resolve), not hand-maintained.
- **Three exits, all leave draft**: consolidate · let go (delete) · reject (tombstone in `history/`).

## How judge sweeps it
Use git recency to surface the longest-untouched topics and rule on each: rescue (consolidate) or let go (fade). The test is **recency + frequency, not age** — an old topic you keep coming back to is alive; a recent one you never revisited isn't.
