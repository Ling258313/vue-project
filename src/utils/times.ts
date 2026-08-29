//封装一个函数，获取一个结果：时间
export const getTime = () => {
  const hours = new Date().getHours()
  if (hours <= 9) return '早上'
  if (hours <= 12) return '上午'
  if (hours <= 18) return '下午'
  return '晚上'
}