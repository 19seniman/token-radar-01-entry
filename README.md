[![make.fun · token-radar-01](https://make.fun/badge/token-radar-01.svg)](https://make.fun/bounty/token-radar-01?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)
[![rank](https://make.fun/badge/token-radar-01/19seniman/token-radar-01-entry/rank.svg)](https://make.fun/bounty/token-radar-01)
[![reward](https://make.fun/badge/token-radar-01/19seniman/token-radar-01-entry/reward.svg)](https://make.fun/bounty/token-radar-01)

# token-radar-01

A launch radar for the frozen DefiLlama snapshot: which protocols still record no token, what a
token would be worth if they launched, and the steps to farm each one before it does.

Built for [the make.fun bounty](https://make.fun/bounty/token-radar-01).

## What it does

- Reads `/input/snapshot.json` (758 protocols, 40 on the watchlist, $50M floor)
- Ranks every pre-token protocol by **implied value**: TVL times a category multiple, corrected for
  the 7-day trend, the strongest chain it runs on, and how long it has been tracked
- Covers all 40 watchlist protocols, then 160 pre-token protocols below the floor
- Writes `board.json` (200 rows), a static dashboard, three screenshots and `dossier.json`

The category multiples are the model's stated assumption, not a measurement: the snapshot carries no
score, and working one out is the entry's work.
