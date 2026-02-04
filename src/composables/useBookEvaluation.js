export function useBookEvaluation() {
  const evalList = [
    { code: 1, label: 'C' },
    { code: 2, label: 'B' },
    { code: 8, label: 'A' },
    { code: 9, label: 'AA' },
  ]

  const getEvaluationLabel = (code) => {
    const item = evalList.find(s => s.code === Number(code))
    return item ? item.label : ''
  }

  return {
    evalList,
    getEvaluationLabel,
  }
}
