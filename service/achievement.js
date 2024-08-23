import chalk from 'chalk';
import figlet from 'figlet';

let clearStage = 0;
let clearTime = 0;
let clearName = '';

export function displayAchievements() {
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

  console.log(
    `\n ${chalk.magentaBright.bold('======  [ 업 적 ]  ====== ')} \n` +
      `\n====== [ 클리어 스테이지 ] : ${clearStage} ` +
      `\n====== [ 클리어 타임 ] : ${clearTime} ` +
      `\n====== [ 플레이어 이름 ] : ${clearName}\n`,
  );

  console.log(line);

  console.log(chalk.yellowBright.bold('[Ghost Rogue]'), chalk.green('에 오신것을 환영합니다!'));

  console.log(line);

  // 설명 텍스트
  console.log(chalk.green('옵션을 선택해주세요.'));
  console.log();

  // 옵션들
  console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
  console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
  console.log(chalk.blue('3.') + chalk.white(' 옵션'));
  console.log(chalk.blue('4.') + chalk.white(' 종료'));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

export function setAchievements(stage, playerName) {
  const now = new Date();
  now.setHours(now.getHours() + 9);

  clearName = playerName || '플레이어';
  clearStage = stage;
  clearTime = now.toISOString().replace('T', ' ').substring(0, 19);
}
