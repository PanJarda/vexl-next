import {useState} from 'react'
import Screen from '../Screen'
import {HeaderProxy} from '../PageWithButtonAndProgressHeader'
import ProgressJourney from '../ProgressJourney'
import {useNavigation} from '@react-navigation/native'
import useContent from './useContent'
import SvgImage from '../Image'
import {useTranslation} from '../../utils/localization/I18nProvider'
import IconButton from '../IconButton'
import closeSvg from '../images/closeSvg'
import {Stack, Text, XStack} from 'tamagui'

function FaqsScreen(): JSX.Element {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const content = useContent()
  const [page, setPage] = useState<number>(0)
  return (
    <Screen>
      <HeaderProxy hidden showBackButton={true} progressNumber={1} />
      <ProgressJourney
        currentPage={page}
        numberOfPages={content.length}
        onPageChange={setPage}
        onFinish={() => {
          navigation.goBack()
        }}
        onSkip={() => {
          navigation.goBack()
        }}
        withBackButton
      >
        <XStack ai="center" jc="space-between">
          <Text ff="$body600">{t('faqs.faqs')}</Text>
          <IconButton
            variant="light"
            icon={closeSvg}
            onPress={() => {
              navigation.goBack()
            }}
          />
        </XStack>
        <Stack f={1} ai="center" jc="center" w="100%" h="100%">
          <SvgImage source={content[page].svg} />
        </Stack>
        <Text fos={24} ff="$heading" col="$black" mb="$2">
          {content[page].title}
        </Text>
        <Text ff="$body500" col="$greyOnWhite">
          {content[page].text}
        </Text>
      </ProgressJourney>
    </Screen>
  )
}

export default FaqsScreen
