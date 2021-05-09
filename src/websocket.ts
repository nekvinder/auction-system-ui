import { ref } from '@vue/reactivity'

const ws = ref<WebSocket>()
export const auction = ref<Auction>()
const auctionServer = 'localhost:8082'

export const connect = () => {
  console.log('connecting...')
  ws.value = new WebSocket(`ws://${auctionServer}/auction`)
  ws.value.onopen = (e) => {
    console.log('connected', e)
    // sendBid() // testing
  }

  ws.value.onmessage = (e) => {
    console.log('RAW MESSAGE:', e.data)
    executeMessage(e.data)
  }
  ws.value.onerror = (e) => {
    console.log('error', e)
  }
  ws.value.onclose = (e) => {
    console.log('close', e)
  }
}

export const disconnect = () => {
  if (ws.value) ws.value.close()
  console.log('Websocket is in disconnected state')
}

export const sendBid = (bidAmount: number) => {
  const data = `[${uuidv4()},PUT_BID,` + JSON.stringify({ auctionId: auction.value?.auctionId, newBid: bidAmount }) + ']'
  console.log(1, 'sending', data)
  if (ws.value) ws.value.send(data)
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export enum ActionType {
  JOIN_AUCTION = 'JOIN_AUCTION',
  UPDATE_AUCTION = 'UPDATE_AUCTION',
  PUT_BID = 'PUT_BID',
}

export interface Auction {
  auctionId: string
  auctionName: string
  remainingTime: number
  connectedUsers: number
  currentBid: number
}

export const executeMessage = (data: string) => {
  const msg = data.replace('[', '').replace(']', '')
  const splitMsg = msg.split(',')
  const messageId = splitMsg[0]
  const actionType: ActionType = splitMsg[1] as ActionType
  const payload = msg.substring(messageId.length + actionType.length + 2)
  switch (actionType) {
    case ActionType.JOIN_AUCTION:
      console.log(actionType, payload)
      auction.value = JSON.parse(payload) as Auction
      break
    case ActionType.UPDATE_AUCTION:
      console.log(actionType, payload)
      auction.value = JSON.parse(payload) as Auction
      break
  }
}
