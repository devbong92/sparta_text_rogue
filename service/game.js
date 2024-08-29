import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { randomVal, randomPer, textEffectReverse, delay } from '../utils/tool.js';
import { nomalAttack, skillAttack, defendAndCounter, playerEscape } from '../service/action.js';
import { start } from '../server.js';
import { setAchievements } from './achievement.js';
import { playerPer, monsterPer, gameLv } from './gameLevel.js';

class Character {
  constructor() {
    this._hp = 100;
    this._minDamage = 5;
    this._maxPer = 20;
    this._maxDamage = Math.floor(this._minDamage * (1 + this._maxPer / 100));
    this._escapePer = 60;
    this._skillPer = 80;
    this._defensePer = 30;
    this._defense = 0;
    this._criticalChancePer = 10;
    this._criticalDamagePer = 180;

    this._name = '';
    this._type;
  }

  // 공격
  attack() {
    return randomVal(this._minDamage, this._maxDamage);
  }

  // 방어
  defend(damage, mode = false) {
    if (mode && randomPer(this._defensePer)) {
      return 0;
    }
    this._hp -= damage;
    return damage - this._defense;
  }

  get name() {
    let str = this._type;
    if (this._name) {
      str = `${this._type}(${this._name})`;
    }
    return str;
  }
}

class Player extends Character {
  constructor() {
    super();
    this._type = '플레이어';
    this._defense = 5;
    this._hp = Math.floor(100 * playerPer);
    this._minDamage = Math.floor(5 * playerPer);
    this._maxPer = Math.floor(20 * playerPer);
    this._maxDamage = Math.floor(this._minDamage * (1 + this._maxPer / 100));
  }

  // 스테이지 업 효과
  stageUp(stage, logs) {
    let rNum = randomVal(1, 7);
    let addVal = 0;
    let str = `[ 스테이지 클리어 보상 ]\n> ${chalk.blueBright(this._type)} 능력치가 상승합니다.\n`;

    switch (rNum) {
      case 7:
        addVal = randomVal(3, 10);
        this._defense += addVal;
        str += `\n- 방어 수치 : ${addVal} UP!`;
      case 6:
        addVal = randomVal(3, 7);
        this._skillPer += addVal;
        str += `\n- 스킬 발동 확률 : ${addVal}% UP!`;
      case 5:
        addVal = randomVal(1, 3);
        this._escapePer += randomVal(1, 3);
        str += `\n- 도망 성공 확률 : ${addVal}% UP!`;
      case 3:
        addVal = randomVal(5, 20);
        this._minDamage += addVal;
        str += `\n- 최소 공격력 : ${addVal} UP!`;
      case 2:
        addVal = randomVal(1, 10);
        this._maxPer += addVal;
        this._maxDamage = Math.floor(this._minDamage * (1 + this._maxPer / 100));
        str += `\n- 최대 공격력 배율 : ${addVal}% UP!`;
      default:
        addVal = randomVal(20, 50);
        this._hp += addVal;
        str += `\n- 체력 : ${addVal} UP!`;
    }

    str += `\n해당 능력이 상승하였습니다.`;
    logs.push(str);
  }

  // 크리티컬
  isCritical() {
    if (randomPer(this._criticalChancePer)) {
      return true;
    }
    return false;
  }
}

class Monster extends Character {
  constructor() {
    super();
    this._type = '고스트';
    this._hp = Math.floor(20 * monsterPer);
    this._minDamage = Math.floor(3 * monsterPer);
    this._maxPer = Math.floor(10 * monsterPer);
    this._maxDamage = Math.floor(this._minDamage * (1 + this._maxPer / 100));
  }

  // 스테이지 업 효과
  stageUp(stage, logs) {
    this._minDamage += randomVal(5, 20 + stage * 2);
    this._maxPer += randomVal(1, 10 + stage * 2);
    this._maxDamage = Math.floor(this._minDamage * (1 + this._maxPer / 100));
    this._hp += randomVal(20 + stage * 2, 50 + stage * 2);

    if (stage === 5 || stage === 10) {
      logs.push(`\n` + '='.repeat(50));
      this._hp += 20;
      logs.push(
        `> [ BOSS 등장!!! ] Stage${stage}의 ${chalk.redBright(this._type)}의 기세가 강렬합니다.`,
      );
      logs.push('='.repeat(50) + `\n`);
    } else {
      logs.push(`\n` + '='.repeat(50));
      logs.push(`> Stage${stage}의 ${chalk.redBright(this._type)}는 더욱 강력해 보입니다.`);
      logs.push('='.repeat(50) + `\n`);
    }
  }
}

// 스테이지 증가
function stageUp(stage, player, monster, logs) {
  player.stageUp(stage, logs);
  monster.stageUp(stage, logs);
}

// 게임 타이틀 표기
async function gameTitle() {
  await textEffectReverse('Ghost Rogue', 0.08, chalk.black, chalk.black);

  const colors = [chalk.yellowBright, chalk.redBright, chalk.cyan];
  for (let i = 0; i < 3; i++) {
    await delay(0.3);
    console.clear();
    console.log(
      colors[i](
        figlet.textSync('Ghost Rogue', {
          font: 'Ghost', //'Standard', Ghost, pagga
          horizontalLayout: 'default',
          verticalLayout: 'default',
        }),
      ),
    );
  }

  await delay(0.3);
}

// 스테이터스 표시
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n============= Current Status =============`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.magenta(`| Game Mode: ${gameLv} `) +
      chalk.blueBright(
        `\n| ${player.name} 정보 HP: ${player._hp}, Attack: ${player._minDamage} ~ ${player._maxDamage}  `,
      ) +
      chalk.redBright(
        `\n| ${monster.name} 정보 HP:  ${monster._hp}, Attack: ${monster._minDamage} ~ ${monster._maxDamage}  |`,
      ),
  );
  console.log(chalk.magentaBright(`============================================\n`));
}

// 전투
const battle = async (stage, player, monster) => {
  let logs = [];
  let loopCnt = 1;

  if (stage > 1) {
    if (stage === 5 || stage === 10) {
      monster._name = 'BOSS';
    }
    stageUp(stage, player, monster, logs);
  } else {
    await gameTitle();
    console.log(chalk.cyan(`\n========= 게임을 진행할 플레이어 이름을 입력하세요. =========\n`));
    const name = readlineSync.question('플레이어 이름: ');
    player._name = name;
  }

  logs.push(chalk.green(`\n========= [Stage ${stage}] 에 진입하셨습니다. =========\n`));

  while (player._hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 일반공격. 2.특수공격 (${player._skillPer}%). 3.방어한다 (${player._defensePer}%) 4. 도망치기 (${player._escapePer}%) `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 도망
    if (choice === '4') {
      if (playerEscape(player, monster, logs, loopCnt)) {
        break;
      }
    }

    switch (choice) {
      case '1': // 일반 공격
        nomalAttack(player, monster, logs, loopCnt);
        break;
      case '2': // 특수 공격
        skillAttack(player, monster, logs, loopCnt);
        break;
      case '3': // 방어
        defendAndCounter(player, monster, logs, loopCnt);
        break;
    }

    if (monster._hp <= 0) {
      console.clear();
      logs.push(
        chalk.redBright(`\n-----[ S T A G E (${stage}) C L E A R ]----- 
                                \n     ${monster.name} 처치했습니다!!!
                                \n-----[ S T A G E (${stage}) C L E A R ]-----`),
      );
      displayStatus(stage, player, monster);

      logs.forEach((log) => console.log(log));

      setAchievements(stage, player._name);

      if (stage === 10) {
        console.log(
          chalk.green(
            `\n마지막 스테이지(${stage})를 클리어했습니다!\n1. 게임 종료. 2. 로비로 돌아간다.`,
          ),
        );
      } else {
        console.log(
          chalk.green(`\n스테이지 ${stage} 클리어!\n1. 다음 스테이지로. 2. 로비로 돌아간다.`),
        );
      }

      const exit = readlineSync.question('당신의 선택은? ');
      if (exit === '2') {
        console.clear();
        logs.push(
          chalk.gray(`\n-----[ G A M E (${stage}) E N D ]----- 
                                  \n     게임이 종료되었습니다. \n     STAGE : ${stage}
                                  \n-----[ G A M E (${stage}) E N D ]-----`),
        );
        logs.forEach((log) => console.log(log));

        return false;
      } else {
        break;
      }
    }

    loopCnt++;
  } // while

  if (player._hp <= 0) {
    console.clear();
    logs.push(
      chalk.gray(`\n-----[ G A M E (${stage}) E N D ]----- 
                  \n     ${chalk.blueBright(player.name)}가 사망했습니다.
                  \n     게임이 종료되었습니다. \n     STAGE : ${stage}
                  \n-----[ G A M E (${stage}) E N D ]-----`),
    );
    logs.forEach((log) => console.log(log));
    return false;
  }
  return true;
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  let isGameClear;
  while (stage <= 10) {
    const monster = new Monster(stage);
    isGameClear = await battle(stage, player, monster);

    if (!isGameClear) {
      break;
    }
    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }

  if (isGameClear) {
    if (stage >= 10) {
      let logs = [];
      console.clear();
      console.log(
        chalk.cyan(
          figlet.textSync('Ghost Rogue', {
            font: 'Ghost', //'Standard', Ghost, pagga
            horizontalLayout: 'default',
            verticalLayout: 'default',
          }),
        ),
      );
      console.log(
        chalk.cyan(
          figlet.textSync('GAME CLEAR!!', {
            font: 'Ghost', //'Standard', Ghost, pagga
            horizontalLayout: 'default',
            verticalLayout: 'default',
          }),
        ),
      );
      logs.push(
        chalk.magentaBright(`\n-----[ G A M E :: C L E A R ]----- 
                    \n     게임을 클리어 하셨습니다!!!
                    \n-----[ G A M E :: C L E A R ]-----`),
      );
      logs.forEach((log) => console.log(log));
    }
  } else {
    start();
  }
}
