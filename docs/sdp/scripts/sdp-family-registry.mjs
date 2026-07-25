#!/usr/bin/env node
// Subgroup prefix registry — used by rewrite-sdp-unlock-prefix.mjs --list-prefixes.

export const FAMILIES = [
  { name: 'Undead',     subgroups: [ { prefix: 'GHO' }, { prefix: 'REB' }, { prefix: 'WIL' }, { prefix: 'BON' }, { prefix: 'ARM' } ] },
  { name: 'Reptile',    subgroups: [ { prefix: 'SNK' }, { prefix: 'DRG' }, { prefix: 'DCO' }, { prefix: 'LAM' }, { prefix: 'SAL' } ] },
  { name: 'Aquatic',    subgroups: [ { prefix: 'KAP' }, { prefix: 'FRG' }, { prefix: 'CRB' }, { prefix: 'FSH' }, { prefix: 'CPH' } ] },
  { name: 'Slime',      subgroups: [ { prefix: 'SLI' }, { prefix: 'TNT' }, { prefix: 'JEL' }, { prefix: 'AER' }, { prefix: 'CUB' } ] },
  { name: 'Plant',      subgroups: [ { prefix: 'TRP' }, { prefix: 'FUN' }, { prefix: 'FAE' }, { prefix: 'TRE' }, { prefix: 'FLW' } ] },
  { name: 'Beast',      subgroups: [ { prefix: 'HBR' }, { prefix: 'WNG' }, { prefix: 'BEK' }, { prefix: 'ROD' }, { prefix: 'QUA' } ] },
  { name: 'Insect',     subgroups: [ { prefix: 'LON' }, { prefix: 'WRM' }, { prefix: 'HIV' }, { prefix: 'JMP' }, { prefix: 'PAR' } ] },
  { name: 'Humanoid',   subgroups: [ { prefix: 'BUL' }, { prefix: 'ORC' }, { prefix: 'THF' }, { prefix: 'WLK' }, { prefix: 'CLN' } ] },
  { name: 'Construct',  subgroups: [ { prefix: 'GOL' }, { prefix: 'HAZ' }, { prefix: 'RBT' }, { prefix: 'HOM' }, { prefix: 'RUN' } ] },
  { name: 'Deity',      subgroups: [ { prefix: 'ELE' }, { prefix: 'ASP' }, { prefix: 'SOV' }, { prefix: 'SIN' } ] },
];
