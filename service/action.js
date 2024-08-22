import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { randomVal, randomPer } from '../utils/tool.js';
import { skillMap, doubleAttack, powerAttack } from '../service/skill.js';

// 전투

/**
 * [1] 일반 공격
 * @param {*} player
 * @param {*} monster
 * @param {*} logs
 */
export function nomalAttack(player, monster, logs, loopCnt) {
  let attackP = player.attack();
  const isCritical = player.isCritical();
  if (isCritical) {
    attackP = Math.floor(attackP * (1 + player._criticalDamagePer / 100));
    logs.push(`[${loopCnt}번째 턴] ${chalk.blueBright(player.name)} 크리티컬 발동!!`);
  }

  // 플레이어 공격
  let damage = monster.defend(attackP);
  if (damage > 0) {
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 ${chalk.redBright(`[몬스터]`)}에게 ${chalk.whiteBright.bgRedBright.bold('  ' + damage + '  ')}의 ${isCritical ? chalk.redBright.bold(`강력한`) : ``} 피해를 입혔습니다.`,
    );
  } else {
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}의 공격을 ${chalk.redBright(`[몬스터]`)}가 성공적으로 방어 했습니다.`,
    );
  }
  // 몬스터 공격
  damage = player.defend(monster.attack());
  if (damage > 0) {
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.redBright(`[몬스터]`)}가 ${chalk.blueBright(player.name)}에게 ${chalk.whiteBright.bgBlueBright.bold('  ' + damage + '  ')}의 피해를 입혔습니다.`,
    );
  } else {
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.redBright(`[몬스터]`)}의 공격을 ${chalk.blueBright(player.name)}가 성공적으로 방어 했습니다.`,
    );
  }
}

// [2] 특수 공격
export function skillAttack(player, monster, logs, loopCnt) {
  console.log(`\n` + chalk.green('옵션을 선택해주세요.'));
  console.log();

  for (let i = 1; i <= skillMap.size; i++) {
    console.log(
      chalk.blue(`${i}`) +
        chalk.white(` ${skillMap.get(i + '').name} (${skillMap.get(i + '').desc})`),
    );
  }
  console.log(chalk.gray(`1-${skillMap.size} 사이의 수를 입력한 뒤 엔터를 누르세요.`));
  const choice = readlineSync.question('당신의 선택은? ');
  logs.push(chalk.cyan(`[ ${choice}. ${skillMap.get(choice).name} ]`) + ` 를 선택하셨습니다. `);

  switch (choice) {
    case '1':
      doubleAttack(player, monster, logs, loopCnt);
      break;
    case '2':
      powerAttack(player, monster, logs, loopCnt);
      break;
  }
}

/**
 * [3] 방어하기 & 반격(확률)
 * @param {Player} player
 * @param {Monster} monster
 * @param {Array} logs
 */
export function defendAndCounter(player, monster, logs, loopCnt) {
  let damage = player.defend(monster.attack(), true);
  if (damage > 0) {
    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 방어 실패!!! ]`)}`);
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.redBright(`[몬스터]`)}가 ${chalk.blueBright(player.name)}에게 ${chalk.whiteBright.bgBlueBright.bold('  ' + damage + '  ')}의 피해를 입혔습니다.`,
    );
  } else {
    logs.push(`[${loopCnt}번째 턴] ${chalk.cyanBright.bold(`[ 방어 성공!!! ]`)}`);
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.redBright(`[몬스터]`)}의 공격을 ${chalk.blueBright(player.name)}가 성공적으로 방어 했습니다.`,
    );

    if (randomPer(60)) {
      damage = Math.floor(monster.defend(player.attack()) * 1.2);
      logs.push(
        `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 ${chalk.redBright(`[몬스터]`)}에게 ${chalk.whiteBright.bgRedBright.bold('  ' + damage + '  ')}의 되돌려주었습니다. ${chalk.cyanBright.bold(`[ 반격효과 데미지 120% ]`)}`,
      );
    }
  }
}

/**
 * 플레이어 도망 ( 확률 60% )
 * @param {*} player
 * @param {*} monster
 * @param {*} logs
 * @param {*} loopCnt
 */
export function playerEscape(player, monster, logs, loopCnt) {
  if (randomPer(player._escapePer)) {
    console.log(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 성공적으로 전투에서 도망쳤습니다.`,
    );
    return true;
  } else {
    let rNum = randomVal(10, 50);
    logs.push(
      `[${loopCnt}번째 턴] ${chalk.blueBright(player.name)}가 도망에 실패합니다. HP가 ${rNum} 감소합니다.`,
    );
    player._hp -= rNum;
    return false;
  }
}
