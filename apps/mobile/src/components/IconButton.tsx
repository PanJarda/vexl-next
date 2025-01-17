import {type SvgString} from '@vexl-next/domain/dist/utility/SvgString.brand'
import Image from './Image'
import {type StyleProp, TouchableOpacity, type ViewStyle} from 'react-native'
import {useCallback} from 'react'
import {getTokens, Stack, styled} from 'tamagui'

interface Props {
  disabled?: boolean
  icon: SvgString
  onPress: () => void
  style?: StyleProp<ViewStyle>
  variant?: 'dark' | 'light' | 'primary' | 'negative' | 'secondary'
  oval?: boolean
}

const PressableStyled = styled(Stack, {
  dsp: 'flex',
  ai: 'center',
  jc: 'center',
  p: '$3',
  variants: {
    variant: {
      dark: {
        bg: '$grey',
      },
      light: {
        bg: '$greyAccent4',
      },
      primary: {
        bg: '$darkBrown',
      },
      secondary: {
        bg: '$main',
      },
      negative: {
        bg: '$darkRed',
      },
    },
    oval: {
      true: {
        br: 20,
      },
      false: {
        'br': '$5',
      },
    },
  },
})

const touchableStyles: ViewStyle = {
  height: 40,
  width: 40,
}

function IconButton({
  variant = 'dark',
  disabled,
  icon,
  onPress,
  style,
  oval,
}: Props): JSX.Element {
  const onPressInner = useCallback(() => {
    if (!disabled) onPress()
  }, [disabled, onPress])
  const tokens = getTokens()

  return (
    // has to be wrapped in TouchableOpacity as tamagui does not support onPress action on
    // wrapped TouchableOpacity in styled as of v 1.11.1
    <TouchableOpacity
      disabled={disabled}
      onPress={onPressInner}
      style={touchableStyles}
    >
      <PressableStyled
        oval={!!oval}
        variant={variant}
        style={[style, touchableStyles]}
        disabled={disabled}
      >
        <Image
          width={20}
          height={20}
          stroke={
            variant === 'dark'
              ? tokens.color.white.val
              : variant === 'primary'
              ? tokens.color.main.val
              : variant === 'negative'
              ? tokens.color.red.val
              : variant === 'secondary'
              ? 'none'
              : tokens.color.grey.val
          }
          source={icon}
        />
      </PressableStyled>
    </TouchableOpacity>
  )
}

export default IconButton
