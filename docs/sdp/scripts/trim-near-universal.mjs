import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps } = config;

function findPanel(sgKey, tier) {
  return sdps.find(s => s.mastery?.subgroupKey === sgKey && s.mastery.subgroupTier === tier);
}

function removeParam(panel, paramKey) {
  if (!panel) return;
  panel.panelParameters = panel.panelParameters.filter(p => p.parameterKey !== paramKey);
}

// construct-titan: cdm 8→4 (keep T5,T6,T9,T10), mhp 7→4 (keep T2,T4,T5,T10), mdr 8→5 (keep T5,T7,T8,T9,T10)
for (const tier of [1, 2, 7, 8]) removeParam(findPanel('construct-titan', tier), 'cdm');
for (const tier of [7, 8, 9])    removeParam(findPanel('construct-titan', tier), 'mhp');
for (const tier of [3, 4, 6])    removeParam(findPanel('construct-titan', tier), 'mdr');

// construct-bot: def 8→5 (keep T5,T6,T7,T8,T10), atk 7→4 (keep T2,T7,T8,T10)
for (const tier of [1, 2, 9])    removeParam(findPanel('construct-bot', tier), 'def');
for (const tier of [4, 5, 9])    removeParam(findPanel('construct-bot', tier), 'atk');

// deity-emotion (aspect): mdf 7→5 (keep T2,T5,T6,T9,T10), ser 7→4 (keep T2,T5,T8,T9)
for (const tier of [1, 8])       removeParam(findPanel('deity-emotion', tier), 'mdf');
for (const tier of [4, 7, 10])   removeParam(findPanel('deity-emotion', tier), 'ser');

// reptile-draconite: atk 8→5 (keep T4,T5,T6,T7,T10)
for (const tier of [3, 8, 9])    removeParam(findPanel('reptile-draconite', tier), 'atk');

// construct-hazard: cri 7→4 (keep T2,T5,T7,T10)
for (const tier of [1, 4, 9])    removeParam(findPanel('construct-hazard', tier), 'cri');

writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Done.');
