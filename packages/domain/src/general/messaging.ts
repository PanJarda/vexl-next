import {z} from 'zod'
import {UserNameAndAvatar} from './UserNameAndAvatar.brand'
import {OfferId} from './offers'
import {UserName} from './UserName.brand'
import {generateUuid, Uuid} from '../utility/Uuid.brand'
import {Base64String} from '../utility/Base64String.brand'
import {UnixMilliseconds} from '../utility/UnixMilliseconds.brand'
import {KeyHolder} from '@vexl-next/cryptography'
import {PublicKeyPemBase64} from '@vexl-next/cryptography/dist/KeyHolder'

export const MessageType = z.enum([
  'MESSAGE',
  'REQUEST_REVEAL',
  'APPROVE_REVEAL',
  'DISAPPROVE_REVEAL',
  'REQUEST_MESSAGING',
  'APPROVE_MESSAGING',
  'DISAPPROVE_MESSAGING',
  'DELETE_CHAT',
  'BLOCK_CHAT',
  'OFFER_DELETED',
  'INBOX_DELETED',
])
export type MessageType = z.TypeOf<typeof MessageType>

export const ChatUserIdentity = z.object({
  publicKey: PublicKeyPemBase64,
  realLifeInfo: UserNameAndAvatar.optional(),
})
export type ChatUserIdentity = z.TypeOf<typeof ChatUserIdentity>

export const DeanonymizedUser = z.object({
  name: UserName,
  imageBase64: Base64String,
})
export type DeanonymizedUser = z.TypeOf<typeof DeanonymizedUser>

export const ChatMessageId = z.string().uuid().brand<'ChatMessageId'>()
export type ChatMessageId = z.TypeOf<typeof ChatMessageId>

//
export const ChatMessagePayload = z.object({
  uuid: ChatMessageId,
  text: z.string(),
  image: Base64String.optional(),
  time: UnixMilliseconds,
  deanonymizedUser: DeanonymizedUser.optional(),
})
export type ChatMessagePayload = z.TypeOf<typeof ChatMessagePayload>

export function generateChatMessageId(): ChatMessageId {
  return ChatMessageId.parse(generateUuid())
}

export const ChatMessage = z.object({
  uuid: ChatMessageId,
  text: z.string(),
  time: UnixMilliseconds,
  image: Base64String.optional(),
  deanonymizedUser: DeanonymizedUser.optional(),
  senderPublicKey: PublicKeyPemBase64,
  messageType: MessageType,
})
export type ChatMessage = z.TypeOf<typeof ChatMessage>
//

export const Inbox = z.object({
  privateKey: KeyHolder.PrivateKeyHolder,
  offerId: OfferId.optional(),
})
export type Inbox = z.TypeOf<typeof Inbox>

export const ChatOrigin = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('myOffer'),
    offerId: OfferId,
  }),
  z.object({
    type: z.literal('theirOffer'),
    offerId: OfferId,
  }),
  z.object({type: z.literal('unknown')}),
])
export type ChatOrigin = z.TypeOf<typeof ChatOrigin>

export const ChatId = z.string().uuid().brand<'chatId'>()
export type ChatId = z.TypeOf<typeof ChatId>

export function generateChatId(): ChatId {
  return ChatId.parse(Uuid.parse(generateUuid()))
}

export const Chat = z.object({
  id: ChatId,
  inbox: Inbox,
  origin: ChatOrigin,
  otherSide: ChatUserIdentity,
  isUnread: z.boolean().default(true),
})
export type Chat = z.TypeOf<typeof Chat>
