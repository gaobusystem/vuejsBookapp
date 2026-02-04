export function useBookStatus() {
  const statusList = [
    { code: 0, label: '未処理' },
    { code: 2, label: '新刊発売' },
    { code: 5, label: '読書中' },
    { code: 6, label: '未読' },
    { code: 8, label: '未発売' },
    { code: 90, label: '完読' },
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
