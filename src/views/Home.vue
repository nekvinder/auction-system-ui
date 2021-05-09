<template>
  <div></div>
  <h1>Auction : {{ ws.auction.value ? 'Joined' : 'Not Connected' }}</h1>
  <h3>
    <div class="home">
      <table v-if="ws.auction.value">
        <tr>
          <th>Auction Name:</th>
          <td>{{ ws.auction.value.auctionName }}</td>
        </tr>
        <tr>
          <th>Auction Expires In:</th>
          <td>{{ ws.auction.value.remainingTime }} seconds</td>
        </tr>
        <tr>
          <th>Connected Users:</th>
          <td>{{ ws.auction.value.connectedUsers }}</td>
        </tr>
        <tr>
          <th>Current Bid Amount:</th>
          <td>{{ ws.auction.value.currentBid }}</td>
        </tr>
        <tr>
          <th>Put a new Bid:</th>
          <td><input type="number" step="10" v-model="bidValue" /></td>
        </tr>
        <tr>
          <td style="text-align: right" colspan="2"><button @click="sendBid">PUT</button></td>
        </tr>
      </table>
    </div>
  </h3>
</template>

<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core'
import * as ws from '@/websocket'
const bidValue = ref(0)

const sendBid = () => {
  if (ws.auction.value?.currentBid < bidValue.value) ws.sendBid(bidValue.value)
  else alert('Please enter a higher bid than current bid value')
}

onMounted(() => {
  ws.connect()
})
</script>
