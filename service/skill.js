import chalk from 'chalk';
import { randomVal, randomPer } from '../utils/tool.js';

export const skillMap = new Map();
skillMap.set('1', {
  name: '연속 공격',
  desc: '공격을 두번',
});
skillMap.set('2', {
  name: '한방 공격',
  desc: '데미지가 두 배',
});

/**
 * [특수공격] 연속 공격
 * @param {Player} player
 * @param {Monster} monster
 * @param {Array} logs
 * @param {number} loopCnt
 * @returns {number}
 */
export function doubleAttack(player, monster, logs, loopCnt) {
  let damage = 0;
  if (randomPer(player._skillPer)) {
    let attackP1 = player.attack();
    let attackP2 = player.attack();
    let criticalCnt = 0;
    let isCritical = player.isCritical();
    if (isCritical) {
      attackP1 = Math.floor(attackP1 * (1 + player._criticalDamagePer / 100));
      criticalCnt++;
    }
    isCritical = player.isCritical();
    if (isCritical) {
      attackP2 = Math.floor(attackP2 * (1 + player._criticalDamagePer / 100));
      criticalCnt++;
    }

    if (criticalCnt > 0) {
      logs.push(
        `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)} 크리티컬 발동!! (발동 횟수 : ${criticalCnt})`,
      );
    }

    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 연속 공격 성공!!! ]`)}`);
    damage = monster.defend(attackP1 + attackP2);
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 ${chalk.redBright(`[` + monster.name + `]`)}에게 ${chalk.whiteBright.bgRedBright.bold('  ' + damage + '  ')}의 피해를 입혔습니다.`,
    );
  } else {
    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 연속 공격 실패!!! ]`)}`);
  }

  return damage;
}

/**
 * [특수공격] 한방 공격
 * @param {Player} player
 * @param {Monster} monster
 * @param {Array} logs
 * @param {number} loopCnt
 * @returns {number}
 */
export function powerAttack(player, monster, logs, loopCnt) {
  let attackP = player.attack();
  const isCritical = player.isCritical();
  if (isCritical) {
    attackP = Math.floor(attackP * (1 + player._criticalDamagePer / 100));
    logs.push(`[${loopCnt}번째 턴] ${chalk.blueBright(player.name)} 크리티컬 발동!!`);
  }

  let damage = 0;
  if (randomPer(player._skillPer)) {
    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 한방 공격 성공!!! ]`)}`);
    damage = monster.defend(attackP * 2);
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 ${chalk.redBright(`[` + monster.name + `]`)}에게 ${chalk.whiteBright.bgRedBright.bold('  ' + damage + '  ')}의 ${isCritical ? chalk.redBright.bold(`강력한`) : ``}피해를 입혔습니다.`,
    );
  } else {
    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 한방 공격 실패!!! ]`)}`);
  }

  return damage;
}
