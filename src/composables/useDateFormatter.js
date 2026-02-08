export function useDateFormatter() {
  /**
   * 任意の日付を任意の形式に変換する
   * @param {string|Date} input - 日付文字列または Date オブジェクト
   * @param {string} format - 出力形式（例：'yyyy/MM/dd'）
   */
  const formatDate = (input, format = 'yyyy/MM/dd') => {
    if (!input) return ''

    const date = new Date(input)
    if (isNaN(date.getTime())) return ''

    const map = {
      yyyy: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      dd: String(date.getDate()).padStart(2, '0'),
      HH: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0'),
    }

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, m => map[m])
  }

  const isFutureDate = (dateString) => {
    if (!dateString) return false

    const date = new Date(toISO(dateString))
    if (isNaN(date.getTime())) return false  // ← ここも必要

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date > today
  }
  const toISO = (str) => {
    if (!str) return '1970-01-01'
    return str.replace('頃', '')
              .replace('年', '-')
              .replace('月', '-')
              .replace('日', '')
  }

  /**
   * 今日の日付を指定フォーマットで返す
   */
  const today = (format = 'yyyy/MM/dd') => {
    return formatDate(new Date(), format)
  }

  return {
    formatDate,
    today,
    isFutureDate,
    toISO
  }
}

