export function useBookStatus() {
  const statusList = [
    { code: 0, label: '未処理' },
    { code: 2, label: '新刊発売予定' },
    { code: 4, label: '読書中' },
    { code: 5, label: '読んだ' },
    { code: 6, label: '未読' },
    { code: 8, label: '未発売' },
    { code: 90, label: '完読' },
    { code: 95, label: 'つまらん' },
  ]

  const getStatusLabel = (code) => {
    const item = statusList.find(s => s.code === Number(code))
    return item ? item.label : ''
  }

  return {
    statusList,
    getStatusLabel,
  }
}
