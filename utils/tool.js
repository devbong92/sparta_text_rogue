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
