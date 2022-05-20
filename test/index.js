/*
 * @Author: PX
 * @Date: 2022-05-19 15:22:41
 * @LastEditTime: 2022-05-20 16:27:20
 * @LastEditors: PX
 * @Description:  
 */
import { toFullNum, toThousandths } from '../src/index.js'

console.log('\n --------------- Testing --------------- \n');

let num = '-3.348034851321123456789e12'
console.log('num=',num);
let fullNum = toFullNum(num,6)
let thousandNum = toThousandths(fullNum)


console.log(fullNum);
// console.log(thousandNum);
// console.log(toThousandths(fullNum,5));