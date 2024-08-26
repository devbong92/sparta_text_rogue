import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { start } from '../server.js';

export let gameLv = 'NORMAL';
export let monsterPer = 1;
export let playerPer = 1;

export function displayGameLv() {
  console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.cyan(
      figlet.textSync('Ghost Rogue', {
        font: 'Ghost', //'Standard', Ghost, pagga
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );

  const line = chalk.magentaBright('='.repeat(115));
  console.log(line);

  console.log(chalk.yellowBright.bold('[Ghost Rogue]'), chalk.green('에 오신것을 환영합니다!'));

  console.log(line);

  // 설명 텍스트
  console.log(chalk.green('난이도 옵션을 선택해주세요.'));
  console.log();

  // 옵션들
  console.log(`${chalk.blue('1.') + chalk.white(' EASY')} ${gameLv === 'EASY' ? '[V]' : ''}`);
  console.log(`${chalk.blue('2.') + chalk.white(' NORMAL')} ${gameLv === 'NORMAL' ? '[V]' : ''}`);
  console.log(`${chalk.blue('3.') + chalk.white(' HARD')} ${gameLv === 'HARD' ? '[V]' : ''}`);
  console.log(chalk.blue('4.') + chalk.white(' 취소'));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));

  handleUserInput();

  start();
}

function handleUserInput() {
  const choice = readlineSync.question('입력: ');
  switch (choice) {
    case '1':
      monsterPer = 0.8;
      playerPer = 1.2;
      gameLv = 'EASY';
      break;
    case '2':
      monsterPer = 1;
      playerPer = 1;
      gameLv = 'NORMAL';
      break;
    case '3':
      monsterPer = 1.5;
      playerPer = 0.7;
      gameLv = 'HARD';
      break;
    case '4':
      break;
    default:
      console.log(chalk.red('올바른 선택을 하세요.'));
      handleUserInput();
  }
}
