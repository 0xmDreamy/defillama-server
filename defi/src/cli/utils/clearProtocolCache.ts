import axios from 'axios'
import { deleteProtocolCache } from '../../utils/r2'
import { deleteFromPGCache, getDailyTvlCacheId,  initializeTVLCacheDB } from '../../api2/db'

export async function clearProtocolCache(protocolName: string) {
  const { data: { protocols } } = await axios.get('https://defillama-datasets.llama.fi/lite/protocols2')
  protocolName = protocolName.toLowerCase().trim()
  const protocolId = protocols.find((p: any) => p.name.toLowerCase() === protocolName.toLowerCase())?.defillamaId
  if (protocolId === undefined) {
    return console.log("No protocol with that name!")
  }
  await deleteProtocolCache(protocolId)
  return console.log("Protocol cache deleted: ", protocolName)
}

export async function clearProtocolCacheById(protocolId: string) {
  await initializeTVLCacheDB()
  await deleteProtocolCache(protocolId)
  const pgCaceId = getDailyTvlCacheId(protocolId)
  await deleteFromPGCache(pgCaceId) // clear postgres cache as well
  // add command do it via discord bot
  return console.log("Protocol cache deleted id: ", protocolId)
}