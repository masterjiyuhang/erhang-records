export function handleMe() {
  const me = document.getElementById('me')
}

export function getFormTypeColor(appId) {
  let formTypeColor = '1'
  switch (appId) {
    case 'TPS': // 帮货代  找货代 中文站 b2b
    case 'ZWZ':
    case 'HZH':
    case 'B2B':
    case 'JCB':
    case 'JHB':
    case 'JHBHX':
    case 'JCPAY':
      formTypeColor = '1'
      break
    case 'HWZ': // 海外站
    case 'ERA': // 新主站
    case 'CLUB': // 俱乐部PC
      formTypeColor = '2'
      break
    case 'MPERA': // 新主站
    case 'MPCLUB': // 俱乐部H5
      formTypeColor = '2'
      break
    case 'EVT': // 现在峰会
      formTypeColor = '3'
      break
    default:
      formTypeColor = '1'
      break
  }
  return formTypeColor
}
