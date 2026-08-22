# Food chain durations and colors

> **Authoring source of truth** for Chef Adventure food arc states (ids 251–278, 281–282).
> Phase length uses **`J-ABS` core** `<stateDuration:FRAMES>` on each state note — **not**
> `stepsToRemove` in the database.
>
> **Why:** RPG Maker MZ’s state editor caps `stepsToRemove` at **9999** (~2.8 min at 60 fps).
> Opening a state in MZ and saving can clamp the field even if JSON had a higher value.
> Keep `stepsToRemove` at **9999** (or any placeholder) in MZ; real duration lives in the note.

**Runtime:** `RPG_State.jabsStateHasMapTimer` — true when `<stateDuration:N>` or
`<stateDurationSec:N>` is present (**N > 0**) and `<indefiniteState>` is absent. Duration frames come
from `jabsStateDurationFrames` (tags first; `stepsToRemove` is only a legacy/MZ placeholder).
Use `<indefiniteState>` for buffs that never expire on the map. MZ `removeByWalking` is not used.

**Related:** [`../sdp/archetype-mapping.md`](../sdp/archetype-mapping.md) (food overview), [`../sdp/implementation-status.md`](../sdp/implementation-status.md) (cookbook).

Last updated: **2026-06-02**

---

## Frame vocabulary (60 fps)

| Label | Time | Frames |
|--------|------|--------|
| Tiny | 30 s | 1 800 |
| Short | 1 min | 3 600 |
| Medium | 2 min | 7 200 |
| Long | 3 min | 10 800 |
| Hella long | 5 min | 18 000 |
| Full meal chain | ~10 min | **60 000** (sum of three phases) |

Optional note alias: `<stateDurationSec:300>` → 300 × 60 = 18 000 frames.

---

## Phase colors (HUD bar)

Each group uses the same **grammar** as protein: saturated entry → bright peak → warm tail.

| Group | Well Fed | Peak | Tail |
|--------|----------|------|------|
| Protein | `#44cc44` | `#88cc22` | `#ccaa00` |
| Vegetable | `#38b86c` | `#62cc44` | `#a8c828` |
| Fruit | `#66bb66` | `#ee9922` | `#cc7722` |
| Carb | `#b89248` | `#d4b84a` | `#c88820` |
| Dairy | `#5a94c4` | `#7ab8e8` | `#b8c4a8` |
| Sweet | `#c85898` | `#ff66bb` | `#ddaa44` |
| Overstuffed | `#cc2244` | — | — |
| Bloated | — | — | `#994466` |

---

## Normal meal chains

### Protein — **10:00** total (60 000)

| State id | Name | Phase | `<stateDuration>` | `stepsToRemove` (MZ placeholder) |
|----------|------|--------|------------------|----------------------------------|
| 251 | Well Fed (protein) | Well | **18 000** (5m) | 9999 |
| 252 | Pumped | Peak | **7 200** (2m) | 9999 |
| 253 | Hangry | Tail | **10 800** (3m) | 9999 |

### Vegetable — **10:00** total

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 256 | Well Fed (veggie) | Well | **10 800** (3m) | 9999 |
| 257 | Refreshed | Peak | **10 800** (3m) | 9999 |
| 258 | Light-headed | Tail | **10 800** (3m) | 9999 |

### Fruit — **~9.2 min** total (55 200)

Dominant peak bar on HUD; slightly under 10m by design.

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 261 | Well Fed (fruit) | Well | **3 600** (1m) | 9999 |
| 262 | Energized | Peak | **48 000** (8m) | 9999 |
| 263 | Crashing | Tail | **3 600** (1m) | 9999 |

### Carb — **10:00** total

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 266 | Well Fed (carb) | Well | **10 800** (3m) | 9999 |
| 267 | Fortified | Peak | **18 000** (5m) | 9999 |
| 268 | Carb Coma | Tail | **3 600** (1m) | 9999 |

### Dairy — **10:00** total

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 271 | Well Fed (dairy) | Well | **10 800** (3m) | 9999 |
| 272 | Focused | Peak | **10 800** (3m) | 9999 |
| 273 | Foggy | Tail | **10 800** (3m) | 9999 |

### Sweet — **~4 min** total (12 600)

Short snack arc; Hyper is strong — not a floor-long meal.

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 276 | Well Fed (sweet) | Well | **1 800** (30s) | 9999 |
| 277 | Hyper | Peak | **7 200** (2m) | 9999 |
| 278 | Gassy | Tail | **3 600** (1m) | 9999 |

---

## Overstuffed punishment chain — **5:00** total (18 000)

| State id | Name | Phase | `<stateDuration>` | Placeholder |
|----------|------|--------|------------------|-------------|
| 281 | Overstuffed | Entry | **10 800** (3m) | 9999 |
| 282 | Bloated | Tail | **7 200** (2m) | 9999 |

---

## Note template (copy per state)

```text
<foodChain:TYPE>
<foodGroupColor:#RRGGBB>
<stateDuration:FRAMES>
<applyStateOnExpire:[NEXT_ID, 100]>   // omit on tail / terminal
```

Tail states have no `applyStateOnExpire`. Overstuffed entry links to Bloated via expire tag.

---

## Tuning

- **~10 min** normal meals: one eat per large dungeon loop; re-feed timing matters (Field Medic).
- **~4 min** sweet: burst option, not a replacement for protein/veg/carb/dairy.
- If tails are rarely seen, shave all phases in a group by **×0.8** (multiply frame counts).
- If fruit peak feels too long, reduce 262 from 48 000 toward 43 200 (7.2m peak, ~8.4m total).
