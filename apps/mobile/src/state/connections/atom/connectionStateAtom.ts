import {atomWithParsedMmkvStorage} from '../../../utils/atomUtils/atomWithParsedMmkvStorage'
import {
  UnixMilliseconds,
  unixMillisecondsNow,
} from '@vexl-next/domain/dist/utility/UnixMilliseconds.brand'
import {ConnectionsState} from '../domain'
import {type ConnectionLevel} from '@vexl-next/rest-api/dist/services/contact/contracts'
import {type ContactPrivateApi} from '@vexl-next/rest-api/dist/services/contact'
import * as TE from 'fp-ts/TaskEither'
import {type ExtractLeftTE} from '@vexl-next/resources-utils/dist/utils/ExtractLeft'
import {type PublicKeyPemBase64} from '@vexl-next/cryptography/dist/KeyHolder'
import {pipe} from 'fp-ts/function'
import {MAX_PAGE_SIZE} from '@vexl-next/rest-api/dist/Pagination.brand'
import type * as T from 'fp-ts/Task'
import {privateApiAtom} from '../../../api'
import {sequenceS} from 'fp-ts/Apply'
import deduplicate from '../../../utils/deduplicate'
import reportError from '../../../utils/reportError'
import {atom} from 'jotai'

const connectionStateAtom = atomWithParsedMmkvStorage(
  'connectionsState',
  {
    lastUpdate: UnixMilliseconds.parse(0),
    firstLevel: [],
    secondLevel: [],
    commonFriends: {commonContacts: []},
  },
  ConnectionsState
)

export default connectionStateAtom

function fetchContacts(
  level: ConnectionLevel,
  api: ContactPrivateApi
): TE.TaskEither<
  ExtractLeftTE<ReturnType<ContactPrivateApi['fetchMyContacts']>>,
  PublicKeyPemBase64[]
> {
  return pipe(
    api.fetchMyContacts({
      level,
      page: 0,
      limit: MAX_PAGE_SIZE,
    }),
    TE.map((one) => one.items.map((oneItem) => oneItem.publicKey))
  )
}

export const syncConnectionsActionAtom = atom(
  null,
  (get, set): T.Task<boolean> => {
    const api = get(privateApiAtom)

    console.log('🦋 Refreshing connections state')
    const updateStarted = unixMillisecondsNow()

    return pipe(
      sequenceS(TE.ApplySeq)({
        firstLevel: fetchContacts('FIRST', api.contact),
        secondLevel: fetchContacts('SECOND', api.contact),
      }),
      TE.bindW('commonFriends', ({firstLevel, secondLevel}) =>
        api.contact.fetchCommonConnections({
          publicKeys: deduplicate([...firstLevel, ...secondLevel]),
        })
      ),
      TE.bindW('lastUpdate', () => TE.right(updateStarted)),
      TE.match(
        (e) => {
          if (e._tag === 'NetworkError') {
            // TODO let user know somehow
            return false
          }
          reportError('warn', 'Unable to refresh connections state', e)
          return false
        },
        (data) => {
          set(connectionStateAtom, data)
          return true
        }
      )
    )
  }
)
