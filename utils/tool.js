import chalk from 'chalk';
import figlet from 'figlet';

/**
 * min ~ max 범위의 랜덤 값 리턴
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomVal(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * percent 확률로 성공 여부 리턴
 * @param {number} percent
 * @returns {boolean}
 */
export function randomPer(percent) {
  const rNum = Math.floor(Math.random() * 99 + 1);
  return rNum <= percent;
}

/**
 * 딜레이
 * @param {number} sec
 * @returns
 */
export async function delay(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

// 문자 뒤에서부터 출력 (출력문자열, 출력지연(초), chalk.텍스트색상, chalk.===색상)
export async function textEffectReverse(text, setDelay, color, varcolor) {
  let textEffectString = '';
  for (let i = 0; i < text.length; i++) {
    console.clear();
    textEffectString = text.slice(text.length - i - 1, text.length);
    console.log(
      color(
        figlet.textSync(textEffectString, {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
        }),
      ),
    );

    await delay(setDelay);
  }
  await delay(0.5);
}
