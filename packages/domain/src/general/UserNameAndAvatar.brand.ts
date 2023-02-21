import {z} from 'zod'
import {SvgStringOrImageUri} from '../utility/SvgStringOrImageUri.brand'
import {UserName} from './UserName.brand'

export const UserNameAndAvatar = z
  .object({
    userName: UserName,
    image: SvgStringOrImageUri,
  })
  .brand<'UserNameAndAvatar'>()
export type UserNameAndAvatar = z.TypeOf<typeof UserNameAndAvatar>