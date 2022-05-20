/*
 * @Author: PX
 * @Date: 2022-05-20 09:29:27
 * @LastEditTime: 2022-05-20 16:25:50
 * @LastEditors: PX
 * @Description:  
 */
import BigNumber from 'bignumber.js'


/**
 * 获得补位的0和小数点
 * @param {Number} num 补充的数量
 * @returns 
 */
export const padZero = (num) => {
  let str = ''
  for (let i = 1; i < Math.abs(num); i++) {
    str += '0'
  }
  if (num < 0) return '0.' + str
  else return str + '0'
}


/**
  * 转换为完整数字
  * @param {String} val 要格式化的值
  * @param {Number} digits 小数长度
  */
export const toFullNum = (val, digits) => {
  if (val === Infinity || isNaN(Number(val)) || typeof val === 'object' || !val) return '0'
  if (val instanceof BigNumber) val = val.toString()
  else val = String(val)

  let result = ''

  if (!val.includes('e')) {
    result = val
  } else {
    // 包含 e
    let zoomFactor = parseInt(val.substring(val.indexOf('e') + 1)) // 缩放倍数，负数则将小数点前移进行缩小
    let partOfInt = val.substring(parseFloat(val) >= 0 ? 0 : 1, val.includes('.') ? val.indexOf('.') : val.indexOf('e')) //整数部分
    let partOfDecimal = val.includes('.') ? val.substring(val.indexOf('.') + 1, val.indexOf('e')) : ''// 小数部分

    if (zoomFactor < 0) {
      // 小数位向左移
      result = padZero(zoomFactor) + partOfInt + partOfDecimal // 正数
    } else {
      // 小数位向右移
      let arr = (partOfInt + partOfDecimal + padZero(zoomFactor)).split('')
      arr.splice(zoomFactor + 1, 0, '.')
      result = arr.join('')
    }

    if (parseFloat(val) < 0) result = '-' + result// 负数

    // console.log('val:', val, ' 缩放倍数:', zoomFactor, ' 整数部分：', partOfInt, ' 小数部分:', partOfDecimal, ' 输出:', result);

  }
  // 小数位控制
  if (result.includes('.')) {
    let partOfinteger = result.substring(0, result.indexOf('.') + 1)
    let partOfDecimal = result.substring(result.indexOf('.') + 1)
    if (digits !== undefined && partOfDecimal.length > digits) partOfDecimal = partOfDecimal.substring(0, digits) // 截取前decimalLength位
    // 小数后面的0去掉
    for (let i = partOfDecimal.length - 1; i >= 0; i--) {
      if (partOfDecimal[partOfDecimal.length - 1] === '0') partOfDecimal = partOfDecimal.substring(0, i - 1)
    }
    result = partOfinteger + partOfDecimal
    if (result.slice(-1) === '.') result = result.substring(0, result.length - 1) // 没有小数位则去掉小数点
    if (['', '-0'].includes(result)) result = '0'
  }
  // console.log('输入:', val, ' 输出:', result);
  return result
}

/**
 * 数字千分位化
 * @param {String|Number} val 转化的目标
 * @param {Number} digits 小数位
 * @returns {String}
 */
export const toThousandths = (val, digits) => {
  if (val === Infinity || isNaN(Number(val)) || typeof val === 'object') return '-'
  if (typeof val === 'string' && val.includes('e')) val = toFullNum(val)
  if (String(parseFloat(val)).includes('e')) val = toFullNum(val)
  else val = String(val)
  // else val = String(parseFloat(val) || 0)
  // val = parseFloat((val + '').replace(/[^\d.-]/g, '')).toFixed(digits) + ''
  var l = val.split('.')[0].split('').reverse(),
    r = val.split('.')[1] || '',
    t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  let res = t.split('').reverse().join('') + '.' + r

  // 去掉多余的0
  if (res.includes('.')) {
    let arr = res.split('')
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === '0' && i === arr.length - 1) arr.splice(i, 1)
    }
    if (arr.indexOf('.') === arr.length - 1) arr.splice(-1) // 去掉最后的 .
    res = arr.join('')
  }
  // 若负号之后是,则去掉
  if (res.indexOf('-') === 0) {
    if (res.indexOf(',') === 1) {
      res = res[0] + res.slice(2)
    }
  }
  // 小数位控制
  if (digits && res.includes('.')) {
    let indexOfPoint = res.indexOf('.')
    res = res.slice(0, indexOfPoint) + res.slice(indexOfPoint, indexOfPoint + 1 + digits)
  }
  return res
}


/**
 * 
 * @param {*} num 
 * @param {*} digits 
 * @returns 
 */
export function toMKNum(num, digits) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (
    (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
  )
}