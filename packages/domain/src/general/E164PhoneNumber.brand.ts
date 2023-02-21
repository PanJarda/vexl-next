import * as O from 'fp-ts/Option'
import {z} from 'zod'

import {parsePhoneNumber} from 'awesome-phonenumber'

const E164PhoneNumber = z
  .string()
  .refine((value) => {
    return parsePhoneNumber(value).valid
  })
  .brand<'E164PhoneNumber'>()

export type E164PhoneNumber = z.TypeOf<typeof E164PhoneNumber>

export function toE164PhoneNumber(unsafe: string): O.Option<E164PhoneNumber> {
  const {valid, number} = parsePhoneNumber(unsafe)
  if (valid && number?.e164) {
    return O.some(E164PhoneNumber.parse(number.e164))
  }
  return O.none
}
export default E164PhoneNumber