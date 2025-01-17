import {Stack, styled, Text, XStack} from 'tamagui'
import {bigNumberToString} from '../utils/bigNumberToString'
import SvgImage from './Image'
import mapTagSvg from './InsideRouter/components/MarketplaceScreen/images/mapTagSvg'
import revolutSvg from './InsideRouter/components/MarketplaceScreen/images/revolutSvg'
import bankSvg from './InsideRouter/components/MarketplaceScreen/images/bankSvg'
import {type OfferInfo} from '@vexl-next/domain/dist/general/offers'
import {useTranslation} from '../utils/localization/I18nProvider'

const InfoItemContainer = styled(Stack, {
  f: 1,
  ai: 'center',
})

const InfoDivider = styled(Stack, {
  bg: 'rgb(196, 196, 196)',
  w: 1,
  als: 'stretch',
})

const InfoText = styled(Text, {
  col: '$greyOnWhite',
  fos: 14,
  ff: '$body500',
})

const PriceText = styled(InfoText, {
  mb: '$2',
})

const PriceBigger = styled(InfoText, {
  fos: 20,
})

function OfferInfoPreview({
  offer,
  negative,
}: {
  offer: OfferInfo
  negative?: boolean
}): JSX.Element {
  const {t} = useTranslation()
  return (
    <>
      <Text
        fos={20}
        mb="$4"
        color={negative ? '$greyOnBlack' : '$black'}
        ff="$body500"
      >
        {offer.publicPart.offerDescription}
      </Text>
      <XStack>
        <InfoItemContainer>
          <PriceText>
            {t('offer.upTo')}{' '}
            <PriceBigger>
              {bigNumberToString(offer.publicPart.amountTopLimit)}
            </PriceBigger>
          </PriceText>
          <InfoText>
            {offer.publicPart.locationState === 'ONLINE' &&
              t('offer.onlineOnly')}
            {offer.publicPart.locationState === 'IN_PERSON' &&
              t('offer.cashOnly')}
          </InfoText>
        </InfoItemContainer>
        <InfoDivider />
        {offer.publicPart.feeState === 'WITH_FEE' &&
          offer.publicPart.feeAmount !== undefined && (
            <>
              <InfoItemContainer>
                <PriceText>
                  <PriceBigger>{offer.publicPart.feeAmount} %</PriceBigger>
                </PriceText>
                <InfoText>{t('offer.forSeller')}</InfoText>
              </InfoItemContainer>
              <InfoDivider />
            </>
          )}
        <InfoItemContainer>
          <XStack mb="$2">
            {offer.publicPart.paymentMethod.includes('CASH') && (
              <Stack mx="$1">
                <SvgImage source={mapTagSvg} />
              </Stack>
            )}
            {offer.publicPart.paymentMethod.includes('REVOLUT') && (
              <Stack mx="$1">
                <SvgImage source={revolutSvg} />
              </Stack>
            )}
            {offer.publicPart.paymentMethod.includes('BANK') && (
              <Stack mx="$1">
                <SvgImage source={bankSvg} />
              </Stack>
            )}
          </XStack>
          <InfoText>
            {offer.publicPart.paymentMethod
              .map((method) => {
                if (method === 'CASH') {
                  return offer.publicPart.location
                    .map((one) => one.city)
                    .join(', ')
                }
                if (method === 'REVOLUT') {
                  return t('offer.revolut')
                }
                if (method === 'BANK') {
                  return t('offer.bank')
                }
                return null
              })
              .filter(Boolean)
              .join(', ')}
          </InfoText>
        </InfoItemContainer>
      </XStack>
    </>
  )
}

export default OfferInfoPreview
