# Crafting tools and materials

> **Status: projected, 2026-08-10.** This records the intended shape of non-cooking crafting - which
> tool answers for which material, and which materials each equipment family is made of. **The database
> is mid-build and this document describes intent, not inventory.** Do not read a family that consumes
> none of a material yet as evidence the projection is wrong.
>
> **Related:** [`../food/recipe-system.md`](../food/recipe-system.md) holds the cooking half, where a
> tool answers *how* rather than *what of*, and one recipe names exactly one tool.

---

## Tools sort by material, not by profession

The old tool set sorted by trade - a Hammer for smithing, Mitts for another part of smithing, an
Eyeglass for survival gear - which meant nobody could say why Mitts gated a wand. Sorting by material
makes the requirement legible and makes it **derivable**: a recipe consuming Iron Ore obviously needs
the metal tool, so a recipe's tools can be checked against its own ingredients.

| Tool | Material | Covers |
|---|---|---|
| **cross-pein** | metal | ore, ingot, and anything worked hot |
| **adze** | wood | lumber, branches, paper stock — **and bone, fang, claw and root**, which are worked with the same rasps and gouges that shape wood |
| **graver** | gems | cut stones, raw colour stones, and plain stone |
| **shears** | fabric | pelt, hide, scale, veil, cloth |
| **wirestrippers** | circuitry | batteries, voltaic components, anything with a current in it |
| **alembic** | catalysts | essences, cores, powders — and soft organics like tongue, which are brewed rather than cut |

**Cooking names one tool per recipe; crafting names one per material it consumes.** That asymmetry is
deliberate. A cooking tool answers *how the dish is made* and there is only ever one answer. A crafting
tool answers *what the thing is made of*, and a spear is honestly two things.

**Requiring no tool at all is a legitimate answer.** Gloves get assembled by hand, which is why fifteen
of the twenty-two fist recipes ask for nothing.

---

## What each family is made of

| Family | Materials |
|---|---|
| **swords** | metal + gems |
| **spears** | metal + wood |
| **guns** | metal + wood + circuitry |
| **axes** | metal + wood |
| **wands** | wood + gems |
| **fists** | metal + fabric + circuitry |
| **relics** (offhand) | gems + catalysts |
| **gauntlets** (offhand) | metal + fabric |
| **shields** (offhand) | metal |
| **cloth** (armor) | fabric + gems + catalysts |
| **mail** (armor) | fabric + metal + circuitry |
| **plate** (armor) | metal + gems |
| **feet** | fabric + metal + circuitry, depending on which is being crafted |
| **accessories** | various |
| **gems for refinement** | gems + catalysts |
| **potions** | catalysts |

Alchemy is the least built of these - both the rune and potion lines need reworking, and the materials
they will consume are largely unauthored.

---

## Named weapons need no material of their own

**There is no dedicated named-weapon material, and there is not meant to be one.** A ⭐ is found in the
world; every rung above it is forged by consuming the rung beneath, and the right to forge is what
Viktor's questline sells. [`../acquisition.md`](../acquisition.md) is the authority on
that chain and this document defers to it entirely.

What the upper rungs *do* demand is **high-tier material from disciplines other than weaponcraft** —
armourcraft, alchemy and cooking among them. That is deliberate: top-tier materials otherwise have no
sink, and requiring a dish to finish a sword is this game's premise expressed as a mechanic rather than
as a joke.

---

## Open

- **What tool does equipment-as-fodder require?** 256 ingredient uses are finished equipment consumed to
  build the next tier — a Rusty Hatchet into a better axe. The natural rule is that equipment inherits
  the tool of its dominant material, so a hatchet is metal and a wand is wood, but it has not been
  decided.
- **`survive-extra` (Accessorizing) has no recipes yet**, which is where "accessories: various" is
  headed.
- **Plain stone under the graver is an inference, not a ruling.** Round, Circular and Worn Stone are
  worked with the same carving tools as gems, so they are filed there; bone and root were assigned to
  the adze explicitly, and stone never came up.
