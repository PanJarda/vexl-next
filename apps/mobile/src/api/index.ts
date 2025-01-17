import {atom, useAtomValue} from 'jotai'
import {
  chat,
  contact,
  ENV_PRESETS,
  type EnvPreset,
  offer,
  PlatformName,
  user,
} from '@vexl-next/rest-api'
import {Platform} from 'react-native'
import {dummySession, sessionHolderAtom} from '../state/session'
import {type UserSessionCredentials} from '@vexl-next/rest-api/dist/UserSessionCredentials.brand'
import {type ContactPrivateApi} from '@vexl-next/rest-api/dist/services/contact'
import {type OfferPrivateApi} from '@vexl-next/rest-api/dist/services/offer'
import {type ChatPrivateApi} from '@vexl-next/rest-api/dist/services/chat'
import {type UserPublicApi} from '@vexl-next/rest-api/dist/services/user'
import {apiPreset} from '../utils/environment'
// import {ServiceUrl} from '@vexl-next/rest-api/dist/ServiceUrl.brand'

export const platform = PlatformName.parse(
  Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
)

function getApiPreset(): EnvPreset {
  if (apiPreset === 'prodEnv') {
    return ENV_PRESETS.prodEnv
  }

  return ENV_PRESETS.stageEnv
}

export const apiEnv = getApiPreset()
// export const apiEnv = {
//   userMs: ServiceUrl.parse('http://localhost:8000'),
//   contactMs: ServiceUrl.parse('http://localhost:8003'),
//   offerMs: ServiceUrl.parse('http://localhost:8002'),
//   chatMs: ServiceUrl.parse('http://localhost:8001'),
// }

const _publicApiAtom = atom({
  user: user.publicApi({
    url: apiEnv.userMs,
    platform,
  }),
})

export const publicApiAtom = atom((get) => get(_publicApiAtom))

export function useUserPublicApi(): UserPublicApi {
  return useAtomValue(publicApiAtom).user
}

const sessionCredentialsAtom = atom<UserSessionCredentials>((get) => {
  const session = get(sessionHolderAtom)
  if (session.state !== 'loggedIn') {
    console.warn(
      '👀 User is not logged in. Using dummy session. But user should be logged out.'
    )
    return dummySession.sessionCredentials
  }

  return session.session.sessionCredentials
})

export const privateApiAtom = atom((get) => {
  function getUserSessionCredentials(): UserSessionCredentials {
    const session = get(sessionCredentialsAtom)
    return session
  }

  return {
    contact: contact.privateApi({
      platform,
      url: apiEnv.contactMs,
      getUserSessionCredentials,
    }),
    offer: offer.privateApi({
      platform,
      url: apiEnv.offerMs,
      getUserSessionCredentials,
    }),
    chat: chat.privateApi({
      platform,
      url: apiEnv.chatMs,
      getUserSessionCredentials,
    }),
  }
})

export function usePrivateApiAssumeLoggedIn(): {
  contact: ContactPrivateApi
  offer: OfferPrivateApi
  chat: ChatPrivateApi
} {
  return useAtomValue(privateApiAtom)
}
